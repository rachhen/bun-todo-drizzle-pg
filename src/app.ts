import { sql } from "drizzle-orm";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

import { HonoEnv } from "./types";
import { HttpException } from "./utils/errors";
import auth from "./routes/auth";
import projects from "./routes/projects";
import todos from "./routes/todos";
import db from "./db";

const app = new Hono<HonoEnv>();
app.use("*", cors({ origin: ["*"] }));
app.use("*", logger());
app.use("*", secureHeaders());

app.route("/api/v1/auth", auth);
app.route("/api/v1/projects", projects);
app.route("/api/v1/projects/:projectId/todos", todos);

app.get("/health", async (c) => {
  await db.execute(sql`select version()`);

  return c.json({ success: true, message: "OK" });
});

app.onError((err, c) => {
  if (err instanceof HttpException) {
    return err.getResponse();
  }

  console.log(err);
  return c.json({ success: false, message: "Internal Server Error" }, 500);
});

export default app;
