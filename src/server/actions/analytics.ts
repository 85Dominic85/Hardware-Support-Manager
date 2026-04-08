"use server";

import { getRequiredSession } from "@/lib/auth/get-session";
import {
  getIncidentsByDeviceType,
  getIncidentsByBrand,
  getTopFailingModels,
  getDeviceFailureTrend,
  getProviderRmaTurnaround,
  getProviderRmaVolume,
  getProviderSuccessRate,
  getCostSummary,
} from "@/server/queries/analytics";
import type { DateRangeParams } from "@/server/queries/dashboard";

export async function fetchIncidentsByDeviceType(range?: DateRangeParams) {
  await getRequiredSession();
  return getIncidentsByDeviceType(range);
}

export async function fetchIncidentsByBrand(range?: DateRangeParams) {
  await getRequiredSession();
  return getIncidentsByBrand(range);
}

export async function fetchTopFailingModels(range?: DateRangeParams, limit?: number) {
  await getRequiredSession();
  return getTopFailingModels(range, limit);
}

export async function fetchDeviceFailureTrend(range?: DateRangeParams) {
  await getRequiredSession();
  return getDeviceFailureTrend(range);
}

export async function fetchProviderRmaTurnaround(range?: DateRangeParams) {
  await getRequiredSession();
  return getProviderRmaTurnaround(range);
}

export async function fetchProviderRmaVolume(range?: DateRangeParams) {
  await getRequiredSession();
  return getProviderRmaVolume(range);
}

export async function fetchProviderSuccessRate(range?: DateRangeParams) {
  await getRequiredSession();
  return getProviderSuccessRate(range);
}

export async function fetchCostSummary(range?: DateRangeParams) {
  await getRequiredSession();
  return getCostSummary(range);
}
