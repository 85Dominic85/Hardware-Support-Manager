"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ExternalLink, Loader2, CheckCircle, X } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { InboxStatusBadge } from "./inbox-status-badge";
import { convertToIncident, dismissInboxItem } from "@/server/actions/intercom-inbox";
import { INCIDENT_CATEGORY_LABELS, type IncidentCategory } from "@/lib/constants/incidents";
import { formatRelativeTime } from "@/lib/utils/date-format";
import type { IntercomInboxRow } from "@/server/queries/intercom-inbox";
import type { IntercomInboxStatus } from "@/lib/constants/intercom";
import type { IntercomWebhookPayload } from "@/lib/intercom/types";

interface ConversationDetailProps {
  item: IntercomInboxRow;
  onConvert: () => void;
  onDismiss: () => void;
}

function extractSnippet(payload: unknown): string {
  try {
    const p = payload as IntercomWebhookPayload;
    const body = p?.data?.item?.source?.body;
    if (body) return body.slice(0, 500);
  } catch { /* ignore */ }
  return "";
}

function detectCategory(text: string): IncidentCategory {
  const lower = text.toLowerCase();
  if (/tpv|sunmi|opal|flint|terminal/.test(lower)) return "hardware";
  if (/impresora|printer|epson|star/.test(lower)) return "impresora";
  if (/caj[oó]n|portamonedas|cash/.test(lower)) return "hardware";
  if (/red|wifi|internet|router|ethernet/.test(lower)) return "red";
  if (/monitor|pantalla|display/.test(lower)) return "monitor";
  return "otro";
}

function detectPriority(text: string): "baja" | "media" | "alta" | "critica" {
  const lower = text.toLowerCase();
  if (/no puede trabajar|perdiendo dinero|cr[ií]tico|emergencia/.test(lower)) return "critica";
  if (/urgente|bloqueado|no funciona|sin servicio/.test(lower)) return "alta";
  return "media";
}

export function ConversationDetail({ item, onConvert, onDismiss }: ConversationDetailProps) {
  const snippet = extractSnippet(item.rawPayload);
  const intercomUrl = `https://app.intercom.com/a/inbox/conversation/${item.intercomConversationId}`;

  // Pre-fill form from parsed data
  const [title, setTitle] = useState(item.subject ?? "");
  const [description, setDescription] = useState(snippet);
  const [category, setCategory] = useState<IncidentCategory>(detectCategory(snippet || item.subject || ""));
  const [priority, setPriority] = useState(detectPriority(snippet || item.subject || ""));

  const convertMutation = useMutation({
    mutationFn: () =>
      convertToIncident({
        inboxItemId: item.id,
        title: title.trim() || item.subject || "Incidencia desde Intercom",
        description,
        category,
        priority,
        clientName: item.contactName ?? "",
        contactName: item.contactName ?? "",
      }),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(`Incidencia ${result.data.incidentNumber} creada`, {
          action: {
            label: "Ver",
            onClick: () => window.open(`/incidents/${result.data.incidentId}`, "_self"),
          },
        });
        onConvert();
      } else {
        toast.error(result.error);
      }
    },
    onError: () => toast.error("Error al crear incidencia"),
  });

  const dismissMutation = useMutation({
    mutationFn: () => dismissInboxItem({ inboxItemId: item.id }),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Conversación descartada");
        onDismiss();
      } else {
        toast.error(result.error);
      }
    },
  });

  const isConverted = item.status === "convertida";
  const isDismissed = item.status === "descartada";
  const isPending = item.status === "pendiente";

  return (
    <div
      className="p-6 space-y-5"
      style={{ animation: "fadeInUp 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">
            {item.contactName ?? item.contactEmail ?? "Contacto desconocido"}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <InboxStatusBadge status={item.status as IntercomInboxStatus} />
            <span className="text-xs text-muted-foreground font-mono">
              #{item.intercomConversationId}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(item.receivedAt)}
            </span>
          </div>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <a href={intercomUrl} target="_blank" rel="noopener noreferrer">
            Ver en Intercom <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </Button>
      </div>

      {/* Converted link */}
      {isConverted && item.convertedIncidentNumber && (
        <div
          className="flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-3"
          style={{ animation: "scaleIn 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
        >
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <span className="text-sm">
            Convertida a{" "}
            <Link
              href={`/incidents/${item.convertedIncidentId}`}
              className="font-mono font-semibold text-primary hover:underline"
            >
              {item.convertedIncidentNumber}
            </Link>
          </span>
        </div>
      )}

      {/* Subject */}
      {item.subject && (
        <div>
          <p className="text-sm font-medium">{item.subject}</p>
        </div>
      )}

      {/* Conversation snippet */}
      {snippet && (
        <div className="rounded-lg bg-muted/30 p-4 max-h-48 overflow-y-auto">
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{snippet}</p>
        </div>
      )}

      {/* Create incident form (only for pending items) */}
      {isPending && (
        <>
          <Separator className="bg-border/40" />
          <div className="space-y-4">
            <h4 className="flex items-center gap-3 text-sm font-semibold text-foreground uppercase tracking-wide">
              <span className="h-4 w-1 rounded-full bg-primary" />
              Crear Incidencia
            </h4>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2 space-y-1.5">
                <Label className="text-xs">Título</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Título de la incidencia"
                />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <Label className="text-xs">Descripción</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Categoría</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as IncidentCategory)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(INCIDENT_CATEGORY_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Prioridad</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as typeof priority)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baja">Baja</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="critica">Crítica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <Button
                onClick={() => convertMutation.mutate()}
                disabled={convertMutation.isPending || !title.trim()}
                className="flex-1 sm:flex-none"
              >
                {convertMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Crear Incidencia
              </Button>
              <Button
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={() => dismissMutation.mutate()}
                disabled={dismissMutation.isPending}
              >
                <X className="mr-1 h-4 w-4" />
                Descartar
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Dismissed state */}
      {isDismissed && (
        <div className="flex items-center gap-2 rounded-lg bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
          <X className="h-4 w-4" />
          Conversación descartada
        </div>
      )}

      {/* Metadata */}
      <Separator className="bg-border/40" />
      <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
        {item.contactEmail && (
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-medium">{item.contactEmail}</dd>
          </div>
        )}
        {item.assigneeName && (
          <div>
            <dt className="text-muted-foreground">Asignado en Intercom</dt>
            <dd className="font-medium">{item.assigneeName}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
