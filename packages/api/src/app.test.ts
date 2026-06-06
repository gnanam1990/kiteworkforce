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
});
