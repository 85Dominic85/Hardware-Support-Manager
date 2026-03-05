export const USER_ROLES = {
  ADMIN: "admin",
  TECHNICIAN: "technician",
  VIEWER: "viewer",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrador",
  technician: "Técnico",
  viewer: "Visor",
};
