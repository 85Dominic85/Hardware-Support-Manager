import { auth } from "./index";
import type { UserRole } from "@/lib/constants/roles";

export async function getRequiredSession() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Sesión expirada. Recarga la página e inicia sesión de nuevo.");
  }
  return session;
}

export async function requireRole(...roles: UserRole[]) {
  const session = await getRequiredSession();
  if (!roles.includes(session.user.role as UserRole)) {
    throw new Error("No tienes permisos para esta acción.");
  }
  return session;
}
