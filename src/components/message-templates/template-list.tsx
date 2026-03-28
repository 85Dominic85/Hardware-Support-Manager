"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import {
  fetchMessageTemplates,
  deleteMessageTemplate,
} from "@/server/actions/message-templates";
import { TEMPLATE_CATEGORY_LABELS } from "@/lib/constants/message-templates";
import { Pencil, Trash2, Plus } from "lucide-react";
import type { MessageTemplateRow } from "@/server/queries/message-templates";

interface TemplateListProps {
  initialData: MessageTemplateRow[];
}

export function TemplateList({ initialData }: TemplateListProps) {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: templates = initialData } = useQuery({
    queryKey: ["message-templates"],
    queryFn: () => fetchMessageTemplates(),
    initialData,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMessageTemplate(id),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Plantilla eliminada");
        queryClient.invalidateQueries({ queryKey: ["message-templates"] });
      } else {
        toast.error(result.error);
      }
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Error al eliminar la plantilla");
      setDeleteId(null);
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {templates.length} plantilla{templates.length !== 1 ? "s" : ""}
        </p>
        <Button asChild size="sm">
          <Link href="/settings/templates/new">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Plantilla
          </Link>
        </Button>
      </div>

      {templates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">No hay plantillas creadas.</p>
            <Button asChild className="mt-4" variant="outline">
              <Link href="/settings/templates/new">Crear primera plantilla</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {templates.map((t) => (
            <Card key={t.id} className={!t.isActive ? "opacity-60" : undefined}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      {t.name}
                      {!t.isActive && (
                        <Badge variant="outline" className="text-xs">
                          Inactiva
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {TEMPLATE_CATEGORY_LABELS[t.category] ?? t.category}
                      </Badge>
                      {t.subject && (
                        <span className="text-xs truncate max-w-[300px]">
                          {t.subject}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/settings/templates/${t.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(t.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap line-clamp-3 font-sans">
                  {t.body}
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        isLoading={deleteMutation.isPending}
        title="Eliminar plantilla"
        description="¿Seguro que quieres eliminar esta plantilla? Esta acción no se puede deshacer."
      />
    </div>
  );
}
