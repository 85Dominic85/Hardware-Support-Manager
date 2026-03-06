"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TransitionDialog } from "@/components/shared/transition-dialog";
import { transitionIncident } from "@/server/actions/incidents";
import { getAvailableTransitions } from "@/lib/state-machines/incident";
import type { IncidentStatus } from "@/lib/constants/incidents";
import type { UserRole } from "@/lib/constants/roles";
import type { StateTransition } from "@/lib/state-machines/incident";

interface StateTransitionButtonsProps {
  incidentId: string;
  currentStatus: IncidentStatus;
  onTransitionComplete: () => void;
}

export function StateTransitionButtons({
  incidentId,
  currentStatus,
  onTransitionComplete,
}: StateTransitionButtonsProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [selectedTransition, setSelectedTransition] =
    useState<StateTransition | null>(null);

  const userRole = (session?.user?.role ?? "viewer") as UserRole;
  const transitions = getAvailableTransitions(currentStatus, userRole);

  const mutation = useMutation({
    mutationFn: (vars: { toStatus: string; comment?: string }) =>
      transitionIncident({
        incidentId,
        toStatus: vars.toStatus,
        comment: vars.comment,
      }),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Estado actualizado");
        queryClient.invalidateQueries({
          queryKey: ["event-logs", "incident", incidentId],
        });
        onTransitionComplete();
      } else {
        toast.error(result.error);
      }
      setSelectedTransition(null);
    },
    onError: () => {
      toast.error("Error al cambiar el estado");
      setSelectedTransition(null);
    },
  });

  if (transitions.length === 0) return null;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {transitions.map((t) => (
          <Button
            key={`${t.from}-${t.to}`}
            variant={t.to === "cancelado" ? "destructive" : "default"}
            size="sm"
            onClick={() => setSelectedTransition(t)}
          >
            {t.label}
          </Button>
        ))}
      </div>

      <TransitionDialog
        open={!!selectedTransition}
        onConfirm={(comment) =>
          selectedTransition &&
          mutation.mutate({ toStatus: selectedTransition.to, comment })
        }
        onCancel={() => setSelectedTransition(null)}
        transitionLabel={selectedTransition?.label ?? ""}
        isPending={mutation.isPending}
      />
    </>
  );
}
