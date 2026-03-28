"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { TemplateForm } from "@/components/message-templates/template-form";
import { updateMessageTemplate } from "@/server/actions/message-templates";
import type { MessageTemplateFormInput } from "@/lib/validators/message-template";
import type { MessageTemplateRow } from "@/server/queries/message-templates";

interface EditTemplatePageProps {
  template: MessageTemplateRow;
}

export function EditTemplatePage({ template }: EditTemplatePageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data: MessageTemplateFormInput) =>
      updateMessageTemplate(template.id, data),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Plantilla actualizada correctamente");
        queryClient.invalidateQueries({ queryKey: ["message-templates"] });
        router.push("/settings/templates");
      } else {
        toast.error(result.error);
      }
    },
    onError: () => {
      toast.error("Error al actualizar la plantilla");
    },
  });

  return (
    <Card>
      <CardContent className="pt-6">
        <TemplateForm
          defaultValues={{
            name: template.name,
            category: template.category as "cliente" | "proveedor",
            subject: template.subject ?? "",
            body: template.body,
            variables: template.variables,
            sortOrder: template.sortOrder,
            isActive: template.isActive,
          }}
          onSubmit={(data) => updateMutation.mutate(data)}
          isSubmitting={updateMutation.isPending}
          mode="edit"
        />
      </CardContent>
    </Card>
  );
}
