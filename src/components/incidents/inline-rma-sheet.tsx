"use client";

import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { RmaForm } from "@/components/rmas/rma-form";
import { fetchProvidersForSelect } from "@/server/actions/rmas";
import { fetchIncidentsForSelect } from "@/server/actions/incidents";
import { createRma } from "@/server/actions/rmas";
import type { RmaFormInput } from "@/lib/validators/rma";
import type { IncidentRow } from "@/server/queries/incidents";
import { invalidateRmaQueries } from "@/lib/query-keys";

interface InlineRmaSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incident: IncidentRow;
}

export function InlineRmaSheet({ open, onOpenChange, incident }: InlineRmaSheetProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: providers = [], isLoading: loadingProviders } = useQuery({
    queryKey: ["providers", "select"],
    queryFn: () => fetchProvidersForSelect(),
    enabled: open,
  });

  const { data: incidents = [], isLoading: loadingIncidents } = useQuery({
    queryKey: ["incidents", "select"],
    queryFn: () => fetchIncidentsForSelect(),
    enabled: open,
  });

  const mutation = useMutation({
    mutationFn: (data: RmaFormInput) => createRma(data),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("RMA creado correctamente");
        queryClient.invalidateQueries({ queryKey: ["linked-rmas", incident.id] });
        invalidateRmaQueries(queryClient);
        onOpenChange(false);
        router.push(`/rmas/${result.data.id}`);
      } else {
        toast.error(result.error);
      }
    },
    onError: () => toast.error("Error al crear RMA"),
  });

  const isLoading = loadingProviders || loadingIncidents;

  // Pre-fill defaults from incident
  const defaultValues: Partial<RmaFormInput> = {
    incidentId: incident.id,
    clientId: incident.clientId ?? "",
    clientLocationId: incident.clientLocationId ?? "",
    clientName: incident.clientCompanyName ?? incident.clientName ?? "",
    clientIntercomUrl: incident.intercomUrl ?? "",
    articleId: incident.articleId ?? "",
    deviceType: incident.deviceType ?? "",
    deviceBrand: incident.deviceBrand ?? "",
    deviceModel: incident.deviceModel ?? "",
    deviceSerialNumber: incident.deviceSerialNumber ?? "",
    phone: incident.contactPhone ?? "",
    address: incident.pickupAddress ?? "",
    postalCode: incident.pickupPostalCode ?? "",
    city: incident.pickupCity ?? "",
    notes: [incident.title, incident.description?.slice(0, 500)].filter(Boolean).join("\n\n"),
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Crear RMA desde {incident.incidentNumber}</SheetTitle>
          <SheetDescription>
            Selecciona el proveedor y verifica los datos pre-rellenados.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Cargando datos...
            </div>
          ) : (
            <RmaForm
              providers={providers}
              incidents={incidents}
              defaultValues={defaultValues}
              onSubmit={(data) => mutation.mutate(data)}
              isSubmitting={mutation.isPending}
              mode="create"
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
