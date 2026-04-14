/**
 * Detects device information from Intercom conversation/ticket text.
 * Uses regex patterns for known brands, models, and device types.
 */

interface DetectedDevice {
  deviceType?: string;
  deviceBrand?: string;
  deviceModel?: string;
}

// Brand → deviceType mapping
const BRAND_TYPE_MAP: Record<string, string> = {
  sunmi: "TPV",
  jassway: "TPV",
  geon: "TPV",
  posiflex: "TPV",
  opal: "TPV",
  epson: "Printer USB/LAN",
  star: "Printer USB/LAN",
  bixolon: "Printer USB/LAN",
  aqprox: "Printer USB/LAN",
};

// Known brand patterns (case insensitive)
const BRAND_PATTERNS: { pattern: RegExp; brand: string }[] = [
  { pattern: /\bsunmi\b/i, brand: "Sunmi" },
  { pattern: /\bjassway\b/i, brand: "Jassway" },
  { pattern: /\bgeon\b/i, brand: "GEON" },
  { pattern: /\bposiflex\b/i, brand: "Posiflex" },
  { pattern: /\bopal\b/i, brand: "OPAL" },
  { pattern: /\bepson\b/i, brand: "Epson" },
  { pattern: /\bstar\s?micronics\b/i, brand: "Star" },
  { pattern: /\bstar\b/i, brand: "Star" },
  { pattern: /\bbixolon\b/i, brand: "Bixolon" },
  { pattern: /\baqprox\b/i, brand: "AQPROX" },
];

// Known model patterns
const MODEL_PATTERNS: { pattern: RegExp; model: string; brand: string }[] = [
  // Jassway
  { pattern: /\bJWS[-\s]?360\b/i, model: "JWS-360", brand: "Jassway" },
  { pattern: /\bJWS[-\s]?300\b/i, model: "JWS-300", brand: "Jassway" },
  // Sunmi
  { pattern: /\bT2\s?(?:mini|lite|s)?\b/i, model: "T2", brand: "Sunmi" },
  { pattern: /\bV2\s?(?:Pro|s)?\b/i, model: "V2 Pro", brand: "Sunmi" },
  { pattern: /\bD3\s?(?:mini)?\b/i, model: "D3 Mini", brand: "Sunmi" },
  // Epson
  { pattern: /\bTM[-\s]?T20\b/i, model: "TM-T20", brand: "Epson" },
  { pattern: /\bTM[-\s]?T88\b/i, model: "TM-T88", brand: "Epson" },
  { pattern: /\bTM[-\s]?M30\b/i, model: "TM-M30", brand: "Epson" },
];

// Keyword → deviceType (when no specific brand detected)
const TYPE_KEYWORDS: { pattern: RegExp; type: string }[] = [
  { pattern: /\b(?:TPV|POS|terminal|datáfono|datafono)\b/i, type: "TPV" },
  { pattern: /\b(?:impresora|printer|ticket|térmica|termica)\b/i, type: "Printer USB/LAN" },
  { pattern: /\b(?:cajón|cajon|portamonedas|cash\s?drawer)\b/i, type: "Cajón" },
  { pattern: /\b(?:router|red|wifi|wi-fi|internet|conectividad)\b/i, type: "Router" },
  { pattern: /\b(?:KDS|pantalla\s?cocina|kitchen\s?display)\b/i, type: "KDS" },
  { pattern: /\b(?:tablet|tableta)\b/i, type: "Tablet" },
];

/**
 * Analyze text to detect device brand, model, and type.
 * Checks model patterns first (most specific), then brands, then keywords.
 */
export function detectDevice(text: string): DetectedDevice {
  if (!text) return {};

  const result: DetectedDevice = {};

  // 1. Try to match specific models first (most reliable)
  for (const { pattern, model, brand } of MODEL_PATTERNS) {
    if (pattern.test(text)) {
      result.deviceModel = model;
      result.deviceBrand = brand;
      result.deviceType = BRAND_TYPE_MAP[brand.toLowerCase()] ?? undefined;
      return result;
    }
  }

  // 2. Try to match brand
  for (const { pattern, brand } of BRAND_PATTERNS) {
    if (pattern.test(text)) {
      result.deviceBrand = brand;
      result.deviceType = BRAND_TYPE_MAP[brand.toLowerCase()] ?? undefined;
      break;
    }
  }

  // 3. If no type detected yet, try keyword-based type detection
  if (!result.deviceType) {
    for (const { pattern, type } of TYPE_KEYWORDS) {
      if (pattern.test(text)) {
        result.deviceType = type;
        break;
      }
    }
  }

  return result;
}

/**
 * Extract serial number patterns from text.
 * Looks for explicit labels and common serial number formats.
 */
export function extractSerialNumber(text: string): string | null {
  if (!text) return null;

  // Explicit patterns: "S/N: ABC123", "Serial: ABC123", "Nº serie: ABC123"
  const explicitPatterns = [
    /(?:S\/N|Serial|N[ºo°]\s*(?:de\s*)?serie|serial\s*(?:number|num|no)?)[\s:]+([A-Za-z0-9][\w-]{4,30})/i,
  ];

  for (const pattern of explicitPatterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1].trim();
  }

  return null;
}
