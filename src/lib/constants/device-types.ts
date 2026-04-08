export const DEVICE_TYPES = [
  "TPV",
  "Printer USB/LAN",
  "Printer WiFi",
  "Cajón",
  "Router",
  "KDS",
  "Tablet",
  "Pincho WiFi USB",
  "otro",
  "desconocido",
] as const;

export type DeviceType = (typeof DEVICE_TYPES)[number];

export const DEVICE_TYPE_LABELS: Record<DeviceType, string> = {
  "TPV": "TPV",
  "Printer USB/LAN": "Impresora USB/LAN",
  "Printer WiFi": "Impresora WiFi",
  "Cajón": "Cajón",
  "Router": "Router",
  "KDS": "KDS (Pantalla cocina)",
  "Tablet": "Tablet",
  "Pincho WiFi USB": "Pincho WiFi USB",
  "otro": "Otro",
  "desconocido": "Desconocido",
};
