"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MonitorSmartphone, Truck, CircleDollarSign } from "lucide-react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FailingModelsTable } from "./failing-models-table";
import { CostPlaceholder } from "./cost-placeholder";

const ChartSkeleton = () => (
  <Card><CardHeader><Skeleton className="h-5 w-40" /></CardHeader><CardContent><Skeleton className="h-[250px] w-full" /></CardContent></Card>
);
const DeviceTypeDistribution = dynamic(() => import("./device-type-distribution").then(m => m.DeviceTypeDistribution), { ssr: false, loading: ChartSkeleton });
const DeviceBrandRanking = dynamic(() => import("./device-brand-ranking").then(m => m.DeviceBrandRanking), { ssr: false, loading: ChartSkeleton });
const ProviderTurnaroundChart = dynamic(() => import("./provider-turnaround-chart").then(m => m.ProviderTurnaroundChart), { ssr: false, loading: ChartSkeleton });
const ProviderVolumeChart = dynamic(() => import("./provider-volume-chart").then(m => m.ProviderVolumeChart), { ssr: false, loading: ChartSkeleton });
const ProviderSuccessRateChart = dynamic(() => import("./provider-success-rate-chart").then(m => m.ProviderSuccessRateChart), { ssr: false, loading: ChartSkeleton });
import {
  fetchIncidentsByDeviceType,
  fetchIncidentsByBrand,
  fetchTopFailingModels,
  fetchProviderRmaTurnaround,
  fetchProviderRmaVolume,
  fetchProviderSuccessRate,
  fetchCostSummary,
} from "@/server/actions/analytics";

const TAB_META: Record<string, { icon: typeof MonitorSmartphone; description: string }> = {
  dispositivos: { icon: MonitorSmartphone, description: "Análisis de fallos por tipo de equipo, marca y modelo" },
  proveedores: { icon: Truck, description: "Rendimiento de proveedores: turnaround, volumen y tasa de éxito" },
  costes: { icon: CircleDollarSign, description: "Desglose de costes por reparación, envío y sustitución" },
};

export function AnalyticsContent() {
  const [tab, setTab] = useState("dispositivos");
  const meta = TAB_META[tab];
  const Icon = meta.icon;

  const { data: deviceTypes = [] } = useQuery({
    queryKey: ["analytics", "device-types"],
    queryFn: () => fetchIncidentsByDeviceType(),
  });

  const { data: brands = [] } = useQuery({
    queryKey: ["analytics", "brands"],
    queryFn: () => fetchIncidentsByBrand(),
  });

  const { data: models = [] } = useQuery({
    queryKey: ["analytics", "models"],
    queryFn: () => fetchTopFailingModels(),
  });

  const { data: turnaround = [] } = useQuery({
    queryKey: ["analytics", "provider-turnaround"],
    queryFn: () => fetchProviderRmaTurnaround(),
    enabled: tab === "proveedores",
  });

  const { data: volume = [] } = useQuery({
    queryKey: ["analytics", "provider-volume"],
    queryFn: () => fetchProviderRmaVolume(),
    enabled: tab === "proveedores",
  });

  const { data: successRate = [] } = useQuery({
    queryKey: ["analytics", "provider-success"],
    queryFn: () => fetchProviderSuccessRate(),
    enabled: tab === "proveedores",
  });

  const { data: costSummary } = useQuery({
    queryKey: ["analytics", "cost-summary"],
    queryFn: () => fetchCostSummary(),
    enabled: tab === "costes",
  });

  return (
    <div className="space-y-6">
      <div
        style={{ animation: "fadeInUp 400ms cubic-bezier(0.16, 1, 0.3, 1) both" }}
      >
        <h1 className="text-2xl font-bold tracking-tight">Analítica</h1>
        <div className="flex items-center gap-2 mt-1">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {meta.description}
          </p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="dispositivos" className="gap-1.5">
            <MonitorSmartphone className="h-3.5 w-3.5" />
            Dispositivos
          </TabsTrigger>
          <TabsTrigger value="proveedores" className="gap-1.5">
            <Truck className="h-3.5 w-3.5" />
            Proveedores
          </TabsTrigger>
          <TabsTrigger value="costes" className="gap-1.5">
            <CircleDollarSign className="h-3.5 w-3.5" />
            Costes
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="dispositivos"
          className="space-y-6 mt-6"
          style={{ animation: "fadeInUp 400ms cubic-bezier(0.16, 1, 0.3, 1) both" }}
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <DeviceTypeDistribution data={deviceTypes} />
            <DeviceBrandRanking data={brands} />
          </div>
          <FailingModelsTable data={models} />
        </TabsContent>

        <TabsContent
          value="proveedores"
          className="space-y-6 mt-6"
          style={{ animation: "fadeInUp 400ms cubic-bezier(0.16, 1, 0.3, 1) both" }}
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <ProviderTurnaroundChart data={turnaround} />
            <ProviderSuccessRateChart data={successRate} />
          </div>
          <ProviderVolumeChart data={volume} />
        </TabsContent>

        <TabsContent
          value="costes"
          className="mt-6"
          style={{ animation: "fadeInUp 400ms cubic-bezier(0.16, 1, 0.3, 1) both" }}
        >
          <CostPlaceholder summary={costSummary} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
