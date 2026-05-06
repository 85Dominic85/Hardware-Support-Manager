import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { vercelBlobStorage } from "@/lib/storage/vercel-blob";
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from "@/lib/constants/attachments";

export async function POST(request: NextRequest) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("[api/upload] BLOB_READ_WRITE_TOKEN no configurado");
    return NextResponse.json({
      error: "Storage no configurado",
      detail: "Vercel Blob no está conectado en este deploy. Habilita en Dashboard → Storage → Connect Blob.",
    }, { status: 503 });
  }

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No se proporcionó archivo" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "El archivo excede el tamaño máximo permitido (10MB)" }, { status: 400 });
  }

  if (!(ALLOWED_FILE_TYPES as readonly string[]).includes(file.type)) {
    return NextResponse.json({ error: "Tipo de archivo no permitido" }, { status: 400 });
  }

  try {
    const timestamp = Date.now();
    const path = `attachments/${timestamp}-${file.name}`;
    const result = await vercelBlobStorage.upload(file, path);
    return NextResponse.json({ url: result.url, fileName: file.name, fileSize: file.size, fileType: file.type });
  } catch (err) {
    console.error("[api/upload] error:", err);
    const detail = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({
      error: "Error al subir el archivo",
      detail,
    }, { status: 500 });
  }
}
