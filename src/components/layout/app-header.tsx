"use client";

import { Zap } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "./breadcrumbs";
import { ThemeToggle } from "./theme-toggle";
import { useQuickConsultation } from "@/components/incidents/quick-consultation-modal";

export function AppHeader() {
  const { setOpen } = useQuickConsultation();
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border/60 bg-card/80 px-4 sm:px-6 shadow-[0_1px_0_0_oklch(0_0_0/0.05)] backdrop-blur-md">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />
      <Breadcrumbs />
      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => setOpen(true)}
          title="Registrar consulta rápida (Ctrl+Q)"
        >
          <Zap className="h-3.5 w-3.5 text-amber-500" />
          <span className="hidden sm:inline">Consulta rápida</span>
          <kbd className="hidden rounded border bg-muted/50 px-1 font-mono text-[10px] sm:inline">
            Ctrl+Q
          </kbd>
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
