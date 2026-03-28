import { notFound } from "next/navigation";
import { getMessageTemplateById } from "@/server/queries/message-templates";
import { EditTemplatePage } from "@/components/message-templates/edit-template-page";

interface EditTemplatePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTemplateRoute({
  params,
}: EditTemplatePageProps) {
  const { id } = await params;
  const template = await getMessageTemplateById(id);

  if (!template) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Editar Plantilla</h1>
      <EditTemplatePage template={template} />
    </div>
  );
}
