"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MessageSquareText,
  FileCheck,
  Sparkles,
  Loader2,
  ArrowRight,
  Link as LinkIcon,
  ClipboardPaste,
} from "lucide-react";
import { createIncident } from "@/server/actions/incidents";
import {
  INCIDENT_CATEGORIES,
  INCIDENT_PRIORITIES,
  INCIDENT_CATEGORY_LABELS,
  INCIDENT_PRIORITY_LABELS,
} from "@/lib/constants/incidents";
import type {
  IncidentCategory,
  IncidentPriority,
} from "@/lib/constants/incidents";
import type { CreateIncidentInput } from "@/lib/validators/incident";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ParsedIncident {
  clientName: string;
  contactName: string;
  title: string;
  description: string;
  category: IncidentCategory;
  priority: IncidentPriority;
  deviceType: string;
  deviceBrand: string;
  deviceModel: string;
}

// ---------------------------------------------------------------------------
// Parsing helpers
// ---------------------------------------------------------------------------

const DEVICE_KEYWORDS: { pattern: RegExp; device: string }[] = [
  { pattern: /\bTPV\b/i, device: "tpv" },
  { pattern: /\bimpresora\b/i, device: "impresora_lan" },
  { pattern: /\bprinter\b/i, device: "impresora_lan" },
  { pattern: /\bSunmi\b/i, device: "tpv" },
  { pattern: /\bOPAL\b/i, device: "opal" },
  { pattern: /\bcaj[oó]n\b/i, device: "cajon_portamonedas" },
  { pattern: /\bpantalla\b/i, device: "otro" },
  { pattern: /\bmonitor\b/i, device: "otro" },
  { pattern: /\brouter\b/i, device: "otro" },
  { pattern: /\bred\b/i, device: "otro" },
  { pattern: /\bwifi\b/i, device: "otro" },
  { pattern: /\balmacenamiento\b/i, device: "otro" },
  { pattern: /\bSSD\b/i, device: "otro" },
  { pattern: /\bHDD\b/i, device: "otro" },
];

const BRAND_KEYWORDS = ["AQPROX", "Posiflex", "JASSWAY", "GEON", "Sunmi", "Epson", "Star"];

const RESTAURANT_WORDS = [
  "Bar", "Restaurante", "Café", "Cafetería", "Pizzería", "Taberna",
  "Bodega", "Mesón", "Cervecería", "Hostal", "Hotel", "Cantina",
  "Comedor", "Marisquería",
];

const URGENCY_HIGH_PATTERNS = [
  /urgente/i,
  /bloqueado/i,
  /no funciona/i,
  /sin servicio/i,
  /parado/i,
  /ca[íi]do/i,
];

const URGENCY_CRITICAL_PATTERNS = [
  /no puede trabajar/i,
  /perdiendo (ventas|clientes|dinero)/i,
  /cr[íi]tico/i,
  /emergencia/i,
];

function extractEscalationId(url: string): string {
  const match = url.match(/conversation[s]?\/(\d+)/i);
  return match ? match[1] : "";
}

function extractBusinessName(text: string): { clientName: string; contactName: string } {
  // Pattern: "Nombre - NegocioX" at the start of a line or prominent position
  const dashPattern = /^([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*)\s+-\s+([A-ZÁÉÍÓÚÑ][^\n,]{2,50})/m;
  const dashMatch = text.match(dashPattern);
  if (dashMatch) {
    return { contactName: dashMatch[1].trim(), clientName: dashMatch[2].trim() };
  }

  // Look for restaurant/business keywords followed by a name
  const restaurantPattern = new RegExp(
    `(${RESTAURANT_WORDS.join("|")})\\s+([A-ZÁÉÍÓÚÑ][^\\n,.]{1,40})`,
    "i"
  );
  const restaurantMatch = text.match(restaurantPattern);
  if (restaurantMatch) {
    return {
      clientName: `${restaurantMatch[1]} ${restaurantMatch[2]}`.trim(),
      contactName: "",
    };
  }

  // Fallback: look for "Cliente:" or "Restaurante:" label patterns
  const labelPattern = /(?:cliente|restaurante|empresa|local)[:\s]+([A-ZÁÉÍÓÚÑ][^\n,.]{2,60})/i;
  const labelMatch = text.match(labelPattern);
  if (labelMatch) {
    return { clientName: labelMatch[1].trim(), contactName: "" };
  }

  return { clientName: "", contactName: "" };
}

function detectDevice(text: string): {
  device: string;
  brand: string;
} {
  let device = "";

  for (const kw of DEVICE_KEYWORDS) {
    if (kw.pattern.test(text)) {
      device = kw.device;
      break;
    }
  }

  let brand = "";
  for (const b of BRAND_KEYWORDS) {
    if (new RegExp(`\\b${b}\\b`, "i").test(text)) {
      brand = b;
      break;
    }
  }

  // Sunmi implies brand
  if (/\bSunmi\b/i.test(text) && !brand) brand = "Sunmi";

  return { device, brand };
}

function detectPriority(text: string): IncidentPriority {
  for (const p of URGENCY_CRITICAL_PATTERNS) {
    if (p.test(text)) return INCIDENT_PRIORITIES.CRITICA;
  }
  for (const p of URGENCY_HIGH_PATTERNS) {
    if (p.test(text)) return INCIDENT_PRIORITIES.ALTA;
  }
  return INCIDENT_PRIORITIES.MEDIA;
}

function generateTitle(text: string, device: string, brand: string): string {
  // Try to grab first meaningful sentence (not too short, not too long)
  const sentences = text
    .split(/[.!?\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 15 && s.length < 120);

  if (sentences.length > 0) {
    const first = sentences[0];
    // If it looks like a name/greeting, try the second
    const isGreeting = /^(hola|buenos|buenas|gracias|ok|si[,\s])/i.test(first);
    const candidate = isGreeting && sentences[1] ? sentences[1] : first;
    if (candidate.length <= 100) return candidate;
    return candidate.slice(0, 97) + "...";
  }

  // Fallback: compose from device and brand
  const parts: string[] = [];
  if (brand) parts.push(brand);
  if (device) parts.push(device.replace(/_/g, " "));
  return parts.length > 0 ? `Incidencia ${parts.join(" ")}` : "Nueva incidencia desde Intercom";
}

function parseIntercomText(text: string): ParsedIncident {
  const { clientName, contactName } = extractBusinessName(text);
  const { device, brand } = detectDevice(text);
  const priority = detectPriority(text);
  const title = generateTitle(text, device, brand);

  // Use the full text (trimmed) as description, but cap it for readability
  const description = text.trim().slice(0, 2000);

  return {
    clientName,
    contactName,
    title,
    description,
    category: INCIDENT_CATEGORIES.ESCALADO,
    priority,
    deviceType: device,
    deviceBrand: brand,
    deviceModel: "",
  };
}

// ---------------------------------------------------------------------------
// Priority badge colour helper
// ---------------------------------------------------------------------------

function priorityVariant(
  p: IncidentPriority
): "default" | "secondary" | "destructive" | "outline" {
  switch (p) {
    case "critica":
      return "destructive";
    case "alta":
      return "default";
    case "media":
      return "secondary";
    default:
      return "outline";
  }
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function QuickCapturePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [intercomUrl, setIntercomUrl] = useState("");
  const [escalationId, setEscalationId] = useState("");
  const [conversationText, setConversationText] = useState("");
  const [parsed, setParsed] = useState<ParsedIncident | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Editable overrides
  const [clientName, setClientName] = useState("");
  const [contactName, setContactName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<IncidentCategory>(INCIDENT_CATEGORIES.ESCALADO);
  const [priority, setPriority] = useState<IncidentPriority>(INCIDENT_PRIORITIES.MEDIA);
  const [deviceType, setDeviceType] = useState("");
  const [deviceBrand, setDeviceBrand] = useState("");
  const [deviceModel, setDeviceModel] = useState("");

  const createMutation = useMutation({
    mutationFn: (data: CreateIncidentInput) => createIncident(data),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Incidencia creada correctamente");
        queryClient.invalidateQueries({ queryKey: ["incidents"] });
        router.push(`/incidents/${result.data.id}`);
      } else {
        toast.error(result.error ?? "Error al crear la incidencia");
      }
    },
    onError: () => {
      toast.error("Error al crear la incidencia");
    },
  });

  function handleUrlChange(value: string) {
    setIntercomUrl(value);
    const id = extractEscalationId(value);
    if (id) setEscalationId(id);
  }

  function handleAnalyze() {
    if (!conversationText.trim()) {
      toast.error("Pega el texto de la conversación antes de analizar");
      return;
    }
    setIsAnalyzing(true);
    // Simulate brief processing tick for UX feedback
    setTimeout(() => {
      const result = parseIntercomText(conversationText);
      setParsed(result);
      setClientName(result.clientName);
      setContactName(result.contactName);
      setTitle(result.title);
      setDescription(result.description);
      setCategory(result.category);
      setPriority(result.priority);
      setDeviceType(result.deviceType);
      setDeviceBrand(result.deviceBrand);
      setDeviceModel(result.deviceModel);
      setIsAnalyzing(false);
    }, 350);
  }

  function handleCreate() {
    if (!title.trim()) {
      toast.error("El título es obligatorio");
      return;
    }

    createMutation.mutate({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      priority,
      clientName: clientName.trim() || undefined,
      contactName: contactName.trim() || undefined,
      deviceType: (deviceType as CreateIncidentInput["deviceType"]) || undefined,
      deviceBrand: deviceBrand.trim() || undefined,
      deviceModel: deviceModel.trim() || undefined,
      intercomUrl: intercomUrl.trim() || undefined,
      intercomEscalationId: escalationId.trim() || undefined,
    });
  }

  const hasParsed = parsed !== null;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <MessageSquareText className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Captura Rápida desde Intercom</h1>
          <p className="text-sm text-muted-foreground">
            Pega una conversación de Intercom y crea la incidencia en segundos.
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* ---------------------------------------------------------------- */}
        {/* Left column: Input                                                */}
        {/* ---------------------------------------------------------------- */}
        <Card className="border-t-2 border-t-primary">
          <CardHeader className="flex flex-row items-center gap-2 pb-4">
            <ClipboardPaste className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base font-semibold">Datos de Intercom</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Intercom URL */}
            <div className="space-y-1.5">
              <Label htmlFor="intercom-url" className="flex items-center gap-1.5">
                <LinkIcon className="h-3.5 w-3.5 text-muted-foreground" />
                URL de la conversación
              </Label>
              <Input
                id="intercom-url"
                placeholder="https://app.intercom.com/inbox/.../conversation/123456"
                value={intercomUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
              />
              {escalationId && (
                <p className="text-xs text-muted-foreground">
                  ID de escalación detectado:{" "}
                  <span className="font-mono font-medium text-foreground">{escalationId}</span>
                </p>
              )}
            </div>

            <Separator />

            {/* Conversation text */}
            <div className="space-y-1.5">
              <Label htmlFor="conversation-text">Texto de la conversación</Label>
              <Textarea
                id="conversation-text"
                placeholder="Pega aquí el texto de la conversación de Intercom..."
                value={conversationText}
                onChange={(e) => setConversationText(e.target.value)}
                className="min-h-[240px] resize-y font-mono text-sm leading-relaxed"
              />
              <p className="text-xs text-muted-foreground">
                {conversationText.length > 0
                  ? `${conversationText.length} caracteres`
                  : "Copia y pega el hilo completo de la conversación."}
              </p>
            </div>

            {/* Analyze button */}
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !conversationText.trim()}
              className="w-full gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analizar conversación
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* ---------------------------------------------------------------- */}
        {/* Right column: Preview & Create                                    */}
        {/* ---------------------------------------------------------------- */}
        <Card className="border-t-2 border-t-emerald-500">
          <CardHeader className="flex flex-row items-center gap-2 pb-4">
            <FileCheck className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base font-semibold">Vista previa y creación</CardTitle>
          </CardHeader>
          <CardContent>
            {!hasParsed ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                  <MessageSquareText className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pega una conversación y pulsa{" "}
                  <span className="font-semibold text-foreground">Analizar</span>
                </p>
                <p className="max-w-[260px] text-xs text-muted-foreground">
                  Los campos se rellenarán automáticamente. Podrás corregirlos antes de crear la
                  incidencia.
                </p>
                <ArrowRight className="mt-1 h-4 w-4 rotate-180 text-muted-foreground/50" />
              </div>
            ) : (
              /* Parsed preview — editable fields */
              <div
                className="animate-in fade-in slide-in-from-bottom-3 space-y-4 duration-300"
              >
                {/* Client & Contact */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="p-client">Cliente / Restaurante</Label>
                    <Input
                      id="p-client"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Sin detectar"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="p-contact">Contacto</Label>
                    <Input
                      id="p-contact"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Sin detectar"
                    />
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-1.5">
                  <Label htmlFor="p-title">
                    Título{" "}
                    <span className="text-destructive" aria-label="obligatorio">
                      *
                    </span>
                  </Label>
                  <Input
                    id="p-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Título de la incidencia"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label htmlFor="p-description">Descripción</Label>
                  <Textarea
                    id="p-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[100px] resize-y text-sm"
                    placeholder="Descripción detallada del problema"
                  />
                </div>

                {/* Category & Priority */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="p-category">Categoría</Label>
                    <Select
                      value={category}
                      onValueChange={(v) => setCategory(v as IncidentCategory)}
                    >
                      <SelectTrigger id="p-category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(INCIDENT_CATEGORIES).map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {INCIDENT_CATEGORY_LABELS[cat]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="p-priority">Prioridad</Label>
                    <Select
                      value={priority}
                      onValueChange={(v) => setPriority(v as IncidentPriority)}
                    >
                      <SelectTrigger id="p-priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(INCIDENT_PRIORITIES).map((prio) => (
                          <SelectItem key={prio} value={prio}>
                            {INCIDENT_PRIORITY_LABELS[prio]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Device info */}
                <Separator />
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Dispositivo
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="p-device-type">Tipo</Label>
                    <Input
                      id="p-device-type"
                      value={deviceType.replace(/_/g, " ")}
                      onChange={(e) => setDeviceType(e.target.value.replace(/\s/g, "_"))}
                      placeholder="Ej: TPV"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="p-device-brand">Marca</Label>
                    <Input
                      id="p-device-brand"
                      value={deviceBrand}
                      onChange={(e) => setDeviceBrand(e.target.value)}
                      placeholder="Ej: Sunmi"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="p-device-model">Modelo</Label>
                    <Input
                      id="p-device-model"
                      value={deviceModel}
                      onChange={(e) => setDeviceModel(e.target.value)}
                      placeholder="Ej: T2 Mini"
                    />
                  </div>
                </div>

                {/* Summary badges */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <Badge variant={priorityVariant(priority)}>
                    {INCIDENT_PRIORITY_LABELS[priority]}
                  </Badge>
                  <Badge variant="outline">{INCIDENT_CATEGORY_LABELS[category]}</Badge>
                  {escalationId && (
                    <Badge variant="secondary" className="font-mono">
                      #{escalationId}
                    </Badge>
                  )}
                </div>

                <Separator />

                {/* Create button */}
                <Button
                  onClick={handleCreate}
                  disabled={createMutation.isPending || !title.trim()}
                  className="w-full gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
                  size="lg"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creando incidencia...
                    </>
                  ) : (
                    <>
                      <FileCheck className="h-4 w-4" />
                      Crear Incidencia
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
