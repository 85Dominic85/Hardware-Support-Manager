"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export function ImportClientsButton() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const queryClient = useQueryClient();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      toast.error("Solo se permiten archivos CSV");
      return;
    }

    setIsImporting(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/import-clients", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Error al importar");
        return;
      }

      if (data.imported > 0) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["clients"] });
      } else {
        toast.info(data.message);
      }
    } catch {
      toast.error("Error al importar el archivo CSV");
    } finally {
      setIsImporting(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        variant="outline"
        disabled={isImporting}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="mr-2 h-4 w-4" />
        {isImporting ? "Importando..." : "Importar CSV"}
      </Button>
    </>
  );
}
