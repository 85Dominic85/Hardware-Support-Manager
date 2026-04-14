"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Inbox, Loader2 } from "lucide-react";
import { fetchIntercomInbox } from "@/server/actions/intercom-inbox";
import { ConversationDetail } from "@/components/intercom/conversation-detail";
import { InboxStatusBadge } from "@/components/intercom/inbox-status-badge";
import { formatRelativeTime } from "@/lib/utils/date-format";
import type { IntercomInboxRow } from "@/server/queries/intercom-inbox";

interface IntercomImportTabProps {
  onIncidentCreated: () => void;
}

export function IntercomImportTab({ onIncidentCreated }: IntercomImportTabProps) {
  const [selectedItem, setSelectedItem] = useState<IntercomInboxRow | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["intercom-inbox", "pendiente"],
    queryFn: () => fetchIntercomInbox({ status: "pendiente", page: 1, pageSize: 50 }),
  });

  const items = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Cargando bandeja Intercom...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Inbox className="h-10 w-10 mb-3 opacity-40" />
        <p className="text-sm font-medium">No hay tickets pendientes en Intercom</p>
        <p className="text-xs mt-1">Los tickets escalados aparecerán aquí automáticamente</p>
      </div>
    );
  }

  if (selectedItem) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedItem(null)}
          className="text-sm text-primary hover:underline"
        >
          ← Volver a la lista
        </button>
        <ConversationDetail
          item={selectedItem}
          onConvert={() => {
            refetch();
            setSelectedItem(null);
            onIncidentCreated();
          }}
          onDismiss={() => {
            refetch();
            setSelectedItem(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground mb-3">
        Selecciona un ticket para revisar los datos y crear una incidencia.
      </p>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => setSelectedItem(item)}
          className="w-full text-left rounded-lg border p-3 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">
                {item.contactName ?? item.contactEmail ?? "Contacto desconocido"}
              </p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {item.subject || "Sin asunto"}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] text-muted-foreground">
                {formatRelativeTime(item.receivedAt)}
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
