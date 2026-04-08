import { relations } from "drizzle-orm";
import { users } from "./users";
import { providers } from "./providers";
import { incidents } from "./incidents";
import { rmas } from "./rmas";
import { eventLogs } from "./event-logs";
import { attachments } from "./attachments";
import { clients } from "./clients";
import { clientLocations } from "./client-locations";
import { articles } from "./articles";

export const usersRelations = relations(users, ({ many }) => ({
  assignedIncidents: many(incidents),
  eventLogs: many(eventLogs),
  attachments: many(attachments),
}));

export const providersRelations = relations(providers, ({ many }) => ({
  rmas: many(rmas),
}));

export const clientsRelations = relations(clients, ({ many }) => ({
  locations: many(clientLocations),
  incidents: many(incidents),
  rmas: many(rmas),
}));

export const clientLocationsRelations = relations(clientLocations, ({ one, many }) => ({
  client: one(clients, {
    fields: [clientLocations.clientId],
    references: [clients.id],
  }),
  incidents: many(incidents),
  rmas: many(rmas),
}));

export const articlesRelations = relations(articles, ({ many }) => ({
  incidents: many(incidents),
  rmas: many(rmas),
}));

export const incidentsRelations = relations(incidents, ({ one, many }) => ({
  assignedUser: one(users, {
    fields: [incidents.assignedUserId],
    references: [users.id],
  }),
  client: one(clients, {
    fields: [incidents.clientId],
    references: [clients.id],
  }),
  clientLocation: one(clientLocations, {
    fields: [incidents.clientLocationId],
    references: [clientLocations.id],
  }),
  article: one(articles, {
    fields: [incidents.articleId],
    references: [articles.id],
  }),
  rmas: many(rmas),
}));

export const rmasRelations = relations(rmas, ({ one }) => ({
  incident: one(incidents, {
    fields: [rmas.incidentId],
    references: [incidents.id],
  }),
  provider: one(providers, {
    fields: [rmas.providerId],
    references: [providers.id],
  }),
  client: one(clients, {
    fields: [rmas.clientId],
    references: [clients.id],
  }),
  clientLocation: one(clientLocations, {
    fields: [rmas.clientLocationId],
    references: [clientLocations.id],
  }),
  article: one(articles, {
    fields: [rmas.articleId],
    references: [articles.id],
  }),
}));

export const eventLogsRelations = relations(eventLogs, ({ one }) => ({
  user: one(users, {
    fields: [eventLogs.userId],
    references: [users.id],
  }),
}));

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  uploadedByUser: one(users, {
    fields: [attachments.uploadedBy],
    references: [users.id],
  }),
}));
