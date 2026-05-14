"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";
import {
  Search,
  Loader2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { searchGlobal } from "@/server/actions/search";
import { tokenizeSearchInput } from "@/lib/utils/search-normalize";
import type {
  IncidentSearchResult,
  RmaSearchResult,
} from "@/server/queries/search";

/**
 * Global search bar lives in the sidebar. Debounced text input that opens
 * a popover with grouped results (Incidencias / RMAs). Each result is
 * a clickable link to the entity's detail page.
 *
 * Triggers the server action only when the normalized query produces at
 * least one token — single-character inputs are ignored to avoid useless
 * round-trips.
 */
export function GlobalSearchBar() {
  const router = useRouter();
  const { inputValue, setInputValue, debouncedValue } = useDebouncedSearch(250);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Pre-validate: only fire the query if tokenization yields at least one token.
  const tokens = tokenizeSearchInput(debouncedValue);
  const hasValidQuery = tokens.length > 0;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["global-search", tokens.join("|")],
    queryFn: () => searchGlobal(debouncedValue),
    enabled: hasValidQuery,
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  });

  const incidents = data?.incidents ?? [];
  const rmas = data?.rmas ?? [];
  const hasResults = incidents.length > 0 || rmas.length > 0;

  // Open popover when input has a valid query, close otherwise.
  useEffect(() => {
    setOpen(hasValidQuery);
  }, [hasValidQuery]);

  const handleSelect = (href: string) => {
    setOpen(false);
    setInputValue("");
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setInputValue("");
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <Popover open={open && hasValidQuery} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-sidebar-foreground/50" />
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar..."
            className="h-8 pl-8 text-xs bg-sidebar-accent/40 border-sidebar-border placeholder:text-sidebar-foreground/50"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[320px] p-0"
        align="start"
        side="bottom"
        sideOffset={6}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="max-h-[400px] overflow-y-auto">
          {isLoading && !data && (
            <div className="flex items-center justify-center gap-2 p-6 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Buscando...
            </div>
          )}

          {isError && (
            <div className="p-4 text-xs text-destructive">
              Error al buscar. Intenta de nuevo.
            </div>
          )}

          {!isLoading && !isError && hasResults && (
            <>
              {incidents.length > 0 && (
                <ResultGroup
                  title="Incidencias"
                  icon={<AlertTriangle className="h-3 w-3" />}
                >
                  {incidents.map((inc) => (
                    <IncidentRow
                      key={inc.id}
                      incident={inc}
                      onSelect={() => handleSelect(`/incidents/${inc.id}`)}
                    />
                  ))}
                </ResultGroup>
              )}
              {rmas.length > 0 && (
                <ResultGroup
                  title="RMAs"
                  icon={<RotateCcw className="h-3 w-3" />}
                >
                  {rmas.map((rma) => (
                    <RmaRow
                      key={rma.id}
                      rma={rma}
                      onSelect={() => handleSelect(`/rmas/${rma.id}`)}
                    />
                  ))}
                </ResultGroup>
              )}
            </>
          )}

          {!isLoading && !isError && !hasResults && data && (
            <div className="p-6 text-center text-xs text-muted-foreground">
              Sin resultados para{" "}
              <span className="font-mono">&ldquo;{debouncedValue}&rdquo;</span>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ResultGroup({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="py-1">
      <div className="px-3 py-1.5 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground border-b">
        {icon}
        {title}
      </div>
      <ul className="py-1">{children}</ul>
    </div>
  );
}

function IncidentRow({
  incident,
  onSelect,
}: {
  incident: IncidentSearchResult;
  onSelect: () => void;
}) {
  const client = incident.clientCompanyName ?? incident.clientName ?? null;
  const device = [incident.deviceBrand, incident.deviceModel]
    .filter(Boolean)
    .join(" ");

  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className="w-full text-left px-3 py-2 hover:bg-muted/60 transition-colors group flex items-center gap-2"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-medium text-primary">
              {incident.incidentNumber}
            </span>
            <span className="text-xs truncate">{incident.title}</span>
          </div>
          {(client || device) && (
            <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground truncate">
              {client && <span className="truncate">{client}</span>}
              {client && device && <span>·</span>}
              {device && <span className="truncate">{device}</span>}
            </div>
          )}
        </div>
        <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100" />
      </button>
    </li>
  );
}

function RmaRow({
  rma,
  onSelect,
}: {
  rma: RmaSearchResult;
  onSelect: () => void;
}) {
  const client = rma.clientCompanyName ?? rma.clientName ?? null;
  const device = [rma.deviceBrand, rma.deviceModel].filter(Boolean).join(" ");

  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className="w-full text-left px-3 py-2 hover:bg-muted/60 transition-colors group flex items-center gap-2"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-medium text-primary">
              {rma.rmaNumber}
            </span>
            {rma.providerName && (
              <span className="text-xs truncate">{rma.providerName}</span>
            )}
          </div>
          {(client || device || rma.incidentNumber) && (
            <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground truncate">
              {client && <span className="truncate">{client}</span>}
              {client && device && <span>·</span>}
              {device && <span className="truncate">{device}</span>}
              {rma.incidentNumber && (
                <>
                  <span>·</span>
                  <span className="font-mono truncate">
                    {rma.incidentNumber}
                  </span>
                </>
              )}
            </div>
          )}
        </div>
        <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100" />
      </button>
    </li>
  );
}
