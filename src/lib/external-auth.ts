import { timingSafeEqual } from "crypto";

/**
 * Valida el header `X-API-Key` contra `process.env.MAIN_PORTAL_API_KEY`.
 *
 * Mismo patrón que el endpoint equivalente de MainOps (`hw-SellGear-platform`).
 * Pensado para endpoints `/api/external/*` consumidos por el HW Main Portal.
 *
 * Devuelve:
 *   - `null` si la auth es válida (el handler puede continuar).
 *   - `Response` con error JSON si falla:
 *     - 503 si la env var no está configurada en el server.
 *     - 401 si el header `X-API-Key` está ausente.
 *     - 403 si el header está presente pero no coincide.
 *
 * Uso `crypto.timingSafeEqual` para mitigar timing attacks. La comparación
 * requiere buffers del mismo length, así que comparamos length primero.
 */
export function requireMainPortalAuth(req: Request): Response | null {
  const expected = process.env.MAIN_PORTAL_API_KEY;
  if (!expected) {
    return Response.json(
      {
        error: "MAIN_PORTAL_API_KEY no configurada",
        detail:
          "Set MAIN_PORTAL_API_KEY env var in Vercel (Production + Preview) and redeploy.",
      },
      { status: 503 },
    );
  }

  const provided = req.headers.get("x-api-key") ?? "";
  if (!provided) {
    return Response.json(
      { error: "Missing X-API-Key header" },
      { status: 401 },
    );
  }

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return Response.json({ error: "Invalid API key" }, { status: 403 });
  }

  return null;
}
