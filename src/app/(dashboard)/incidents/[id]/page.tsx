import { notFound } from "next/navigation";
import { IncidentDetail } from "@/components/incidents/incident-detail";
import { getIncidentById } from "@/server/queries/incidents";

export default async function IncidentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const incident = await getIncidentById(id);

  if (!incident) {
    notFound();
  }

  return <IncidentDetail incident={incident} />;
}
