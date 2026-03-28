"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Code } from "lucide-react";
import { ALL_TEMPLATE_VARIABLES } from "@/lib/constants/message-templates";

interface VariableInserterProps {
  onInsert: (variable: string) => void;
}

export function VariableInserter({ onInsert }: VariableInserterProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Code className="mr-2 h-4 w-4" />
          Insertar variable
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 max-h-64 overflow-y-auto" align="start">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Haz clic para insertar en el cursor
          </p>
          <div className="flex flex-wrap gap-1">
            {ALL_TEMPLATE_VARIABLES.map((v) => (
              <Badge
                key={v.key}
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => onInsert(`{{${v.key}}}`)}
              >
                {v.label}
              </Badge>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
