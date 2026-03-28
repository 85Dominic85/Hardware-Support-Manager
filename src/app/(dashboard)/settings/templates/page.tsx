import type { Metadata } from "next";
import { MessageSquareText } from "lucide-react";
import { getMessageTemplates } from "@/server/queries/message-templates";
import { TemplateList } from "@/components/message-templates/template-list";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Plantillas de Mensajes",
};

export default async function TemplatesPage() {
  const templates = await getMessageTemplates();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <MessageSquareText className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Plantillas de Mensajes</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona las plantillas para generar mensajes a clientes y proveedores
          </p>
        </div>
      </div>
      <TemplateList initialData={templates} />
    </div>
  );
}
