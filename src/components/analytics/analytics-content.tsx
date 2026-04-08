"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeviceTypeDistribution } from "./device-type-distribution";
import { DeviceBrandRanking } from "./device-brand-ranking";
import { FailingModelsTable } from "./failing-models-table";
import { ProviderTurnaroundChart } from "./provider-turnaround-chart";
import { ProviderVolumeChart } from "./provider-volume-chart";
import { ProviderSuccessRateChart } from "./provider-success-rate-chart";
import { CostPlaceholder } from "./cost-placeholder";
import {
  fetchIncidentsByDeviceType,
  fetchIncidentsByBrand,
  fetchTopFailingModels,
  fetchProviderRmaTurnaround,
  fetchProviderRmaVolume,
  fetchProviderSuccessRate,
  fetchCostSummary,
} from "@/server/actions/analytics";

export function AnalyticsContent() {
  const [tab, setTab] = useState("dispositivos");

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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analítica</h1>
        <p className="text-sm text-muted-foreground">
          Métricas de dispositivos, proveedores y costes
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="dispositivos">Dispositivos</TabsTrigger>
          <TabsTrigger value="proveedores">Proveedores</TabsTrigger>
          <TabsTrigger value="costes">Costes</TabsTrigger>
        </TabsList>

        <TabsContent value="dispositivos" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <DeviceTypeDistribution data={deviceTypes} />
            <DeviceBrandRanking data={brands} />
          </div>
          <FailingModelsTable data={models} />
        </TabsContent>

        <TabsContent value="proveedores" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <ProviderTurnaroundChart data={turnaround} />
            <ProviderSuccessRateChart data={successRate} />
          </div>
          <ProviderVolumeChart data={volume} />
        </TabsContent>

        <TabsContent value="costes" className="mt-6">
          <CostPlaceholder summary={costSummary} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
