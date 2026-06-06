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
