"use server";

import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { getRequiredSession } from "@/lib/auth/get-session";
import { sql } from "drizzle-orm";

/** Fetch all unique device types from articles catalog */
export async function fetchArticleTypes(): Promise<string[]> {
  await getRequiredSession();
  const rows = await db
    .selectDistinct({ deviceType: articles.deviceType })
    .from(articles)
    .orderBy(articles.deviceType);
  return rows.map((r) => r.deviceType);
}

/** Fetch unique brands filtered by device type */
export async function fetchArticleBrands(deviceType: string): Promise<string[]> {
  await getRequiredSession();
  const rows = await db
    .selectDistinct({ brand: articles.brand })
    .from(articles)
    .where(sql`${articles.deviceType} = ${deviceType}`)
    .orderBy(articles.brand);
  return rows.map((r) => r.brand);
}

/** Fetch models filtered by device type and brand */
export async function fetchArticleModels(
  deviceType: string,
  brand: string
): Promise<{ id: string; model: string }[]> {
  await getRequiredSession();
  const rows = await db
    .select({ id: articles.id, model: articles.model })
    .from(articles)
    .where(
      sql`${articles.deviceType} = ${deviceType} AND ${articles.brand} = ${brand}`
    )
    .orderBy(articles.model);
  return rows;
}

/** Fetch all articles for flat select */
export async function fetchArticlesForSelect(): Promise<
  { id: string; deviceType: string; brand: string; model: string }[]
> {
  await getRequiredSession();
  return db
    .select({
      id: articles.id,
      deviceType: articles.deviceType,
      brand: articles.brand,
      model: articles.model,
    })
    .from(articles)
    .orderBy(articles.deviceType, articles.brand, articles.model);
}
