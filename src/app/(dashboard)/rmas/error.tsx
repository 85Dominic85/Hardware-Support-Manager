"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertOctagon } from "lucide-react";

export default function RmasError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("RMAs error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
        <AlertOctagon className="h-8 w-8 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold">Error al cargar RMAs</h2>
      <p className="max-w-md text-muted-foreground">
        Se produjo un error inesperado. Puedes intentar recargar o navegar a otra sección.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>Reintentar</Button>
        <Button variant="outline" onClick={() => window.location.href = "/dashboard"}>
          Ir al Panel
        </Button>
      </div>
    </div>
  );
}
