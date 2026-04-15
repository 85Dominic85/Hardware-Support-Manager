# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hardware Support Manager is an internal web application for a hardware support department that acts as intermediary between clients, providers, and warehouse/office. It manages **incidents** (support tickets) and **RMAs** (Return Merchandise Authorizations) through their full lifecycle using state machines, with complete audit trails, aging tracking, and file attachments.

**Target users**: Internal support team members (not end clients).
**Language**: All UI labels, states, form fields, error messages, and user-facing text must be in **Spanish**.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict mode) |
| ORM | Drizzle ORM |
| Database | Supabase PostgreSQL (pooler, schema `hsm`) |
| UI Components | shadcn/ui + Tailwind CSS v4 |
| Server State | TanStack Query v5 |
| URL State | nuqs |
| Forms | React Hook Form + Zod |
| Authentication | NextAuth.js v5 (Auth.js) with credentials provider |
| File Storage | Vercel Blob (abstracted behind storage layer) |
| Charts | Recharts |
| Notifications | Sonner (toast) |
| Testing | Vitest |

## Essential Commands

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Production build (also validates types)
npm run lint         # Run ESLint
npm run db:push      # Push Drizzle schema directly to Supabase (dev only)
npm run db:migrate   # Run generated Drizzle migrations (production)
npm run db:generate  # Generate migration files from schema changes
npm run db:seed      # Seed database with demo data
npm run db:studio    # Open Drizzle Studio (database GUI)
npm test             # Run Vitest tests
npm run test:watch   # Vitest in watch mode
npm run test:coverage # Vitest with coverage report
```

## Project Structure

```
src/
  app/                          # Next.js App Router
    (auth)/                     # Auth pages (login)
    (dashboard)/                # Authenticated layout group
      dashboard/                # Dashboard/home page
      incidents/                # Incident pages (list, detail, create, edit)
      rmas/                     # RMA pages (list, detail, create, edit)
      clients/                  # Client management
      providers/                # Provider management
      users/                    # User management (admin)
      settings/                 # App settings
      intercom/                   # Intercom inbox (Bandeja Intercom)
    api/                        # API routes (/api/upload, /api/webhooks/intercom)
    layout.tsx                  # Root layout
  components/
    ui/                         # shadcn/ui base components
    layout/                     # App shell: sidebar, header, breadcrumbs
    incidents/                  # Incident-specific components (forms, tables, detail views)
    rmas/                       # RMA-specific components
    intercom/                   # Intercom inbox components (conversation list, detail, thread)
    dashboard/                  # Dashboard widgets and charts
    shared/                     # Reusable components (data-table, file-uploader, state-badge, etc.)
  lib/
    db/
      index.ts                  # Drizzle client (postgres-js via Supabase pooler)
      schema/                   # Drizzle table definitions (one file per entity)
      migrations/               # Migration utilities
    auth/                       # NextAuth.js v5 configuration
    storage/                    # File storage abstraction (Vercel Blob)
    validators/                 # Zod schemas (shared between client and server)
    state-machines/             # Incident and RMA state machine definitions
    utils/                      # Helper functions (formatting, dates, ID generation)
    constants/                  # App-wide constants (states, roles, categories, incident templates)
    intercom/                   # Intercom API client, types, sync, device detection
  server/
    actions/                    # Server Actions (mutations)
    queries/                    # Server-side data fetching functions
  hooks/                        # Custom React hooks
  types/                        # TypeScript type definitions and interfaces
drizzle/                        # Generated migration SQL files
public/                         # Static assets (images, icons)
docs/                           # Project documentation
```

## Code Conventions

### Naming

| Element | Convention | Example |
|---|---|---|
| Files & folders | kebab-case | `incident-form.tsx`, `state-machines/` |
| Functions & variables | camelCase | `getIncidentById`, `isLoading` |
| React components | PascalCase | `IncidentDetail`, `RmaForm` |
| Constants | UPPER_SNAKE_CASE | `INCIDENT_STATES`, `MAX_FILE_SIZE` |
| Database tables | snake_case | `incidents`, `event_logs` |
| Database columns | snake_case | `created_at`, `client_id` |
| TypeScript types | PascalCase | `Incident`, `RmaStatus` |
| Zod schemas | camelCase with Schema suffix | `createIncidentSchema`, `updateRmaSchema` |

### File Organization

- One component per file. File name matches component name in kebab-case.
- Co-locate component-specific types and utilities with the component.
- Shared types go in `src/types/`.
- All Zod validators in `src/lib/validators/` (shared between client forms and server actions).

### API Pattern: Server Actions

All data mutations use **Server Actions** (no REST API endpoints). The only exceptions are `/api/upload` for file uploads (multipart form data) and `/api/webhooks/intercom` for incoming Intercom webhooks.

```typescript
// src/server/actions/incidents.ts
"use server";

import { createIncidentSchema } from "@/lib/validators/incident";
import { db } from "@/lib/db";

export async function createIncident(formData: FormData) {
  const parsed = createIncidentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.flatten() };
  // ... insert into DB, return result
}
```

### Server State with TanStack Query

Use TanStack Query v5 for all client-side data fetching and cache management. Server Actions are called via `useMutation`. Data fetching functions from `src/server/queries/` are used with `useQuery`.

### URL State with nuqs

Use nuqs for all URL-synchronized state (filters, pagination, search, sorting, tabs). This keeps UI state shareable and bookmarkable.

### Forms

All forms use React Hook Form with Zod resolver. Validators are defined once in `src/lib/validators/` and shared between client validation and server-side parsing.

### Paths

- Always use **relative** imports with the `@/` alias (mapped to `src/`).
- Never hardcode absolute filesystem paths.
- Use `path.join()` when building paths programmatically.

## Domain Model

### Incidents (INC-YYYY-NNNNN)

Support tickets tracking hardware issues from report to resolution.

- **States**: Defined by state machine in `src/lib/state-machines/incident.ts`
- **Key fields**: client, device info, category, priority, description, assigned user
- **Features**: State transitions with validation, aging tracking (time in current state), event log (audit trail), file attachments

### RMAs (RMA-YYYY-NNNNN)

Return Merchandise Authorizations for sending defective hardware to providers.

- **States**: Defined by state machine in `src/lib/state-machines/rma.ts`
- **Key fields**: linked incident(s), provider, device info, tracking numbers
- **Features**: State transitions, provider communication tracking, device location tracking, event log, file attachments

### Supporting Entities

- **Clients**: Companies or individuals reporting issues
- **Providers**: Hardware manufacturers/distributors for RMA processing
- **Users**: Internal team members with roles (admin, technician, viewer)
- **EventLog**: Polymorphic audit trail (linked to incidents or RMAs)
- **Attachments**: Polymorphic file attachments (linked to incidents, RMAs, or event log entries)
- **IntercomInbox**: Triage queue for Intercom escalations (webhook-driven, converts to incidents)

### Intercom Integration

- **Webhook**: `POST /api/webhooks/intercom` receives escalated conversations/tickets
- **Bandeja Intercom**: `/intercom` page — split-pane email-style inbox for reviewing escalations
- **Flow**: Intercom escalation → webhook → `intercom_inbox` table → team reviews → "Crear Incidencia" inline
- **Filters**: Only Hardware/RMA escalations are captured (keyword filtering in webhook)
- **Dedup**: Unique constraint on `intercom_conversation_id` + check `incidents.intercomEscalationId` before creating
- **API Client**: `src/lib/intercom/client.ts` — REST API v2.11 (getConversation, searchContacts, addNote, closeTicket)
- **Bidirectional sync** (`src/lib/intercom/sync.ts`): On incident state transitions, if linked to Intercom, an internal note is posted back. On resolution/closure, the Intercom ticket is auto-closed.
- **Device detection** (`src/lib/intercom/device-detector.ts`): Regex-based extraction of device type, model, and serial number from Intercom conversation text for auto-fill.
- **Conversation thread**: `ConversationThread` component renders full Intercom message timeline (client/admin/internal notes) in both Bandeja and incident detail.

### ID Format

Both incidents and RMAs use the format `{PREFIX}-{YEAR}-{SEQUENTIAL_5_DIGITS}`:
- `INC-2026-00001`, `INC-2026-00002`, ...
- `RMA-2026-00001`, `RMA-2026-00002`, ...

Sequential counter resets each year.

## Database

### Drizzle ORM with Supabase

- Schema files in `src/lib/db/schema/` (one file per table/entity, all in `hsm` PostgreSQL schema).
- Schema namespace defined in `src/lib/db/schema/hsm-schema.ts` using `pgSchema("hsm")`.
- Client initialization in `src/lib/db/index.ts` using postgres-js driver via Supabase pooler.
- Use `drizzle-kit` commands for migrations (see Essential Commands).

### Schema Changes Workflow

1. Modify schema files in `src/lib/db/schema/`.
2. Run `npm run db:generate` to create migration SQL.
3. Run `npm run db:migrate` to apply (or `npm run db:push` in development).
4. Update corresponding Zod validators if fields changed.
5. Update TypeScript types if needed.

### Conventions

- Use `pgTable` from `drizzle-orm/pg-core`.
- All tables include `id` (UUID, primary key), `createdAt`, and `updatedAt` timestamps.
- Use database-level foreign keys and constraints.
- Soft deletes where appropriate (`deletedAt` nullable timestamp).

## Authentication

NextAuth.js v5 (Auth.js) with credentials provider.

- Configuration in `src/lib/auth/`.
- Middleware protects all routes under `(dashboard)/`.
- Auth pages under `(auth)/` layout group.
- Session available via `auth()` on server and `useSession()` on client.
- Roles: `admin`, `technician`, `viewer` -- enforce in server actions.

## File Storage

Abstracted storage layer in `src/lib/storage/`:

- **Upload endpoint**: `/api/upload` (the only REST endpoint).
- **Storage backend**: Vercel Blob.
- **Abstraction**: Storage functions are behind an interface so the backend can be swapped.
- **Attachments are polymorphic**: Can be linked to incidents, RMAs, or event log entries.
- **Constraints**: Validate file type and size before upload.

## Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Priorities

1. **State machines**: Test all valid transitions and reject invalid ones.
2. **Validators**: Test Zod schemas with valid and invalid data.
3. **Utils**: Test ID generation, date formatting, aging calculations.
4. **Server actions**: Test with mocked DB where practical.

### Conventions

- Test files live next to source files: `incident.test.ts` beside `incident.ts`.
- Use Vitest `describe`/`it` blocks with descriptive names (in English).
- Mock external services (DB, storage) in unit tests.

## Claude Code Tooling

> **DIRECTIVA OBLIGATORIA**: Antes de abordar cualquier tarea, consultar las herramientas disponibles (agentes, skills, comandos, MCP servers) y usar la más adecuada. No reinventar funcionalidad que ya existe en el tooling del proyecto. La selección de herramienta debe seguir la guía de selección al final de esta sección.

### Agents (16) — `.claude/agents/`

| Agent | Propósito | Cuándo usar |
|-------|-----------|-------------|
| database-architect | Diseño de BD, schemas, migraciones | Cambios en schema Drizzle, optimización queries |
| frontend-developer | Desarrollo React/TypeScript frontend | Componentes nuevos, páginas, layouts |
| ui-ux-designer | Crítica UI/UX basada en investigación | Revisión de diseño, accesibilidad, usabilidad |
| backend-architect | Arquitectura servidor, APIs | Server actions, webhooks, integración servicios |
| fullstack-developer | Desarrollo cross-stack completo | Features que tocan BD + API + UI a la vez |
| code-reviewer | Revisión de código y calidad | Pre-merge, auditoría de seguridad, calidad |
| typescript-pro | Patrones TypeScript avanzados | Generics complejos, type safety, inferencia |
| test-engineer | Estrategia y ejecución de tests | Tests nuevos, cobertura, estrategia testing |
| debugger | Investigación y resolución de bugs | Errores en producción, stack traces, race conditions |
| context-manager | Coordinación de contexto del proyecto | Tareas multi-agente, sesiones largas |
| prompt-engineer | Optimización de prompts LLM | Si se integra IA en la app |
| error-detective | Análisis patrones de error, cascadas | Errores recurrentes, correlación entre servicios |
| deployment-engineer | Despliegue y CI/CD | Pipeline Vercel, rollbacks, automatización |
| mcp-expert | Configuración de servidores MCP | Nuevos MCP servers, debug de conexiones |
| documentation-expert | Estándares de documentación | Actualizar docs, CLAUDE.md, proyecto_log |
| ai-engineer | Ingeniería AI/ML | Solo si se añade componente IA al proyecto |

### Skills (13) — `.claude/skills/`

| Skill | Propósito | Cuándo usar |
|-------|-----------|-------------|
| **senior-frontend** | Desarrollo frontend moderno (React, Next.js, TS, Tailwind) | Arquitectura de componentes, patterns React |
| **senior-fullstack** | Desarrollo fullstack completo | Features end-to-end que cruzan capas |
| **react-best-practices** | 40+ reglas performance React/Next.js | Optimización rendering, bundles, data fetching |
| **supabase-postgres-best-practices** | Optimización Postgres y Supabase | Queries complejas, índices, full-text search |
| **emil-design-eng** | Filosofía Emil Kowalski: UI polish, animaciones | Microinteracciones, transiciones, detalles visuales |
| **frontend-design** | Interfaces production-grade con alto diseño | Landing pages, componentes con diseño distintivo |
| **ui-ux-pro-max** | 50 estilos, 21 paletas, 50 font pairings | Decisiones de diseño, paletas, tipografía |
| **code-reviewer** | Revisión automática con checklist y scripts | Code review estructurado con antipatrones |
| **mcp-builder** | Guía para crear servidores MCP | Integrar nuevos servicios externos vía MCP |
| **git-commit-helper** | Mensajes de commit descriptivos | Análisis de diffs para generar mensajes |
| **canvas-design** | Arte visual en .png/.pdf | Posters, diseños estáticos (poco uso en HSM) |
| **theme-factory** | Toolkit de temas (10 presets) | Slides, docs, landing pages (poco uso en HSM) |
| **file-organizer** | Organizar archivos y carpetas | Reestructuración de directorios |

### Skills Built-in (del sistema)

| Skill | Propósito |
|-------|-----------|
| `anthropic-skills:pdf` | Leer, crear, combinar, dividir PDFs |
| `anthropic-skills:xlsx` | Leer, crear, editar hojas de cálculo |
| `anthropic-skills:pptx` | Crear y manipular presentaciones PowerPoint |
| `anthropic-skills:docx` | Crear y manipular documentos Word |
| `anthropic-skills:skill-creator` | Crear nuevas skills, medir rendimiento |
| `simplify` | Revisar código para calidad y eficiencia |
| `claude-api` | Construir apps con API Claude / Anthropic SDK |

### Commands (8) — `.claude/commands/`

| Comando | Propósito | Cuándo usar |
|---------|-----------|-------------|
| `/commit` | Git commit inteligente con linting previo | Siempre para commits (preferir sobre git manual) |
| `/code-review` | Revisión de calidad de código | Antes de merge o push importante |
| `/refactor-code` | Mejora y refactorización | Limpiar código existente |
| `/ultra-think` | Análisis profundo multi-dimensional | Decisiones arquitecturales complejas |
| `/todo` | Gestión de tareas del proyecto | Planificación y seguimiento |
| `/architecture-review` | Evaluación de arquitectura | Revisar decisiones de diseño del sistema |
| `/update-docs` | Sincronización documentación | Tras cambios significativos |
| `/explain-code` | Análisis y explicación de código | Entender código existente |

### MCP Servers — `.mcp.json`

| Server | Tipo | Propósito |
|--------|------|-----------|
| supabase | HTTP | Gestión proyecto Supabase (BD principal) |
| postgresql | Command | Conexión PostgreSQL directa |
| web-fetch | Command | Obtención de contenido web |
| github | Command | Integración API GitHub |
| markitdown | Command | Conversión de documentos a markdown |
| figma | Command | Modo desarrollo Figma |

### Guía de Selección de Herramientas

| Tipo de tarea | Herramienta principal | Complemento |
|---------------|----------------------|-------------|
| **Nuevo componente UI** | agente `frontend-developer` | skill `senior-frontend` + `emil-design-eng` |
| **Feature fullstack** | agente `fullstack-developer` | skill `senior-fullstack` |
| **Cambio en BD/schema** | agente `database-architect` | skill `supabase-postgres-best-practices` |
| **Optimizar performance** | skill `react-best-practices` | agente `frontend-developer` |
| **Code review** | comando `/code-review` | skill `code-reviewer` para checklist |
| **Bug fixing** | agente `debugger` | agente `error-detective` si es recurrente |
| **Commit** | comando `/commit` | skill `git-commit-helper` para analizar diffs |
| **Decisión arquitectural** | comando `/ultra-think` | comando `/architecture-review` |
| **Diseño UI/UX** | skill `ui-ux-pro-max` | agente `ui-ux-designer` para crítica |
| **Animaciones/polish** | skill `emil-design-eng` | skill `frontend-design` |
| **Testing** | agente `test-engineer` | — |
| **Documentación** | comando `/update-docs` | agente `documentation-expert` |
| **Deploy** | agente `deployment-engineer` | — |
| **Nuevo MCP server** | skill `mcp-builder` | agente `mcp-expert` |

### Sinergias y Prioridades entre Herramientas

Cuando hay solapamiento entre herramientas:
- **Performance React**: `react-best-practices` (40+ reglas específicas) tiene prioridad sobre `senior-frontend` (guía general)
- **Code review**: `/code-review` (rápido) → skill `code-reviewer` (checklist) → agente `code-reviewer` (profundo)
- **Commits**: `/commit` (workflow principal) → `git-commit-helper` (solo analizar diffs)
- **UI/UX**: `ui-ux-pro-max` (catálogo de estilos) + agente `ui-ux-designer` (crítica investigativa) — usar juntos
- **Postgres**: `supabase-postgres-best-practices` (reglas de referencia) + agente `database-architect` (aplica con contexto)

## Deployment

- **Platform**: Vercel
- **Database**: Supabase PostgreSQL (connection via pooler, schema `hsm`)
- **File storage**: Vercel Blob
- **Environment variables**: Set in Vercel dashboard (never in code)

### Deploy Workflow

```bash
npm run build         # Verify build passes locally
npm run lint          # Verify no lint errors
npm test              # Verify tests pass
# Push to main branch -- Vercel deploys automatically
```

## Security

### Environment Variables

- **NEVER** hardcode secrets, API keys, tokens, or passwords in code.
- Use `process.env.VARIABLE_NAME` to access secrets.
- Local development: `.env` or `.env.local` (already in `.gitignore`).
- Production: Vercel environment variables dashboard.

```typescript
// WRONG
const dbUrl = "postgresql://user:password@host/db";

// CORRECT
const dbUrl = process.env.DATABASE_URL;
```

### Required Environment Variables

```bash
DATABASE_URL=              # Supabase PostgreSQL pooler connection string
NEXTAUTH_SECRET=           # NextAuth.js secret (generate with openssl rand -base64 32)
NEXTAUTH_URL=              # App URL (http://localhost:3000 in dev)
BLOB_READ_WRITE_TOKEN=     # Vercel Blob token
INTERCOM_ACCESS_TOKEN=     # Intercom API key (for API calls)
INTERCOM_WEBHOOK_SECRET=   # Secret for webhook HMAC verification
INTERCOM_ADMIN_ID=         # Intercom admin ID for sync notes (e.g., 8601230)
```

### Auth Security

- All server actions must verify session before executing.
- Role-based access: check user role for destructive or admin-only operations.
- Validate all inputs with Zod on the server side, even if also validated on client.

## Common Issues

**Build fails with type errors**
- Run `npm run build` locally before pushing. Next.js build is stricter than `tsc`.
- Check that all server actions have `"use server"` directive.

**Database connection errors**
- Verify `DATABASE_URL` is set and correct.
- Supabase pooler requires `prepare: false` in the postgres-js client options.
- Connection uses a dedicated `hsm_app` role with access to the `hsm` schema only.

**Drizzle schema out of sync**
- Run `npm run db:push` (dev) or `npm run db:migrate` (prod) after schema changes.
- If `db:push` fails, check for breaking changes (dropping columns with data).

**File uploads failing**
- Verify `BLOB_READ_WRITE_TOKEN` is set.
- Check file size limits in the upload route.
- Ensure the `/api/upload` route handles multipart form data correctly.

**State transition rejected**
- Check the state machine definition for allowed transitions.
- Verify the current state is correct (may be stale -- refetch).
- Check if the transition requires specific conditions (e.g., all fields filled).

**Spanish characters not displaying**
- Ensure files are saved as UTF-8.
- Check that `<html lang="es">` is set in the root layout.

**TanStack Query cache stale after mutation**
- Invalidate relevant query keys after successful server action mutations.
- Use `queryClient.invalidateQueries({ queryKey: [...] })` in `onSuccess`.

**Search/filter with `unaccent()` fails on Supabase pooler**
- Supabase pooler does not support `unaccent()` (even as `extensions.unaccent()`).
- Use plain `ILIKE` for text search instead.

**DDL migrations fail with `hsm_app` role**
- The `hsm_app` role only has SELECT/INSERT/UPDATE/DELETE privileges.
- Run DDL migrations (CREATE TABLE, ALTER TYPE, DROP COLUMN) as `postgres` in Supabase SQL Editor.
- Split `ALTER TYPE` and `UPDATE` into separate statements (Supabase doesn't support `BEGIN`/`COMMIT`).
