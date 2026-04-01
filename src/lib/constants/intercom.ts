export const INTERCOM_INBOX_STATUSES = {
  PENDIENTE: "pendiente",
  CONVERTIDA: "convertida",
  DESCARTADA: "descartada",
} as const;

export type IntercomInboxStatus =
  (typeof INTERCOM_INBOX_STATUSES)[keyof typeof INTERCOM_INBOX_STATUSES];

export const INTERCOM_INBOX_STATUS_LABELS: Record<IntercomInboxStatus, string> = {
  pendiente: "Pendiente",
  convertida: "Convertida",
  descartada: "Descartada",
};
