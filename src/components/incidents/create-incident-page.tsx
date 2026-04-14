"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Inbox, PenLine } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IncidentForm } from "@/components/incidents/incident-form";
import { IntercomImportTab } from "@/components/incidents/intercom-import-tab";
import { createIncident, fetchUsersForSelect } from "@/server/actions/incidents";
import type { CreateIncidentInput } from "@/lib/validators/incident";

export function CreateIncidentPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: users = [] } = useQuery({
    queryKey: ["users", "select"],
    queryFn: () => fetchUsersForSelect(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateIncidentInput) => createIncident(data),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Incidencia creada correctamente");
        queryClient.invalidateQueries({ queryKey: ["incidents"] });
        router.push("/incidents");
      } else {
        toast.error(result.error);
      }
    },
    onError: () => {
      toast.error("Error al crear la incidencia");
    },
  });

  return (
    <Tabs defaultValue="intercom" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="intercom" className="gap-2">
          <Inbox className="h-4 w-4" />
          Desde Bandeja
        </TabsTrigger>
        <TabsTrigger value="manual" className="gap-2">
          <PenLine className="h-4 w-4" />
          Manual
        </TabsTrigger>
      </TabsList>

      <TabsContent value="intercom">
        <Card>
          <CardContent className="pt-6">
            <IntercomImportTab
              onIncidentCreated={() => {
                queryClient.invalidateQueries({ queryKey: ["incidents"] });
                router.push("/incidents");
              }}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="manual">
        <Card>
          <CardContent className="pt-6">
            <IncidentForm
              users={users}
              onSubmit={(data) => createMutation.mutate(data)}
              isSubmitting={createMutation.isPending}
              mode="create"
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
