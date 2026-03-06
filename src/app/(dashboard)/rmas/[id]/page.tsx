import { notFound } from "next/navigation";
import { RmaDetail } from "@/components/rmas/rma-detail";
import { getRmaById } from "@/server/queries/rmas";

export default async function RmaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rma = await getRmaById(id);

  if (!rma) {
    notFound();
  }

  return <RmaDetail rma={rma} />;
}
