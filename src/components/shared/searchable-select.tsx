"use client";

import { useState, useMemo } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/** Máximo de opciones visibles en el desplegable */
const MAX_VISIBLE = 50;

/** Normaliza texto: minúsculas, sin acentos ni diacríticos */
function normalize(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/** Busca si `query` está contenido dentro de `text` (case y accent insensitive).
 *  Ej: "taberna" matchea "Taberna Albero", "La Taberna del Río", etc. */
function containsMatch(text: string, query: string): boolean {
  return normalize(text).includes(normalize(query));
}

interface SearchableSelectProps {
  options: { value: string; label: string }[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
  disabled?: boolean;
  /** Mínimo de caracteres para empezar a filtrar (defecto: 0).
   *  Útil para listas grandes donde mostrar todo de golpe es lento. */
  minSearchLength?: number;
}

export function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = "Seleccionar...",
  searchPlaceholder = "Buscar...",
  emptyMessage = "Sin resultados.",
  emptyAction,
  disabled,
  minSearchLength = 0,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedLabel = options.find((o) => o.value === value)?.label;

  /** Si hay muchas opciones (>MAX_VISIBLE) y no se ha escrito nada, pedimos que escriba */
  const needsSearch = options.length > MAX_VISIBLE && search.length < Math.max(minSearchLength, 1);

  const filtered = useMemo(() => {
    if (needsSearch) return [];
    if (!search) return options.slice(0, MAX_VISIBLE);
    const matches = options.filter((o) => containsMatch(o.label, search));
    return matches.slice(0, MAX_VISIBLE);
  }, [options, search, needsSearch]);

  const totalMatches = useMemo(() => {
    if (needsSearch) return options.length;
    if (!search) return options.length;
    return options.filter((o) => containsMatch(o.label, search)).length;
  }, [options, search, needsSearch]);

  return (
    <Popover open={open} onOpenChange={(v) => { setOpen(v); if (!v) setSearch(""); }}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <span className="truncate">
            {selectedLabel ?? placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        {/* Buscador propio — sin cmdk */}
        <div className="flex items-center gap-2 border-b px-3 h-9">
          <Search className="h-4 w-4 shrink-0 opacity-50" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-8 border-0 p-0 shadow-none focus-visible:ring-0 text-sm"
          />
        </div>

        {/* Lista de opciones */}
        <div className="max-h-[300px] overflow-y-auto p-1">
          {needsSearch ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Escribe para buscar entre {options.length.toLocaleString("es-ES")} opciones...
            </p>
          ) : filtered.length > 0 ? (
            <>
              {filtered.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onValueChange(option.value === value ? "" : option.value);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={cn(
                    "relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none hover:bg-accent hover:text-accent-foreground",
                    value === option.value && "bg-accent"
                  )}
                >
                  <Check
                    className={cn(
                      "h-4 w-4 shrink-0",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </button>
              ))}
              {totalMatches > MAX_VISIBLE && (
                <p className="py-2 text-center text-xs text-muted-foreground">
                  Mostrando {MAX_VISIBLE} de {totalMatches.toLocaleString("es-ES")} resultados. Escribe más para filtrar.
                </p>
              )}
            </>
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </p>
          )}
        </div>

        {/* Acción cuando no hay resultados (ej: añadir cliente) */}
        {emptyAction && filtered.length === 0 && search.length > 0 && !needsSearch && (
          <div className="border-t p-2">{emptyAction}</div>
        )}
      </PopoverContent>
    </Popover>
  );
}
