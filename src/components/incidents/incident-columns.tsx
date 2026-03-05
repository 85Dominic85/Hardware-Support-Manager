"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { IncidentRow } from "@/server/queries/incidents";
import { IncidentStateBadge } from "@/components/shared/state-badge";
import { AgingBadge } from "@/components/shared/aging-badge";
import { Badge } from "@/components/ui/badge";
import { INCIDENT_PRIORITY_LABELS, type IncidentPriority } from "@/lib/constants/incidents";
import { formatDate } from "@/lib/utils/date-format";

const PRIORITY_COLORS: Record<string, string> = {
  baja: "bg-green-100 text-green-700 hover:bg-green-100",
  media: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  alta: "bg-orange-100 text-orange-700 hover:bg-orange-100",
  critica: "bg-red-100 text-red-700 hover:bg-red-100",
};

export const incidentColumns: ColumnDef<IncidentRow, unknown>[] = [
  {
    accessorKey: "incidentNumber",
    header: "N\u00famero",
    cell: ({ row }) => (
      <span className="font-medium text-primary">{row.original.incidentNumber}</span>
    ),
  },
  {
    accessorKey: "title",
    header: "T\u00edtulo",
    cell: ({ row }) => (
      <span className="max-w-[200px] truncate block">{row.original.title}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => <IncidentStateBadge status={row.original.status} />,
  },
  {
    accessorKey: "priority",
    header: "Prioridad",
    cell: ({ row }) => (
      <Badge variant="outline" className={PRIORITY_COLORS[row.original.priority] ?? ""}>
        {INCIDENT_PRIORITY_LABELS[row.original.priority as IncidentPriority] ?? row.original.priority}
      </Badge>
    ),
  },
  {
    accessorKey: "clientName",
    header: "Cliente",
    cell: ({ row }) => row.original.clientName ?? "-",
  },
  {
    accessorKey: "assignedUserName",
    header: "Asignado",
    cell: ({ row }) => row.original.assignedUserName ?? "-",
  },
  {
    accessorKey: "stateChangedAt",
    header: "Antig\u00fcedad",
    cell: ({ row }) => <AgingBadge stateChangedAt={row.original.stateChangedAt} />,
  },
  {
    accessorKey: "createdAt",
    header: "Creado",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
];
