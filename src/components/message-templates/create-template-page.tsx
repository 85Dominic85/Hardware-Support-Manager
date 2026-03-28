"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { TemplateForm } from "@/components/message-templates/template-form";
import { createMessageTemplate } from "@/server/actions/message-templates";
import type { MessageTemplateFormInput } from "@/lib/validators/message-template";

export function CreateTemplatePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: MessageTemplateFormInput) => createMessageTemplate(data),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Plantilla creada correctamente");
        queryClient.invalidateQueries({ queryKey: ["message-templates"] });
        router.push("/settings/templates");
      } else {
        toast.error(result.error);
      }
    },
    onError: () => {
      toast.error("Error al crear la plantilla");
    },
  });

  return (
    <Card>
      <CardContent className="pt-6">
        <TemplateForm
          onSubmit={(data) => createMutation.mutate(data)}
          isSubmitting={createMutation.isPending}
          mode="create"
        />
      </CardContent>
    </Card>
  );
}
