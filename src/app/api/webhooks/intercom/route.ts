import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { intercomInbox } from "@/lib/db/schema";
import type { IntercomWebhookPayload } from "@/lib/intercom/types";

function verifySignature(body: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const expectedSignature = `sha256=${crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex")}`;
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export async function POST(request: NextRequest) {
  const secret = process.env.INTERCOM_WEBHOOK_SECRET;
  if (!secret) {
    console.error("INTERCOM_WEBHOOK_SECRET no configurado");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get("x-hub-signature-256");

  if (!verifySignature(body, signature, secret)) {
    return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
  }

  let payload: IntercomWebhookPayload;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  // Only process conversation events
  const conversationTopics = [
    "conversation.created",
    "conversation_part.tag.created",
    "conversation.admin.noted",
    "conversation.admin.assigned",
  ];

  if (!conversationTopics.includes(payload.topic)) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const conv = payload.data?.item;
  if (!conv?.id) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  // Extract contact info from conversation
  const contact = conv.contacts?.contacts?.[0];
  const assignee = conv.teammates?.admins?.[0];
  const subject = conv.source?.subject || conv.title || null;

  try {
    await db
      .insert(intercomInbox)
      .values({
        intercomConversationId: String(conv.id),
        contactName: contact?.name ?? null,
        contactEmail: contact?.email ?? null,
        subject,
        assigneeName: assignee?.name ?? null,
        rawPayload: payload,
      })
      .onConflictDoUpdate({
        target: intercomInbox.intercomConversationId,
        set: {
          contactName: contact?.name ?? null,
          contactEmail: contact?.email ?? null,
          subject,
          assigneeName: assignee?.name ?? null,
          rawPayload: payload,
          updatedAt: new Date(),
        },
      });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error procesando webhook Intercom:", err);
    return NextResponse.json({ ok: true }); // Return 200 to prevent Intercom retries
  }
}
