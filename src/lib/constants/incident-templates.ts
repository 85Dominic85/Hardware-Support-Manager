export interface IncidentTemplate {
  id: string;
  name: string;
  category: string;
  priority: string;
  deviceType: string;
  title: string;
  description: string;
}

export const INCIDENT_TEMPLATES: IncidentTemplate[] = [
  {
    id: "tpv-no-enciende",
    name: "TPV no enciende / no responde",
    category: "escalado",
    priority: "alta",
    deviceType: "TPV",
    title: "TPV no enciende",
    description:
      "El terminal punto de venta no enciende o no responde al pulsar el botón de encendido.\n\nVerificaciones iniciales:\n- Cable de alimentación conectado\n- Enchufe con corriente\n- Indicador LED del cargador",
  },
  {
    id: "tpv-fallo-software",
    name: "TPV fallo software / reinicio",
    category: "escalado",
    priority: "media",
    deviceType: "TPV",
    title: "TPV fallo de software / requiere reinicio",
    description:
      "El terminal punto de venta presenta fallos de software: pantalla congelada, app no responde, errores recurrentes o reinicio en bucle.",
  },
  {
    id: "impresora-no-imprime",
    name: "Impresora no imprime / desconectada",
    category: "escalado",
    priority: "media",
    deviceType: "Printer USB/LAN",
    title: "Impresora no imprime",
    description:
      "La impresora de tickets no imprime o aparece como desconectada.\n\nVerificaciones iniciales:\n- Cable USB/LAN conectado\n- Impresora encendida (luz indicadora)\n- Papel cargado correctamente",
  },
  {
    id: "impresora-error-corte",
    name: "Impresora error de corte / atasco",
    category: "escalado",
    priority: "baja",
    deviceType: "Printer USB/LAN",
    title: "Impresora error de corte / atasco de papel",
    description:
      "La impresora presenta problemas con el mecanismo de corte o atasco de papel.\n\nSíntomas:\n- Corte incompleto del ticket\n- Papel atascado en la salida\n- Ruido anormal al cortar",
  },
  {
    id: "problema-red",
    name: "Problema de red / WiFi",
    category: "escalado",
    priority: "media",
    deviceType: "Router",
    title: "Problema de conectividad de red",
    description:
      "El establecimiento reporta problemas de conectividad: sin acceso a internet, WiFi intermitente o dispositivos desconectados de la red local.",
  },
];
