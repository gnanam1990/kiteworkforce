import { Hono } from "hono";
import { cors } from "hono/cors";
import { assertEvmAddress } from "@kiteworkforce/core";
import { activity, approvals, createItem, items, modules } from "./data.js";

export const app = new Hono();

app.use(
  "*",
  cors({
    origin: [process.env.WEB_ORIGIN ?? "http://localhost:5173"],
    allowMethods: ["GET", "POST", "OPTIONS"],
  }),
);

app.get("/health", (c) => c.json({ ok: true, service: "kiteworkforce" }));
app.get("/modules", (c) => c.json({ modules }));
app.get("/tasks", (c) => c.json({ tasks: items, items }));

app.post("/tasks", async (c) => {
  const body = (await c.req.json().catch(() => null)) as { name?: string; description?: string; owner?: string } | null;
  if (!body?.name || !body.description || !body.owner) return c.json({ error: "name, description, and owner are required" }, 400);
  try {
    return c.json({ item: createItem({ name: body.name, description: body.description, owner: assertEvmAddress(body.owner) }) }, 201);
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : "Invalid item" }, 400);
  }
});

app.get("/tasks/:id", (c) => {
  const item = items.find((entry) => entry.id === c.req.param("id"));
  if (!item) return c.json({ error: "Item not found" }, 404);
  return c.json({ item });
});

app.get("/runs", (c) => c.json({ runs: activity, activity }));
app.get("/approvals", (c) => c.json({ approvals }));

app.post("/approvals/:id/approve", (c) => {
  const approval = approvals.find((entry) => entry.id === c.req.param("id"));
  if (!approval) return c.json({ error: "Approval not found" }, 404);
  approval.status = "approved";
  approval.decidedAt = new Date().toISOString();
  return c.json({ approval });
});

app.post("/approvals/:id/deny", (c) => {
  const approval = approvals.find((entry) => entry.id === c.req.param("id"));
  if (!approval) return c.json({ error: "Approval not found" }, 404);
  approval.status = "denied";
  approval.decidedAt = new Date().toISOString();
  return c.json({ approval });
});

app.post("/webhooks/:triggerId", async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as Record<string, string>;
  return c.json({
    accepted: true,
    triggerId: c.req.param("triggerId"),
    preview: true,
    message: "Webhook accepted into preview runtime. Production secrets must be env-only.",
    receivedKeys: Object.keys(body),
  });
});

app.get("/tasks/new", (c) => c.json({ route: "/tasks/new", product: "KiteWorkforce", preview: true, modules }));
app.get("/agents", (c) => c.json({ route: "/agents", product: "KiteWorkforce", preview: true, modules }));
app.get("/escrow", (c) => c.json({ route: "/escrow", product: "KiteWorkforce", preview: true, modules }));
app.get("/disputes", (c) => c.json({ route: "/disputes", product: "KiteWorkforce", preview: true, modules }));
app.get("/dashboard", (c) => c.json({ route: "/dashboard", product: "KiteWorkforce", preview: true, modules }));
