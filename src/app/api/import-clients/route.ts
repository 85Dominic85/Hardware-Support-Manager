import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema";
import { isNull } from "drizzle-orm";
import { auth } from "@/lib/auth";

interface CsvRow {
  id?: string;
  name: string;
  client_pnp?: string;
}

function parseCsv(text: string): CsvRow[] {
  const lines = text.split("\n");
  if (lines.length < 2) return [];

  const headers = parseRow(lines[0]);
  const rows: CsvRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseRow(line);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h.trim()] = (values[idx] ?? "").trim();
    });

    if (row.name) {
      rows.push({
        id: row.id || undefined,
        name: row.name,
        client_pnp: row.client_pnp || "",
      });
    }
  }

  return rows;
}

function parseRow(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        result.push(current);
        current = "";
      } else {
        current += char;
      }
    }
  }
  result.push(current);
  return result;
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se ha proporcionado un archivo" }, { status: 400 });
    }

    const text = await file.text();
    const csvRows = parseCsv(text);

    if (csvRows.length === 0) {
      return NextResponse.json({ error: "El archivo CSV está vacío o no tiene datos válidos" }, { status: 400 });
    }

    // Get all existing client names (lowercased) for dedup
    const existingClients = await db
      .select({ name: clients.name })
      .from(clients)
      .where(isNull(clients.deletedAt));

    const existingNames = new Set(
      existingClients.map((c) => c.name.toLowerCase().trim())
    );

    // Filter only new clients
    const newClients = csvRows.filter(
      (row) => !existingNames.has(row.name.toLowerCase().trim())
    );

    if (newClients.length === 0) {
      return NextResponse.json({
        imported: 0,
        skipped: csvRows.length,
        total: csvRows.length,
        message: "Todos los clientes del CSV ya existen",
      });
    }

    // Insert in batches of 100
    const batchSize = 100;
    let imported = 0;

    for (let i = 0; i < newClients.length; i += batchSize) {
      const batch = newClients.slice(i, i + batchSize).map((row) => ({
        name: row.name,
        clientPnp: row.client_pnp === "true",
      }));

      await db.insert(clients).values(batch);
      imported += batch.length;
    }

    return NextResponse.json({
      imported,
      skipped: csvRows.length - newClients.length,
      total: csvRows.length,
      message: `${imported} clientes importados, ${csvRows.length - newClients.length} ya existían`,
    });
  } catch (error) {
    console.error("CSV import error:", error);
    return NextResponse.json(
      { error: "Error al procesar el archivo CSV" },
      { status: 500 }
    );
  }
}
