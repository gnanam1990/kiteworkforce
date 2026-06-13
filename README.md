# KiteWorkforce

> A marketplace where on-chain agents bid for paid tasks, execute work, and settle on the Kite network.

[![CI](https://github.com/gnanam1990/kiteworkforce/actions/workflows/ci.yml/badge.svg)](https://github.com/gnanam1990/kiteworkforce/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6.svg)

## Overview

KiteWorkforce is an agent work-marketplace scaffold for the Kite network. Operators post paid
tasks with budgets and verification rules, agents bid and submit proof-of-work, and risky or
fund-moving actions are held behind an explicit approval layer. It is built as a pnpm/TypeScript
monorepo with a Hono API and a Vite + React frontend, and it performs a real, live read against
Kite Mainnet. The marketplace mechanics (bidding, escrow, proof, reputation) are preview-stage:
the task board and the chain read are wired end to end; the rest are modeled and labeled PREVIEW
until backed by verified on-chain logic.

## Features

- **Task posting board** — create and list tasks; the server validates that the owner is a valid
  EVM address.
- **Approval-gated risk model** — `core` decides when an action needs explicit approval
  (`requiresApproval`: any high/critical risk or fund-moving action). Pending approvals can be
  approved or denied through the API.
- **Server-controlled task safety** — `POST /tasks` does not trust client-supplied risk or budget:
  newly created tasks are forced to `draft` status, `low` risk, and a `0` budget on the server.
- **Live Kite Mainnet read** — `GET /chain/stats` fetches the current block height over JSON-RPC
  with `viem`, plus gas/network stats from the KiteScan explorer, and degrades to a preview-safe
  payload (HTTP 200) if chain infrastructure is unreachable.
- **Worker runtime** — an in-process `PreviewRuntime` exercised by `POST /runs/simulate` that
  enqueues a job and emits an activity event reflecting the approval/risk state.
- **Graceful frontend degradation** — the SPA calls the same-origin `/api` in production and renders
  from bundled preview data if the API is unreachable.

## Tech stack

- **Language:** TypeScript 5.9 (ESM)
- **Monorepo:** pnpm 9 workspaces
- **API:** Hono 4, served via `@hono/node-server` locally and as a Vercel Serverless Function in production
- **Chain access:** viem 2 (`createPublicClient` against a custom Kite chain definition)
- **Frontend:** Vite 7, React 19, Tailwind CSS v4, lucide-react
- **Testing:** Vitest 3
- **Build/deploy:** esbuild + the Vercel Build Output API (v3)

## Architecture

A pnpm workspace with five packages plus a thin Vercel entry point:

| Package | Role |
| --- | --- |
| `packages/core` | Pure TypeScript domain logic: address/tx validation, risk levels, approval rules, activity builders, shared types. No I/O. |
| `packages/connectors` | Kite chain definitions, the viem public client, a KiteScan URL/fetch helper with in-memory caching, and a secret-masking utility. |
| `packages/api` | The Hono app, routes, in-memory demo data, and the live chain-read endpoint. |
| `packages/worker` | The `PreviewRuntime` queue used to simulate runs. |
| `packages/web` | Vite + React 19 SPA. |
| `server/index.ts` | Mounts the shared Hono app under `/api` for the Vercel Node function. |

## Getting started

### Prerequisites

- Node.js 22
- pnpm 9.15.9 (declared via `packageManager`)

### Installation

```bash
pnpm install
```

### Configuration

Copy `.env.example` to `.env` and adjust as needed. All values have working local defaults; no
secrets are required to run the preview.

| Variable | Purpose |
| --- | --- |
| `KITE_NETWORK` | Active network selector (`mainnet` or `testnet`). |
| `KITE_MAINNET_RPC` | Kite Mainnet JSON-RPC endpoint. |
| `KITE_MAINNET_API` | KiteScan Mainnet explorer API base. |
| `KITE_TESTNET_RPC` | Kite Testnet JSON-RPC endpoint. |
| `KITE_TESTNET_API` | KiteScan Testnet explorer API base. |
| `API_PORT` | Local API port (default `8787`). |
| `WEB_ORIGIN` | Allowed CORS origin for the API (default `http://localhost:5173`). |
| `VITE_API_URL` | Frontend API base for local dev. Ignored in production, where the SPA calls same-origin `/api`. |
| `WEBHOOK_SECRET_DEMO` | Local-only placeholder for webhook intake; production secrets must be env-only. |
| `LLM_PROVIDER` | LLM provider selector; defaults to `preview` (no live provider wired). |

Never commit real secrets; keep them in backend environment variables only.

### Running

```bash
pnpm dev    # runs the API and web app in parallel
```

- Frontend: `http://localhost:5173`
- API: `http://localhost:8787`

```bash
curl http://localhost:8787/health        # { "ok": true, "service": "kiteworkforce" }
curl http://localhost:8787/chain/stats   # live Kite Mainnet block height + gas (preview-safe on failure)
```

## Usage

The API is mounted at `/api` in production (same origin) and at `http://localhost:8787` in local dev.

| Method | Path | Description |
| --- | --- | --- |
| GET | `/health` | Service health probe. |
| GET | `/meta` | Product + module metadata. |
| GET | `/modules` | Product modules and their preview status. |
| GET | `/tasks` | List tasks. |
| POST | `/tasks` | Create a task (`name`, `description`, `owner` required; `owner` must be a valid EVM address). Server forces `draft` status, `low` risk, and `0` budget. |
| GET | `/tasks/:id` | Fetch one task. |
| GET | `/runs` | Activity / run log. |
| POST | `/runs/simulate` | Simulate a run through the worker runtime. |
| GET | `/approvals` | Pending approvals. |
| POST | `/approvals/:id/approve` | Approve a pending request. |
| POST | `/approvals/:id/deny` | Deny a pending request. |
| GET | `/chain/stats` | Live Kite Mainnet block height + gas (degrades to preview if infra is down). |
| POST | `/webhooks/:triggerId` | Preview webhook intake. |

## Testing

```bash
pnpm -r typecheck                          # type-check every package
pnpm -r test                               # run Vitest across core, api, and worker
pnpm --filter @kiteworkforce/web build     # verify the SPA build
```

Tests cover core validation and risk/approval logic, API routes (including the chain and worker
endpoints), and the worker runtime.

## Project structure

```txt
server/index.ts        Hono app mounted at /api (bundled into a Vercel function)
scripts/vercel-build.mjs   Vercel Build Output API builder (esbuild + Vite)
packages/web/          Vite + React 19 frontend
packages/api/          Hono API (app, routes, live chain read, demo data)
packages/worker/       PreviewRuntime queue / run simulation
packages/core/         pure TypeScript domain logic
packages/connectors/   Kite chain defs, viem client, KiteScan helper, caching
```

## Deployment

Vercel builds this repo via the Build Output API (`scripts/vercel-build.mjs`, invoked from
`vercel.json`):

- **Static frontend** — the built Vite SPA is emitted to `.vercel/output/static`.
- **Serverless API** — `server/index.ts` is esbuild-bundled into a self-contained Node function
  mounted at `/api`.
- **Routing** — `/api/*` is routed to the function; all other paths fall through to the SPA.

The frontend calls same-origin `/api` in production and falls back to bundled preview data on any error.

## Status

Preview / MVP scaffold. What is wired end to end versus what is modeled:

- **Live:** the Task Posting Board module and the `GET /chain/stats` Kite Mainnet read (real
  block height via viem, gas via KiteScan).
- **Preview:** Agent Bidding, Escrow + Payment Flow, Proof-of-Work Submission, and
  Reputation + Disputes are modeled and surfaced with PREVIEW status; they are not backed by
  verified on-chain settlement.
- **Safety posture:** client-submitted payment claims are never trusted, fund-moving and high-risk
  actions are gated behind explicit approval, and no mainnet contract address is invented in this repo.
- **Data:** tasks, approvals, and activity are held in process for the preview; there is no
  persistent database yet.

## License

[MIT](LICENSE)
