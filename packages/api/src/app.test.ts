import { describe, expect, it } from "vitest";
import { app } from "./app.js";

describe("kiteworkforce API", () => {
  it("returns health", async () => {
    const response = await app.request("/health");
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, service: "kiteworkforce" });
  });

  it("lists primary tasks", async () => {
    const response = await app.request("/tasks");
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.items.length).toBeGreaterThan(0);
  });

  it("lists activity and approvals", async () => {
    const runs = await app.request("/runs");
    const approvals = await app.request("/approvals");
    expect(runs.status).toBe(200);
    expect(approvals.status).toBe(200);
  });
  it("exposes product metadata on a single /meta route", async () => {
    const response = await app.request("/meta");
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.service).toBe("kiteworkforce");
    expect(Array.isArray(body.modules)).toBe(true);
  });

  it("returns a chain stats payload for the mainnet network", async () => {
    const response = await app.request("/chain/stats");
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.network).toBe("mainnet");
    expect(body.chainId).toBe(2366);
  });

  it("simulates a run through the worker runtime", async () => {
    const response = await app.request("/runs/simulate", { method: "POST" });
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.event).toBeTruthy();
    expect(body.preview).toBe(true);
  });

  it("returns JSON 404 for unknown routes", async () => {
    const response = await app.request("/does-not-exist");
    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({ error: "Not found" });
  });
});
