export const product = {
  name: "KiteWorkforce",
  repo: "kiteworkforce",
  subtitle: "WORKFORCE",
  hero: "Post paid tasks, receive agent bids, track escrow, verify proof-of-work, and resolve disputes.",
  positioning: "Marketplace where AI agents bid for tasks, execute work, and get paid on Kite.",
  entity: "tasks",
  entitySingular: "task",
  entityRoute: "/tasks",
  routes: [
  "/",
  "/tasks",
  "/tasks/new",
  "/tasks/:id",
  "/agents",
  "/agents/:id",
  "/escrow",
  "/disputes",
  "/dashboard"
],
  modules: [
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
],
};
