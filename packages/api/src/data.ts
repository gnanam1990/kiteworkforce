import { buildActivity, demoAddress, type ActivityEvent, type ApprovalRequest, type ProductItem, type ProductModule } from "@kiteworkforce/core";

export const modules: ProductModule[] = [
  {
    "id": "module_1",
    "name": "Task Posting Board",
    "description": "Users post paid tasks with requirements, budget, deadline, and verification rules.",
    "preview": "live"
  },
  {
    "id": "module_2",
    "name": "Agent Bidding System",
    "description": "Agents submit bids with plan, price, time, and proof of capability.",
    "preview": "preview"
  },
  {
    "id": "module_3",
    "name": "Escrow + Payment Flow",
    "description": "Hold or track funds for task completion and payout.",
    "preview": "preview"
  },
  {
    "id": "module_4",
    "name": "Proof-of-Work Submission",
    "description": "Agent submits deliverables and evidence.",
    "preview": "preview"
  },
  {
    "id": "module_5",
    "name": "Reputation + Disputes",
    "description": "Rate agent work, resolve conflicts, and update public reliability.",
    "preview": "preview"
  }
];

export const items: ProductItem[] = [
  {
    "id": "task_1",
    "name": "Task Posting Board",
    "description": "Users post paid tasks with requirements, budget, deadline, and verification rules.",
    "owner": demoAddress,
    "status": "active",
    "risk": "medium",
    "moduleId": "module_1",
    "budgetKite": "5",
    "createdAt": "2026-06-06T02:00:00.000Z"
  },
  {
    "id": "task_2",
    "name": "Agent Bidding System",
    "description": "Agents submit bids with plan, price, time, and proof of capability.",
    "owner": demoAddress,
    "status": "active",
    "risk": "high",
    "moduleId": "module_2",
    "budgetKite": "50",
    "createdAt": "2026-06-06T02:00:00.000Z"
  },
  {
    "id": "task_3",
    "name": "Escrow + Payment Flow",
    "description": "Hold or track funds for task completion and payout.",
    "owner": demoAddress,
    "status": "draft",
    "risk": "low",
    "moduleId": "module_3",
    "budgetKite": "0",
    "createdAt": "2026-06-06T02:00:00.000Z"
  }
];

export const activity: ActivityEvent[] = [
  buildActivity(items[0], "KiteWorkforce preview event accepted", new Date("2026-06-06T02:10:00.000Z")),
  buildActivity(items[1], "Risky Kite action queued for explicit approval", new Date("2026-06-06T02:20:00.000Z")),
];

export const approvals: ApprovalRequest[] = [
  {
    id: "approval_1",
    itemId: items[1].id,
    status: "pending",
    reason: "High-risk or fund-moving Kite action requires explicit approval.",
    risk: "high",
    requestedAt: "2026-06-06T02:20:00.000Z",
  },
];

export function createItem(input: Pick<ProductItem, "name" | "description" | "owner">) {
  const item: ProductItem = {
    id: `task_${Date.now()}`,
    name: input.name,
    description: input.description,
    owner: input.owner,
    status: "draft",
    risk: "low",
    moduleId: modules[0].id,
    budgetKite: "0",
    createdAt: new Date().toISOString(),
  };
  items.unshift(item);
  return item;
}
