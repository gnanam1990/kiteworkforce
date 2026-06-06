# KiteWorkforce — Project Prompt Pack

## One-line summary
Marketplace where AI agents bid for tasks, execute work, and get paid on Kite.

## Product positioning
A productive agent labor marketplace: humans or companies post tasks, agents bid, work is verified, escrow is released, and reputation improves.

## Why this exists
Kite can become not just a payment chain but a labor market for autonomous agents. This product turns agent capability into paid work.

## Repository name
`kiteworkforce`

## Header subtitle
`WORKFORCE`

## Core routes
- `/`
- `/tasks`
- `/tasks/new`
- `/tasks/:id`
- `/agents`
- `/agents/:id`
- `/escrow`
- `/disputes`
- `/dashboard`


## Core modules
1. **Task Posting Board** — Users post paid tasks with requirements, budget, deadline, and verification rules.
2. **Agent Bidding System** — Agents submit bids with plan, price, time, and proof of capability.
3. **Escrow + Payment Flow** — Hold or track funds for task completion and payout.
4. **Proof-of-Work Submission** — Agent submits deliverables and evidence.
5. **Reputation + Disputes** — Rate agent work, resolve conflicts, and update public reliability.

## API surface
- `GET /tasks`
- `POST /tasks`
- `POST /tasks/:id/bids`
- `POST /tasks/:id/accept-bid`
- `POST /tasks/:id/submissions`
- `POST /tasks/:id/review`
- `POST /tasks/:id/dispute`
- `POST /payments/verify`


## Safety requirements
- No guaranteed earnings language
- No airdrop/reward language
- Escrow must be testnet/PREVIEW until audited
- Reviews/disputes must be abuse-resistant later


## Build philosophy
This is not a small demo. Build it as a serious productivity platform for Kite AI agents. Every UI screen must move the user toward a real workflow, decision, payment, approval, or operational outcome.

---


---

# STAGE_00_CONTEXT_AND_REPO_SETUP.md

# Stage 00 — Context and Repo Setup for KiteWorkforce

You are OpenCode working inside this repo. Follow the prompt exactly. Do not skip requirements. Do not invent missing official contract addresses, token addresses, or unsupported claims. If a feature depends on unconfirmed mainnet contracts, implement it as PREVIEW/testnet/mock-safe only with clear UI labels.

Before writing code in this stage:
1. Read `THEME.md` in the repo root.
2. Read `KITE_CONTEXT.md` or `00_SHARED_KITE_CONTEXT.md` if present.
3. Inspect the existing codebase and summarize current structure in one paragraph.
4. Only then implement this stage.


## Goal
Create the initial monorepo for **KiteWorkforce**: Marketplace where AI agents bid for tasks, execute work, and get paid on Kite.

This stage should establish a clean foundation only. Do not build all product modules yet.

## Product constraints
- Product name: `KiteWorkforce`
- Repo name: `kiteworkforce`
- Header subtitle: `WORKFORCE`
- Positioning: A productive agent labor marketplace: humans or companies post tasks, agents bid, work is verified, escrow is released, and reputation improves.

## Required monorepo structure

Create this structure:

```txt
packages/web/          Vite + React 19 + TypeScript + Tailwind v4 frontend
packages/api/          Hono API server
packages/worker/       background jobs and queues
packages/core/         pure TypeScript domain logic
packages/connectors/   KiteScan, RPC, webhook, LLM, wallet/API connectors
```

Only add `packages/contracts/` if a later stage explicitly needs contracts.

## Frontend requirements
- Vite React TypeScript project under `packages/web`.
- Tailwind v4 using inline `@theme` in CSS.
- Copy the design values from `THEME.md` exactly.
- Add Geist and Geist Mono Google font links in `index.html`.
- Add shared components:
  - `SiteHeader`
  - `SiteFooter`
  - `KiteLogo`
  - `AddressDisplay`
  - `PreviewBadge`
  - `StatusBadge`
  - `MonoValue`
  - `EmptyState`
  - `ErrorState`
- Build a basic landing page with hero, product promise, module cards, and PREVIEW honesty banner.

## Backend requirements
- Hono API in `packages/api`.
- Health route: `GET /health` returns `{ ok: true, service: "kiteworkforce" }`.
- Shared environment loader with `.env.example`.
- Add CORS configured for local web dev.

## Core package requirements
- Add `packages/core/src/index.ts`.
- Add common types: `KiteAddress`, `TxHash`, `ISODate`, `RiskLevel`, `PreviewStatus`.
- Add validators for EVM address and tx hash.

## Connector package requirements
- Add Kite chain constants.
- Add KiteScan API base helper.
- Add cached fetch helper with TTL.
- Add placeholder RPC client helper using viem.

## Deliverables
- Full monorepo initialized.
- Root `package.json` with pnpm workspaces.
- Root `README.md` with what the product does.
- `.env.example` for all packages.
- Basic dev scripts:
  - `pnpm dev`
  - `pnpm -r typecheck`
  - `pnpm -r test`
  - `pnpm -r lint`

## Acceptance criteria
- Web app renders the landing page.
- API health route works.
- TypeScript builds.
- No forbidden fonts/colors.
- README clearly says what is real and what is PREVIEW.

## Required verification

Run these commands and fix all issues before ending the stage:

```bash
pnpm install
pnpm -r typecheck
pnpm -r lint || true
pnpm -r test || true
grep -rn "Instrument\|font-instrument\|font-serif" packages/web/src packages/web/index.html || true
grep -rn "violet\|indigo\|cyan\|#7C3AED\|#4F46E5\|#06B6D4" packages/web/src || true
```

Expected:
- TypeScript passes.
- No forbidden fonts.
- No forbidden colors in non-comment UI code.
- UI uses Kite palette only: sand, cream, olive, deep brown, warm rust.
- All addresses, hashes, balances, block numbers, tx IDs use `font-mono`.



---

# STAGE_01_DATABASE_AND_TYPES.md

# Stage 01 — Database and Domain Types for KiteWorkforce

You are OpenCode working inside this repo. Follow the prompt exactly. Do not skip requirements. Do not invent missing official contract addresses, token addresses, or unsupported claims. If a feature depends on unconfirmed mainnet contracts, implement it as PREVIEW/testnet/mock-safe only with clear UI labels.

Before writing code in this stage:
1. Read `THEME.md` in the repo root.
2. Read `KITE_CONTEXT.md` or `00_SHARED_KITE_CONTEXT.md` if present.
3. Inspect the existing codebase and summarize current structure in one paragraph.
4. Only then implement this stage.


## Goal
Design and implement the domain model, database schema, migrations, seed data, and TypeScript types for **KiteWorkforce**.

Do not build final UI screens yet. Build the data foundation that later stages will use.

## Required entities from PRD
Implement types and database tables for these domain objects:

- `Task{id, creator_address, title, description, budget_raw, token_address, status, deadline, verification_json, created_at}`
- `Bid{id, task_id, agent_address, price_raw, plan_markdown, eta_hours, status, created_at}`
- `EscrowRecord{id, task_id, payer_address, agent_address, amount_raw, token_address, status, deposit_tx, payout_tx, refund_tx}`
- `WorkSubmission{id, task_id, agent_address, content_markdown, artifact_urls_json, proof_json, status, submitted_at}`
- `Review{id, task_id, reviewer_address, agent_address, rating, comment, created_at}`
- `Dispute{id, task_id, opened_by, reason, status, resolution, created_at}`


## Database choice
Use SQLite for local MVP with Drizzle ORM or a clean query layer. Keep the schema portable so it can move to Postgres later.

## Required files

```txt
packages/core/src/types.ts
packages/core/src/validation.ts
packages/core/src/errors.ts
packages/api/src/db/schema.ts
packages/api/src/db/client.ts
packages/api/src/db/migrate.ts
packages/api/src/db/seed.ts
packages/api/src/repositories/
```

## Schema requirements
- Every table must have `id`, `created_at`, and where useful `updated_at`.
- Store addresses lowercase, but preserve display formatting in UI.
- Use JSON columns for flexible config payloads, but validate shape at API boundaries.
- Add indexes for address, status, created_at, foreign keys, and tx_hash where relevant.
- Add uniqueness constraints where duplicates would be dangerous.
- Add status enums in TypeScript and database-safe string values.

## TypeScript requirements
- Define strict types for every core entity.
- Define create/update input types separately from persisted entity types.
- Add Zod schemas for API request validation.
- Add helper functions for validating Kite addresses, tx hashes, amounts, and URLs.

## Seed data
Add realistic local seed data for demo mode:
- At least 3 users/owners.
- At least 5 main entities for the product.
- At least 10 events/logs/history rows where relevant.
- Seeded Kite-like addresses must be valid `0x` addresses.
- Mark all fake/demo records with `demo: true` or a clear `[MOCK]` label field.

## Acceptance criteria
- Migrations run from a clean database.
- Seed script populates useful demo data.
- API can import repositories without circular dependencies.
- Domain types are exported from `packages/core`.
- No UI claims seeded mock data is real.

## Required verification

Run these commands and fix all issues before ending the stage:

```bash
pnpm install
pnpm -r typecheck
pnpm -r lint || true
pnpm -r test || true
grep -rn "Instrument\|font-instrument\|font-serif" packages/web/src packages/web/index.html || true
grep -rn "violet\|indigo\|cyan\|#7C3AED\|#4F46E5\|#06B6D4" packages/web/src || true
```

Expected:
- TypeScript passes.
- No forbidden fonts.
- No forbidden colors in non-comment UI code.
- UI uses Kite palette only: sand, cream, olive, deep brown, warm rust.
- All addresses, hashes, balances, block numbers, tx IDs use `font-mono`.



---

# STAGE_02_BACKEND_API.md

# Stage 02 — Backend API for KiteWorkforce

You are OpenCode working inside this repo. Follow the prompt exactly. Do not skip requirements. Do not invent missing official contract addresses, token addresses, or unsupported claims. If a feature depends on unconfirmed mainnet contracts, implement it as PREVIEW/testnet/mock-safe only with clear UI labels.

Before writing code in this stage:
1. Read `THEME.md` in the repo root.
2. Read `KITE_CONTEXT.md` or `00_SHARED_KITE_CONTEXT.md` if present.
3. Inspect the existing codebase and summarize current structure in one paragraph.
4. Only then implement this stage.


## Goal
Build the Hono API surface for **KiteWorkforce** using the schema from Stage 01.

## Required API endpoints
Implement these endpoints or their direct REST equivalent:

- `GET /tasks`
- `POST /tasks`
- `POST /tasks/:id/bids`
- `POST /tasks/:id/accept-bid`
- `POST /tasks/:id/submissions`
- `POST /tasks/:id/review`
- `POST /tasks/:id/dispute`
- `POST /payments/verify`


## API architecture
Create:

```txt
packages/api/src/index.ts
packages/api/src/app.ts
packages/api/src/routes/
packages/api/src/middleware/error-handler.ts
packages/api/src/middleware/request-id.ts
packages/api/src/middleware/auth-placeholder.ts
packages/api/src/services/
packages/api/src/repositories/
```

## Requirements
- Every route validates input with Zod.
- Every route returns typed JSON.
- Errors use consistent shape:

```ts
{
  ok: false,
  error: { code: string; message: string; details?: unknown },
  request_id: string
}
```

- Success responses use:

```ts
{ ok: true, data: unknown, request_id: string }
```

- Add pagination to list endpoints using `limit`, `cursor`, or `page`.
- Add filters for status/date/address where useful.
- Add basic local auth placeholder based on `x-demo-owner-address` header, but keep it clearly marked as demo-only.
- Do not implement insecure production auth in this stage.

## Product-specific behavior
The API must support the major modules:

1. **Task Posting Board** — Users post paid tasks with requirements, budget, deadline, and verification rules.
2. **Agent Bidding System** — Agents submit bids with plan, price, time, and proof of capability.
3. **Escrow + Payment Flow** — Hold or track funds for task completion and payout.
4. **Proof-of-Work Submission** — Agent submits deliverables and evidence.
5. **Reputation + Disputes** — Rate agent work, resolve conflicts, and update public reliability.

## OpenAPI/docs
- Add a generated or hand-written `packages/api/API.md`.
- Include request/response examples.
- Include curl examples for the core happy paths.

## Acceptance criteria
- API starts locally.
- Health endpoint works.
- CRUD/list/detail endpoints work for seeded data.
- Invalid payloads return 400 with useful messages.
- Demo auth is clearly marked as not production auth.

## Required verification

Run these commands and fix all issues before ending the stage:

```bash
pnpm install
pnpm -r typecheck
pnpm -r lint || true
pnpm -r test || true
grep -rn "Instrument\|font-instrument\|font-serif" packages/web/src packages/web/index.html || true
grep -rn "violet\|indigo\|cyan\|#7C3AED\|#4F46E5\|#06B6D4" packages/web/src || true
```

Expected:
- TypeScript passes.
- No forbidden fonts.
- No forbidden colors in non-comment UI code.
- UI uses Kite palette only: sand, cream, olive, deep brown, warm rust.
- All addresses, hashes, balances, block numbers, tx IDs use `font-mono`.



---

# STAGE_03_WORKER_AND_AGENT_RUNTIME.md

# Stage 03 — Worker and Agent Runtime for KiteWorkforce

You are OpenCode working inside this repo. Follow the prompt exactly. Do not skip requirements. Do not invent missing official contract addresses, token addresses, or unsupported claims. If a feature depends on unconfirmed mainnet contracts, implement it as PREVIEW/testnet/mock-safe only with clear UI labels.

Before writing code in this stage:
1. Read `THEME.md` in the repo root.
2. Read `KITE_CONTEXT.md` or `00_SHARED_KITE_CONTEXT.md` if present.
3. Inspect the existing codebase and summarize current structure in one paragraph.
4. Only then implement this stage.


## Goal
Build the background worker/runtime layer for **KiteWorkforce**. This product should feel productive and agentic, not just CRUD screens.

## Worker package structure

```txt
packages/worker/src/index.ts
packages/worker/src/queue.ts
packages/worker/src/jobs/
packages/worker/src/scheduler.ts
packages/worker/src/logger.ts
packages/worker/src/config.ts
```

## Core runtime requirements
- Implement a simple durable job queue abstraction.
- Local MVP can use SQLite polling or an in-memory queue with persistent job table.
- Every job has `id`, `type`, `status`, `attempts`, `max_attempts`, `payload_json`, `last_error`, `created_at`, `run_at`, `finished_at`.
- Add exponential backoff helper.
- Add idempotency key support where a job can cause external effects.
- Add structured logs.

## Agentic requirements
Where this product needs AI/agent behavior, implement a provider abstraction:

```ts
interface AgentModelProvider {
  generateObject<T>(input: AgentPromptInput<T>): Promise<AgentResult<T>>;
  generateText(input: AgentTextInput): Promise<AgentTextResult>;
}
```

- Add a mock provider for local development.
- Add environment placeholders for real LLM provider later.
- Every AI output must be stored with prompt, model, input, output, and timestamp.
- Any action proposed by AI that can move funds or affect users must enter approval flow.

## Product-specific jobs
Create worker job stubs for each module:

- Task Posting Board
- Agent Bidding System
- Escrow + Payment Flow
- Proof-of-Work Submission
- Reputation + Disputes


Each job should have:
- input schema,
- handler,
- success path,
- failure path,
- timeline/audit log write,
- unit test with mock data.

## Acceptance criteria
- Worker starts locally.
- Worker can process at least one seeded/demo job.
- Failed jobs retry and eventually mark failed.
- Job logs are visible through API or database.
- AI/mock provider outputs are stored, not hidden.

## Required verification

Run these commands and fix all issues before ending the stage:

```bash
pnpm install
pnpm -r typecheck
pnpm -r lint || true
pnpm -r test || true
grep -rn "Instrument\|font-instrument\|font-serif" packages/web/src packages/web/index.html || true
grep -rn "violet\|indigo\|cyan\|#7C3AED\|#4F46E5\|#06B6D4" packages/web/src || true
```

Expected:
- TypeScript passes.
- No forbidden fonts.
- No forbidden colors in non-comment UI code.
- UI uses Kite palette only: sand, cream, olive, deep brown, warm rust.
- All addresses, hashes, balances, block numbers, tx IDs use `font-mono`.



---

# STAGE_04_FRONTEND_SHELL_AND_THEME.md

# Stage 04 — Frontend Shell and Kite Theme for KiteWorkforce

You are OpenCode working inside this repo. Follow the prompt exactly. Do not skip requirements. Do not invent missing official contract addresses, token addresses, or unsupported claims. If a feature depends on unconfirmed mainnet contracts, implement it as PREVIEW/testnet/mock-safe only with clear UI labels.

Before writing code in this stage:
1. Read `THEME.md` in the repo root.
2. Read `KITE_CONTEXT.md` or `00_SHARED_KITE_CONTEXT.md` if present.
3. Inspect the existing codebase and summarize current structure in one paragraph.
4. Only then implement this stage.


## Goal
Build the frontend shell for **KiteWorkforce** with the attached Kite design system. Do not improvise the visual style.

## Required routes
Create route/page shells for:

- `/`
- `/tasks`
- `/tasks/new`
- `/tasks/:id`
- `/agents`
- `/agents/:id`
- `/escrow`
- `/disputes`
- `/dashboard`


## Required layout
- Sticky `SiteHeader` with Kite logo and `WORKFORCE` subtitle.
- Main content container with cream background.
- `SiteFooter` linking to Kite, KiteScan, docs, and Discord.
- Left sidebar only if needed for app dashboards.
- Responsive mobile layout.

## Required shared UI components

```txt
components/ui/Button.tsx
components/ui/Card.tsx
components/ui/Input.tsx
components/ui/Textarea.tsx
components/ui/Select.tsx
components/ui/Tabs.tsx
components/ui/Badge.tsx
components/ui/PreviewBadge.tsx
components/ui/MonoValue.tsx
components/ui/AddressDisplay.tsx
components/ui/StatusDot.tsx
components/ui/EmptyState.tsx
components/ui/ErrorState.tsx
components/ui/ConfirmDialog.tsx
components/layout/AppShell.tsx
components/layout/SiteHeader.tsx
components/layout/SiteFooter.tsx
```

## Page shell requirements
Every route should have:
- Page title.
- Short description.
- At least one useful card/table/form placeholder.
- PREVIEW badge for data not wired yet.
- Empty state that explains what the user should do next.

## Visual rules
- Background: cream `#FEF8F0`.
- Primary CTA: sand `#9B8564`.
- Success: olive `#485C11`.
- Destructive/warning: warm rust `#A23A1A`.
- Cards: flat white/cream with `#E3D7C2` border.
- No glassmorphism, glow, violet, cyan, indigo, blue gradients, or neon.
- All addresses/hashes/numbers use Geist Mono.

## Data integration
- Create API client in `packages/web/src/lib/api.ts`.
- Load seeded/demo data from backend where possible.
- Show loading, error, and empty states.

## Acceptance criteria
- All routes render.
- Header/footer consistent.
- No forbidden colors/fonts.
- Demo data appears in at least 2 pages.
- UI looks like a sibling of the existing Kite product family.

## Required verification

Run these commands and fix all issues before ending the stage:

```bash
pnpm install
pnpm -r typecheck
pnpm -r lint || true
pnpm -r test || true
grep -rn "Instrument\|font-instrument\|font-serif" packages/web/src packages/web/index.html || true
grep -rn "violet\|indigo\|cyan\|#7C3AED\|#4F46E5\|#06B6D4" packages/web/src || true
```

Expected:
- TypeScript passes.
- No forbidden fonts.
- No forbidden colors in non-comment UI code.
- UI uses Kite palette only: sand, cream, olive, deep brown, warm rust.
- All addresses, hashes, balances, block numbers, tx IDs use `font-mono`.



---

# STAGE_05_MODULE_01_TASK_POSTING_BOARD.md

# Stage 05 — Module 1: Task Posting Board for KiteWorkforce

You are OpenCode working inside this repo. Follow the prompt exactly. Do not skip requirements. Do not invent missing official contract addresses, token addresses, or unsupported claims. If a feature depends on unconfirmed mainnet contracts, implement it as PREVIEW/testnet/mock-safe only with clear UI labels.

Before writing code in this stage:
1. Read `THEME.md` in the repo root.
2. Read `KITE_CONTEXT.md` or `00_SHARED_KITE_CONTEXT.md` if present.
3. Inspect the existing codebase and summarize current structure in one paragraph.
4. Only then implement this stage.


## Goal
Implement the **Task Posting Board** module for **KiteWorkforce**.

## Module purpose
Users post paid tasks with requirements, budget, deadline, and verification rules.

## Product context
A productive agent labor marketplace: humans or companies post tasks, agents bid, work is verified, escrow is released, and reputation improves.

## Features to implement
- Task creation
- Budget/token selection
- Required skills
- Deadline
- Deliverable schema
- Verification criteria
- Public/private tasks


## Required data objects
- `Task{id, creator_address, title, description, budget_raw, token_address, status, deadline, verification_json, created_at}`


## Backend requirements
- Add/complete service functions for this module in `packages/api/src/services/`.
- Add/complete repository functions in `packages/api/src/repositories/`.
- Add route handlers for create/list/detail/update/action flows related to this module.
- Validate all inputs with Zod.
- Write at least 3 API tests or service tests for the core happy path and failure path.

## Worker/runtime requirements
- If this module has background behavior, create a job type and handler.
- Add audit/timeline log writes for important state transitions.
- Add idempotency guard if the module can create external effects.
- Any AI-generated output must store prompt, input, output, model, and timestamp.

## Frontend requirements
Create serious production-style UI, not placeholders:
- Main module page or section.
- List/table view.
- Detail drawer or detail page.
- Create/edit form where relevant.
- Status badges.
- Empty state.
- Error state.
- Loading skeleton or loading card.
- Use `AddressDisplay` and `MonoValue` for chain data.
- Use `PreviewBadge` for mock, heuristic, or incomplete data.

## UX requirements
- The user should understand what action to take next.
- Dangerous/risky actions require confirmation dialog.
- Show clear helper text for policies, limits, payment state, or agent decisions.
- Do not hide complexity behind fake-complete UI.

## Acceptance criteria
- Task can be drafted/published/closed
- Budget is clearly displayed
- Tasks with fund movement are PREVIEW until escrow configured


## Additional checks
- All module screens work with seeded data.
- No fake mainnet execution claims.
- No unsupported token/contract assumptions.
- Unit tests cover core logic.

## Required verification

Run these commands and fix all issues before ending the stage:

```bash
pnpm install
pnpm -r typecheck
pnpm -r lint || true
pnpm -r test || true
grep -rn "Instrument\|font-instrument\|font-serif" packages/web/src packages/web/index.html || true
grep -rn "violet\|indigo\|cyan\|#7C3AED\|#4F46E5\|#06B6D4" packages/web/src || true
```

Expected:
- TypeScript passes.
- No forbidden fonts.
- No forbidden colors in non-comment UI code.
- UI uses Kite palette only: sand, cream, olive, deep brown, warm rust.
- All addresses, hashes, balances, block numbers, tx IDs use `font-mono`.



---

# STAGE_06_MODULE_02_AGENT_BIDDING_SYSTEM.md

# Stage 06 — Module 2: Agent Bidding System for KiteWorkforce

You are OpenCode working inside this repo. Follow the prompt exactly. Do not skip requirements. Do not invent missing official contract addresses, token addresses, or unsupported claims. If a feature depends on unconfirmed mainnet contracts, implement it as PREVIEW/testnet/mock-safe only with clear UI labels.

Before writing code in this stage:
1. Read `THEME.md` in the repo root.
2. Read `KITE_CONTEXT.md` or `00_SHARED_KITE_CONTEXT.md` if present.
3. Inspect the existing codebase and summarize current structure in one paragraph.
4. Only then implement this stage.


## Goal
Implement the **Agent Bidding System** module for **KiteWorkforce**.

## Module purpose
Agents submit bids with plan, price, time, and proof of capability.

## Product context
A productive agent labor marketplace: humans or companies post tasks, agents bid, work is verified, escrow is released, and reputation improves.

## Features to implement
- Bid form
- Agent profile linkage
- Proposed plan
- Price override
- ETA
- Bid comparison
- Select winner


## Required data objects
- `Bid{id, task_id, agent_address, price_raw, plan_markdown, eta_hours, status, created_at}`


## Backend requirements
- Add/complete service functions for this module in `packages/api/src/services/`.
- Add/complete repository functions in `packages/api/src/repositories/`.
- Add route handlers for create/list/detail/update/action flows related to this module.
- Validate all inputs with Zod.
- Write at least 3 API tests or service tests for the core happy path and failure path.

## Worker/runtime requirements
- If this module has background behavior, create a job type and handler.
- Add audit/timeline log writes for important state transitions.
- Add idempotency guard if the module can create external effects.
- Any AI-generated output must store prompt, input, output, model, and timestamp.

## Frontend requirements
Create serious production-style UI, not placeholders:
- Main module page or section.
- List/table view.
- Detail drawer or detail page.
- Create/edit form where relevant.
- Status badges.
- Empty state.
- Error state.
- Loading skeleton or loading card.
- Use `AddressDisplay` and `MonoValue` for chain data.
- Use `PreviewBadge` for mock, heuristic, or incomplete data.

## UX requirements
- The user should understand what action to take next.
- Dangerous/risky actions require confirmation dialog.
- Show clear helper text for policies, limits, payment state, or agent decisions.
- Do not hide complexity behind fake-complete UI.

## Acceptance criteria
- Task owner can accept one bid
- Rejected bids stay visible in history
- Agent reliability metrics are ESTIMATED if computed


## Additional checks
- All module screens work with seeded data.
- No fake mainnet execution claims.
- No unsupported token/contract assumptions.
- Unit tests cover core logic.

## Required verification

Run these commands and fix all issues before ending the stage:

```bash
pnpm install
pnpm -r typecheck
pnpm -r lint || true
pnpm -r test || true
grep -rn "Instrument\|font-instrument\|font-serif" packages/web/src packages/web/index.html || true
grep -rn "violet\|indigo\|cyan\|#7C3AED\|#4F46E5\|#06B6D4" packages/web/src || true
```

Expected:
- TypeScript passes.
- No forbidden fonts.
- No forbidden colors in non-comment UI code.
- UI uses Kite palette only: sand, cream, olive, deep brown, warm rust.
- All addresses, hashes, balances, block numbers, tx IDs use `font-mono`.



---

# STAGE_07_MODULE_03_ESCROW_PAYMENT_FLOW.md

# Stage 07 — Module 3: Escrow + Payment Flow for KiteWorkforce

You are OpenCode working inside this repo. Follow the prompt exactly. Do not skip requirements. Do not invent missing official contract addresses, token addresses, or unsupported claims. If a feature depends on unconfirmed mainnet contracts, implement it as PREVIEW/testnet/mock-safe only with clear UI labels.

Before writing code in this stage:
1. Read `THEME.md` in the repo root.
2. Read `KITE_CONTEXT.md` or `00_SHARED_KITE_CONTEXT.md` if present.
3. Inspect the existing codebase and summarize current structure in one paragraph.
4. Only then implement this stage.


## Goal
Implement the **Escrow + Payment Flow** module for **KiteWorkforce**.

## Module purpose
Hold or track funds for task completion and payout.

## Product context
A productive agent labor marketplace: humans or companies post tasks, agents bid, work is verified, escrow is released, and reputation improves.

## Features to implement
- Escrow deposit placeholder
- Payment intent
- Verified payout receipt
- Refund path
- Milestone support v0.2
- Unaudited warning


## Required data objects
- `EscrowRecord{id, task_id, payer_address, agent_address, amount_raw, token_address, status, deposit_tx, payout_tx, refund_tx}`


## Backend requirements
- Add/complete service functions for this module in `packages/api/src/services/`.
- Add/complete repository functions in `packages/api/src/repositories/`.
- Add route handlers for create/list/detail/update/action flows related to this module.
- Validate all inputs with Zod.
- Write at least 3 API tests or service tests for the core happy path and failure path.

## Worker/runtime requirements
- If this module has background behavior, create a job type and handler.
- Add audit/timeline log writes for important state transitions.
- Add idempotency guard if the module can create external effects.
- Any AI-generated output must store prompt, input, output, model, and timestamp.

## Frontend requirements
Create serious production-style UI, not placeholders:
- Main module page or section.
- List/table view.
- Detail drawer or detail page.
- Create/edit form where relevant.
- Status badges.
- Empty state.
- Error state.
- Loading skeleton or loading card.
- Use `AddressDisplay` and `MonoValue` for chain data.
- Use `PreviewBadge` for mock, heuristic, or incomplete data.

## UX requirements
- The user should understand what action to take next.
- Dangerous/risky actions require confirmation dialog.
- Show clear helper text for policies, limits, payment state, or agent decisions.
- Do not hide complexity behind fake-complete UI.

## Acceptance criteria
- On-chain tx verification required
- No custody claims unless contract exists and audited
- Mainnet escrow is disabled/PREVIEW until contract audited


## Additional checks
- All module screens work with seeded data.
- No fake mainnet execution claims.
- No unsupported token/contract assumptions.
- Unit tests cover core logic.

## Required verification

Run these commands and fix all issues before ending the stage:

```bash
pnpm install
pnpm -r typecheck
pnpm -r lint || true
pnpm -r test || true
grep -rn "Instrument\|font-instrument\|font-serif" packages/web/src packages/web/index.html || true
grep -rn "violet\|indigo\|cyan\|#7C3AED\|#4F46E5\|#06B6D4" packages/web/src || true
```

Expected:
- TypeScript passes.
- No forbidden fonts.
- No forbidden colors in non-comment UI code.
- UI uses Kite palette only: sand, cream, olive, deep brown, warm rust.
- All addresses, hashes, balances, block numbers, tx IDs use `font-mono`.



---

# STAGE_08_MODULE_04_PROOF_OF_WORK_SUBMISSION.md

# Stage 08 — Module 4: Proof-of-Work Submission for KiteWorkforce

You are OpenCode working inside this repo. Follow the prompt exactly. Do not skip requirements. Do not invent missing official contract addresses, token addresses, or unsupported claims. If a feature depends on unconfirmed mainnet contracts, implement it as PREVIEW/testnet/mock-safe only with clear UI labels.

Before writing code in this stage:
1. Read `THEME.md` in the repo root.
2. Read `KITE_CONTEXT.md` or `00_SHARED_KITE_CONTEXT.md` if present.
3. Inspect the existing codebase and summarize current structure in one paragraph.
4. Only then implement this stage.


## Goal
Implement the **Proof-of-Work Submission** module for **KiteWorkforce**.

## Module purpose
Agent submits deliverables and evidence.

## Product context
A productive agent labor marketplace: humans or companies post tasks, agents bid, work is verified, escrow is released, and reputation improves.

## Features to implement
- File/link/text deliverable
- Execution logs
- Tool call proof
- Completion statement
- Review UI
- Revision requests


## Required data objects
- `WorkSubmission{id, task_id, agent_address, content_markdown, artifact_urls_json, proof_json, status, submitted_at}`


## Backend requirements
- Add/complete service functions for this module in `packages/api/src/services/`.
- Add/complete repository functions in `packages/api/src/repositories/`.
- Add route handlers for create/list/detail/update/action flows related to this module.
- Validate all inputs with Zod.
- Write at least 3 API tests or service tests for the core happy path and failure path.

## Worker/runtime requirements
- If this module has background behavior, create a job type and handler.
- Add audit/timeline log writes for important state transitions.
- Add idempotency guard if the module can create external effects.
- Any AI-generated output must store prompt, input, output, model, and timestamp.

## Frontend requirements
Create serious production-style UI, not placeholders:
- Main module page or section.
- List/table view.
- Detail drawer or detail page.
- Create/edit form where relevant.
- Status badges.
- Empty state.
- Error state.
- Loading skeleton or loading card.
- Use `AddressDisplay` and `MonoValue` for chain data.
- Use `PreviewBadge` for mock, heuristic, or incomplete data.

## UX requirements
- The user should understand what action to take next.
- Dangerous/risky actions require confirmation dialog.
- Show clear helper text for policies, limits, payment state, or agent decisions.
- Do not hide complexity behind fake-complete UI.

## Acceptance criteria
- Task owner can accept/request revision/dispute
- Submission is immutable after acceptance
- Evidence links are displayed safely


## Additional checks
- All module screens work with seeded data.
- No fake mainnet execution claims.
- No unsupported token/contract assumptions.
- Unit tests cover core logic.

## Required verification

Run these commands and fix all issues before ending the stage:

```bash
pnpm install
pnpm -r typecheck
pnpm -r lint || true
pnpm -r test || true
grep -rn "Instrument\|font-instrument\|font-serif" packages/web/src packages/web/index.html || true
grep -rn "violet\|indigo\|cyan\|#7C3AED\|#4F46E5\|#06B6D4" packages/web/src || true
```

Expected:
- TypeScript passes.
- No forbidden fonts.
- No forbidden colors in non-comment UI code.
- UI uses Kite palette only: sand, cream, olive, deep brown, warm rust.
- All addresses, hashes, balances, block numbers, tx IDs use `font-mono`.



---

# STAGE_09_MODULE_05_REPUTATION_DISPUTES.md

# Stage 09 — Module 5: Reputation + Disputes for KiteWorkforce

You are OpenCode working inside this repo. Follow the prompt exactly. Do not skip requirements. Do not invent missing official contract addresses, token addresses, or unsupported claims. If a feature depends on unconfirmed mainnet contracts, implement it as PREVIEW/testnet/mock-safe only with clear UI labels.

Before writing code in this stage:
1. Read `THEME.md` in the repo root.
2. Read `KITE_CONTEXT.md` or `00_SHARED_KITE_CONTEXT.md` if present.
3. Inspect the existing codebase and summarize current structure in one paragraph.
4. Only then implement this stage.


## Goal
Implement the **Reputation + Disputes** module for **KiteWorkforce**.

## Module purpose
Rate agent work, resolve conflicts, and update public reliability.

## Product context
A productive agent labor marketplace: humans or companies post tasks, agents bid, work is verified, escrow is released, and reputation improves.

## Features to implement
- Rating form
- Dispute creation
- Evidence timeline
- Resolution status
- Reliability score
- Public work history


## Required data objects
- `Review{id, task_id, reviewer_address, agent_address, rating, comment, created_at}`
- `Dispute{id, task_id, opened_by, reason, status, resolution, created_at}`


## Backend requirements
- Add/complete service functions for this module in `packages/api/src/services/`.
- Add/complete repository functions in `packages/api/src/repositories/`.
- Add route handlers for create/list/detail/update/action flows related to this module.
- Validate all inputs with Zod.
- Write at least 3 API tests or service tests for the core happy path and failure path.

## Worker/runtime requirements
- If this module has background behavior, create a job type and handler.
- Add audit/timeline log writes for important state transitions.
- Add idempotency guard if the module can create external effects.
- Any AI-generated output must store prompt, input, output, model, and timestamp.

## Frontend requirements
Create serious production-style UI, not placeholders:
- Main module page or section.
- List/table view.
- Detail drawer or detail page.
- Create/edit form where relevant.
- Status badges.
- Empty state.
- Error state.
- Loading skeleton or loading card.
- Use `AddressDisplay` and `MonoValue` for chain data.
- Use `PreviewBadge` for mock, heuristic, or incomplete data.

## UX requirements
- The user should understand what action to take next.
- Dangerous/risky actions require confirmation dialog.
- Show clear helper text for policies, limits, payment state, or agent decisions.
- Do not hide complexity behind fake-complete UI.

## Acceptance criteria
- Reputation is transparent and non-black-box
- Disputes do not imply official arbitration
- Scores are marked ESTIMATED


## Additional checks
- All module screens work with seeded data.
- No fake mainnet execution claims.
- No unsupported token/contract assumptions.
- Unit tests cover core logic.

## Required verification

Run these commands and fix all issues before ending the stage:

```bash
pnpm install
pnpm -r typecheck
pnpm -r lint || true
pnpm -r test || true
grep -rn "Instrument\|font-instrument\|font-serif" packages/web/src packages/web/index.html || true
grep -rn "violet\|indigo\|cyan\|#7C3AED\|#4F46E5\|#06B6D4" packages/web/src || true
```

Expected:
- TypeScript passes.
- No forbidden fonts.
- No forbidden colors in non-comment UI code.
- UI uses Kite palette only: sand, cream, olive, deep brown, warm rust.
- All addresses, hashes, balances, block numbers, tx IDs use `font-mono`.



---

# STAGE_10_KITE_WALLET_AND_PAYMENT_INTEGRATION.md

# Stage 10 — Kite Wallet and Payment Integration for KiteWorkforce

You are OpenCode working inside this repo. Follow the prompt exactly. Do not skip requirements. Do not invent missing official contract addresses, token addresses, or unsupported claims. If a feature depends on unconfirmed mainnet contracts, implement it as PREVIEW/testnet/mock-safe only with clear UI labels.

Before writing code in this stage:
1. Read `THEME.md` in the repo root.
2. Read `KITE_CONTEXT.md` or `00_SHARED_KITE_CONTEXT.md` if present.
3. Inspect the existing codebase and summarize current structure in one paragraph.
4. Only then implement this stage.


## Goal
Add safe Kite chain integration to **KiteWorkforce**. This stage should wire KiteScan, RPC, wallet connection, address views, tx verification, and payment-safety patterns where relevant.

## Required connector files

```txt
packages/connectors/src/kite-chain.ts
packages/connectors/src/kitescan.ts
packages/connectors/src/rpc.ts
packages/connectors/src/payment-verifier.ts
packages/connectors/src/address.ts
packages/web/src/lib/wallet.ts
packages/web/src/lib/chains.ts
```

## Kite constants
Use these defaults:

```txt
Mainnet RPC: https://rpc.gokite.ai/
Mainnet Chain ID: 2366
Mainnet Explorer: https://kitescan.ai/
Mainnet API: https://kitescan.ai/api/v2/
Testnet RPC: https://rpc-testnet.gokite.ai/
Testnet Chain ID: 2368
Native token: KITE, 18 decimals
Testnet USDT: 0x0fF5393387ad2f9f691FD6Fd28e07E3969e27e63, 18 decimals
```

## Wallet connection
- Add wagmi + RainbowKit only if this product needs wallet connection.
- Customize RainbowKit theme to sand accent, not default blue/violet.
- Add network switch UI for mainnet/testnet when appropriate.
- Never store private keys.

## Payment verification pattern
If the product accepts payment tx hashes, implement:

1. Fetch transaction receipt by hash.
2. Confirm receipt status success.
3. Confirm chain/network.
4. For ERC-20 payment, parse Transfer logs.
5. Verify token contract address.
6. Verify recipient address.
7. Verify amount is greater than or equal to expected amount.
8. Store verification result.
9. Reject invalid tx with clear reason.
10. Never grant access from client-claimed payment alone.

## UI integration
- Every address links to KiteScan.
- Every tx hash links to KiteScan.
- Use `font-mono` for address/hash/amount/block.
- Mark any unverified payment as PENDING or UNVERIFIED.
- Mark any mock/demo payment as `[MOCK]`.

## Product-specific integration points
- Task Posting Board
- Agent Bidding System
- Escrow + Payment Flow
- Proof-of-Work Submission
- Reputation + Disputes


For each module, identify whether it needs:
- address lookup,
- tx hash lookup,
- token balance,
- payment verification,
- wallet approval,
- receipt display,
- explorer links.

## Acceptance criteria
- KiteScan client can fetch latest transactions or address data in demo mode.
- Payment verifier has unit tests for valid, invalid, wrong-recipient, wrong-token, and insufficient-amount cases using mocked receipts.
- Wallet UI does not use forbidden RainbowKit colors.
- No mainnet payment feature is presented as production-ready unless token/contract addresses are confirmed.

## Required verification

Run these commands and fix all issues before ending the stage:

```bash
pnpm install
pnpm -r typecheck
pnpm -r lint || true
pnpm -r test || true
grep -rn "Instrument\|font-instrument\|font-serif" packages/web/src packages/web/index.html || true
grep -rn "violet\|indigo\|cyan\|#7C3AED\|#4F46E5\|#06B6D4" packages/web/src || true
```

Expected:
- TypeScript passes.
- No forbidden fonts.
- No forbidden colors in non-comment UI code.
- UI uses Kite palette only: sand, cream, olive, deep brown, warm rust.
- All addresses, hashes, balances, block numbers, tx IDs use `font-mono`.



---

# STAGE_11_TESTING_SECURITY_AND_DEPLOYMENT.md

# Stage 11 — Testing, Security, and Deployment for KiteWorkforce

You are OpenCode working inside this repo. Follow the prompt exactly. Do not skip requirements. Do not invent missing official contract addresses, token addresses, or unsupported claims. If a feature depends on unconfirmed mainnet contracts, implement it as PREVIEW/testnet/mock-safe only with clear UI labels.

Before writing code in this stage:
1. Read `THEME.md` in the repo root.
2. Read `KITE_CONTEXT.md` or `00_SHARED_KITE_CONTEXT.md` if present.
3. Inspect the existing codebase and summarize current structure in one paragraph.
4. Only then implement this stage.


## Goal
Harden **KiteWorkforce** so it is not just a demo. Add tests, security checks, deployment docs, environment examples, and operational safety.

## Test requirements
Add tests for:
- Core domain logic.
- Zod validation.
- API route happy paths.
- API route failure paths.
- Worker job success/failure/retry.
- Payment verification logic if present.
- Policy/approval logic if present.
- UI smoke tests for critical pages if test stack exists.

## Security requirements
- No secrets in frontend code.
- No raw private keys in repository.
- `.env.example` contains names only, no real secrets.
- All external URLs are validated.
- HMAC verification for webhooks where relevant.
- Rate-limit write endpoints.
- Add request IDs and structured logs.
- Add clear PREVIEW/UNAUDITED warnings for risky modules.

## Production readiness checklist
Create `PRODUCTION_CHECKLIST.md` covering:
- Required environment variables.
- Database migration steps.
- Worker deployment steps.
- API deployment steps.
- Web deployment steps.
- RPC/API rate-limit considerations.
- Payment token address confirmation.
- Mainnet risk warnings.
- Backup/recovery expectations.

## Deployment docs
Create docs for:

```txt
docs/LOCAL_DEV.md
docs/DEPLOYMENT.md
docs/SECURITY.md
docs/API.md
```

## UI QA checklist
- Cream background.
- Sand primary buttons.
- Olive success states.
- Rust destructive/warning states.
- No violet/cyan/indigo/neon.
- No glassmorphism/glow/gradient text.
- All numbers/addresses/hashes in mono.
- PREVIEW badges on incomplete/heuristic/mock/unaudited parts.

## Acceptance criteria
- `pnpm -r typecheck` passes.
- Tests pass or documented skipped tests are justified.
- Security docs exist.
- Deployment docs exist.
- No forbidden visual patterns.
- Product can be demoed end-to-end locally with seeded data.

## Required verification

Run these commands and fix all issues before ending the stage:

```bash
pnpm install
pnpm -r typecheck
pnpm -r lint || true
pnpm -r test || true
grep -rn "Instrument\|font-instrument\|font-serif" packages/web/src packages/web/index.html || true
grep -rn "violet\|indigo\|cyan\|#7C3AED\|#4F46E5\|#06B6D4" packages/web/src || true
```

Expected:
- TypeScript passes.
- No forbidden fonts.
- No forbidden colors in non-comment UI code.
- UI uses Kite palette only: sand, cream, olive, deep brown, warm rust.
- All addresses, hashes, balances, block numbers, tx IDs use `font-mono`.



---

# STAGE_12_FINAL_POLISH_README_AND_DEMO.md

# Stage 12 — Final Polish, README, and Demo Script for KiteWorkforce

You are OpenCode working inside this repo. Follow the prompt exactly. Do not skip requirements. Do not invent missing official contract addresses, token addresses, or unsupported claims. If a feature depends on unconfirmed mainnet contracts, implement it as PREVIEW/testnet/mock-safe only with clear UI labels.

Before writing code in this stage:
1. Read `THEME.md` in the repo root.
2. Read `KITE_CONTEXT.md` or `00_SHARED_KITE_CONTEXT.md` if present.
3. Inspect the existing codebase and summarize current structure in one paragraph.
4. Only then implement this stage.


## Goal
Prepare **KiteWorkforce** for a public-quality GitHub repo and product demo.

## README requirements
Rewrite `README.md` with:
- Product name and one-line summary.
- What problem it solves.
- Why it matters for Kite AI agents.
- Feature list by module.
- Architecture diagram in text form.
- Local development instructions.
- Environment variable list.
- Safety/PREVIEW/UNAUDITED notes.
- Verification commands.
- Deployment notes.
- Roadmap v0.2/v0.3.

## Demo script
Create `docs/DEMO_SCRIPT.md` with a 3–5 minute demo flow:
1. Open landing page.
2. Show main dashboard.
3. Create or inspect a core object.
4. Trigger the most important workflow.
5. Show audit/log/payment/approval output.
6. Explain what is real vs PREVIEW.

## Product polish
- Replace generic placeholder copy with product-specific text.
- Add helpful empty states.
- Add tooltips for complex chain/agent concepts.
- Add skeleton/loading states.
- Add error recovery messages.
- Add cross-links to KiteScan for all addresses/txs.
- Add visible “Built on Kite” footer.

## v0.2 roadmap
Create a roadmap section with:
- Production auth.
- Postgres migration.
- Real provider integrations.
- WebSocket/event subscriptions if relevant.
- Mainnet-safe execution only after confirmation/audit.
- Team/multi-user support.
- Usage-based billing if relevant.

## Final acceptance criteria
- A new developer can run the repo from README alone.
- A demo user can understand the product in under 30 seconds.
- The app feels like a serious Kite agent product, not a toy dashboard.
- All PREVIEW limitations are honest.
- Final grep checks pass.

## Required verification

Run these commands and fix all issues before ending the stage:

```bash
pnpm install
pnpm -r typecheck
pnpm -r lint || true
pnpm -r test || true
grep -rn "Instrument\|font-instrument\|font-serif" packages/web/src packages/web/index.html || true
grep -rn "violet\|indigo\|cyan\|#7C3AED\|#4F46E5\|#06B6D4" packages/web/src || true
```

Expected:
- TypeScript passes.
- No forbidden fonts.
- No forbidden colors in non-comment UI code.
- UI uses Kite palette only: sand, cream, olive, deep brown, warm rust.
- All addresses, hashes, balances, block numbers, tx IDs use `font-mono`.

