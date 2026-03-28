"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { MessageSquareText, Copy, Check } from "lucide-react";
import { fetchActiveTemplates } from "@/server/actions/message-templates";
import {
  renderTemplate,
  TEMPLATE_CATEGORY_LABELS,
} from "@/lib/constants/message-templates";
import type { MessageTemplateRow } from "@/server/queries/message-templates";

interface TemplatePickerProps {
  /** Key-value map of variables to fill into templates */
  context: Record<string, string>;
}

export function TemplatePicker({ context }: TemplatePickerProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<MessageTemplateRow | null>(null);
  const [copied, setCopied] = useState<"subject" | "body" | "both" | null>(null);

  const { data: templates = [] } = useQuery({
    queryKey: ["message-templates", "active"],
    queryFn: () => fetchActiveTemplates(),
    enabled: open,
  });

  const renderedSubject = selected?.subject
    ? renderTemplate(selected.subject, context)
    : "";
  const renderedBody = selected ? renderTemplate(selected.body, context) : "";

  const copyToClipboard = async (type: "subject" | "body" | "both") => {
    let text = "";
    if (type === "subject") text = renderedSubject;
    else if (type === "body") text = renderedBody;
    else text = renderedSubject ? `${renderedSubject}\n\n${renderedBody}` : renderedBody;

    await navigator.clipboard.writeText(text);
    setCopied(type);
    toast.success("Copiado al portapapeles");
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setSelected(null); }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageSquareText className="mr-2 h-4 w-4" />
          Generar Mensaje
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generar mensaje desde plantilla</DialogTitle>
          <DialogDescription>
            Selecciona una plantilla, revisa el resultado y copia al portapapeles.
          </DialogDescription>
        </DialogHeader>

        {!selected ? (
          /* Template selection */
          <div className="space-y-2">
            {templates.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No hay plantillas activas. Crea una desde Configuración &gt; Plantillas.
              </p>
            ) : (
              templates.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelected(t)}
                  className="w-full text-left rounded-lg border p-3 hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{t.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {TEMPLATE_CATEGORY_LABELS[t.category] ?? t.category}
                    </Badge>
                  </div>
                  {t.subject && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {t.subject}
                    </p>
                  )}
                </button>
              ))
            )}
          </div>
        ) : (
          /* Rendered preview */
          <div className="space-y-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelected(null)}
            >
              &larr; Volver a plantillas
            </Button>

            {renderedSubject && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Asunto</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard("subject")}
                  >
                    {copied === "subject" ? (
                      <Check className="mr-1 h-3 w-3" />
                    ) : (
                      <Copy className="mr-1 h-3 w-3" />
                    )}
                    Copiar asunto
                  </Button>
                </div>
                <div className="rounded-md bg-muted p-3 text-sm">
                  {renderedSubject}
                </div>
              </div>
            )}

            <Separator />

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Cuerpo</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard("body")}
                >
                  {copied === "body" ? (
                    <Check className="mr-1 h-3 w-3" />
                  ) : (
                    <Copy className="mr-1 h-3 w-3" />
                  )}
                  Copiar cuerpo
                </Button>
              </div>
              <div className="rounded-md bg-muted p-3 text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">
                {renderedBody}
              </div>
            </div>

            <Separator />

            <Button
              className="w-full"
              onClick={() => copyToClipboard("both")}
            >
              {copied === "both" ? (
                <Check className="mr-2 h-4 w-4" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              Copiar todo al portapapeles
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
