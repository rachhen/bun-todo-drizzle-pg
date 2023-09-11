import { describe, expect, test } from "bun:test";
import app from "./app";

describe("Health check", () => {
  test("GET /health", async () => {
    const res = await app.request("/health");

    expect(res.status).toBe(200);
  });
});
