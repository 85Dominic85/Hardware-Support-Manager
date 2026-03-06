"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface TransitionDialogProps {
  open: boolean;
  onConfirm: (comment?: string) => void;
  onCancel: () => void;
  transitionLabel: string;
  isPending: boolean;
}

export function TransitionDialog({
  open,
  onConfirm,
  onCancel,
  transitionLabel,
  isPending,
}: TransitionDialogProps) {
  const [comment, setComment] = useState("");

  const handleConfirm = () => {
    onConfirm(comment.trim() || undefined);
    setComment("");
  };

  const handleCancel = () => {
    setComment("");
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar: {transitionLabel}</DialogTitle>
          <DialogDescription>
            Esta acción cambiará el estado del registro.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="transition-comment">Comentario (opcional)</Label>
          <Textarea
            id="transition-comment"
            placeholder="Añadir un comentario sobre esta transición..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={isPending}>
            {isPending ? "Procesando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
