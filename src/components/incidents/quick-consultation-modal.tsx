"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Zap, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createQuickConsultation } from "@/server/actions/incidents";

/**
 * Modal de "Consulta rápida" — registra una incidencia ya resuelta para
 * trackear consultas in-situ. Form mínimo: título obligatorio, resto opcional.
 *
 * Activación:
 *   - Botón en header del dashboard.
 *   - Shortcut Ctrl+Q (registrado en `<QuickConsultationProvider>`).
 *
 * Submit:
 *   - createQuickConsultation server action.
 *   - Toast confirmación con minutos invertidos.
 *   - Reset form + close modal + invalidate queries.
 */

// ─── Provider context ────────────────────────────────────────────────────────

interface QuickConsultationContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const QuickConsultationContext = createContext<QuickConsultationContextValue | null>(null);

/** Hook para abrir el modal desde cualquier componente cliente. */
export function useQuickConsultation() {
  const ctx = useContext(QuickConsultationContext);
  if (!ctx) {
    throw new Error("useQuickConsultation debe usarse dentro de <QuickConsultationProvider>");
  }
  return ctx;
}

/**
 * Provider que mantiene el estado del modal y registra el shortcut Ctrl+Q.
 * Renderiza el modal a nivel layout para que esté disponible en todas las
 * páginas del dashboard.
 */
export function QuickConsultationProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  // Shortcut global Ctrl+Q (Cmd+Q en Mac).
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      const isQ = e.key === "q" || e.key === "Q";
      if (isCtrlOrCmd && isQ && !e.altKey && !e.shiftKey) {
        // Evitar abrir si ya hay un input/textarea con foco que use Ctrl+Q nativo.
        const target = e.target as HTMLElement | null;
        const isTyping =
          target?.tagName === "INPUT" ||
          target?.tagName === "TEXTAREA" ||
          target?.isContentEditable;
        // Permitimos disparar el modal incluso escribiendo (es un atajo global,
        // no esperamos colisiones con Ctrl+Q de campos de texto). Si el modal
        // ya está abierto, no toggle — mantén el foco interno.
        void isTyping;
        e.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <QuickConsultationContext.Provider value={{ open, setOpen }}>
      {children}
      <QuickConsultationModal open={open} onOpenChange={setOpen} />
    </QuickConsultationContext.Provider>
  );
}

// ─── Modal ───────────────────────────────────────────────────────────────────

interface QuickConsultationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function QuickConsultationModal({ open, onOpenChange }: QuickConsultationModalProps) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [durationMinutes, setDurationMinutes] = useState<string>("");
  const [description, setDescription] = useState("");
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Foco al abrir.
  useEffect(() => {
    if (open) {
      // Defer until dialog mount.
      const t = setTimeout(() => titleInputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  const reset = useCallback(() => {
    setTitle("");
    setClientName("");
    setDurationMinutes("");
    setDescription("");
  }, []);

  const mutation = useMutation({
    mutationFn: async (input: {
      title: string;
      description?: string;
      clientName?: string;
      durationMinutes?: number;
    }) => createQuickConsultation(input),
    onSuccess: (result, variables) => {
      if (result.success) {
        const minLabel =
          typeof variables.durationMinutes === "number" && variables.durationMinutes > 0
            ? ` · ${variables.durationMinutes} min`
            : "";
        toast.success(`Consulta registrada${minLabel}`);
        queryClient.invalidateQueries({ queryKey: ["incidents"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        reset();
        onOpenChange(false);
      } else {
        toast.error(result.error ?? "Error al registrar la consulta");
      }
    },
    onError: () => {
      toast.error("Error al registrar la consulta");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Escribe brevemente qué resolviste");
      titleInputRef.current?.focus();
      return;
    }
    const minutes = durationMinutes.trim() === "" ? undefined : Number(durationMinutes);
    mutation.mutate({
      title: title.trim(),
      description: description.trim() || undefined,
      clientName: clientName.trim() || undefined,
      durationMinutes: minutes,
    });
  }

  // Ctrl+Enter dentro del modal → submit. Esc cierra (nativo de Dialog).
  function handleKeyDown(e: React.KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  const isSubmitting = mutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        onKeyDown={handleKeyDown}
        // Evitar que se cierre al hacer click fuera por error.
        onPointerDownOutside={(e) => {
          if (isSubmitting) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            Consulta rápida
          </DialogTitle>
          <DialogDescription>
            Registra una consulta resuelta in-situ. Solo el título es obligatorio.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="qc-title">Qué resolviste</Label>
            <Input
              id="qc-title"
              ref={titleInputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ej. Reset TPV de barra"
              maxLength={500}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="qc-client">
                Cliente <span className="text-muted-foreground text-xs">(opcional)</span>
              </Label>
              <Input
                id="qc-client"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Nombre o local"
                maxLength={255}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="qc-minutes">
                Minutos <span className="text-muted-foreground text-xs">(opcional)</span>
              </Label>
              <Input
                id="qc-minutes"
                type="number"
                min={0}
                max={1440}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                placeholder="5"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="qc-description">
              Notas <span className="text-muted-foreground text-xs">(opcional)</span>
            </Label>
            <Textarea
              id="qc-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles si es relevante para futuras referencias…"
              rows={3}
              maxLength={5000}
              disabled={isSubmitting}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <p className="hidden text-xs text-muted-foreground sm:mr-auto sm:flex sm:items-center">
              <kbd className="rounded border px-1 font-mono text-[10px]">Ctrl</kbd>
              <span className="mx-1">+</span>
              <kbd className="rounded border px-1 font-mono text-[10px]">Enter</kbd>
              <span className="ml-1">para guardar</span>
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-1">
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4" />
              )}
              Registrar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
