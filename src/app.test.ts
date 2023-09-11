import { describe, expect, test } from "bun:test";
import app from "./app";

describe("App", () => {
  test("GET /api/v1/auth/me", async () => {
    const res = await app.request("/api/v1/auth/me");

    expect(res.status).toBe(401);
  });
});
