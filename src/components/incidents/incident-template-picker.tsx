"use client";

import { FileText, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { INCIDENT_TEMPLATES, type IncidentTemplate } from "@/lib/constants/incident-templates";

interface IncidentTemplatePickerProps {
  onSelect: (template: IncidentTemplate) => void;
  onClear: () => void;
  selectedId: string | null;
}

export function IncidentTemplatePicker({
  onSelect,
  onClear,
  selectedId,
}: IncidentTemplatePickerProps) {
  return (
    <div className="flex items-center gap-2">
      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
      <Select
        value={selectedId ?? ""}
        onValueChange={(id) => {
          const template = INCIDENT_TEMPLATES.find((t) => t.id === id);
          if (template) onSelect(template);
        }}
      >
        <SelectTrigger className="w-full sm:w-[280px]">
          <SelectValue placeholder="Aplicar plantilla..." />
        </SelectTrigger>
        <SelectContent>
          {INCIDENT_TEMPLATES.map((t) => (
            <SelectItem key={t.id} value={t.id}>
              {t.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedId && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={onClear}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
