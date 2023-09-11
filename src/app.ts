import { Hono } from "hono";

import { HonoEnv } from "./types";
import { HttpException } from "./utils/errors";
import auth from "./routes/auth";
import projects from "./routes/projects";
import todos from "./routes/todos";

const app = new Hono<HonoEnv>();

app.route("/api/v1/auth", auth);
app.route("/api/v1/projects", projects);
app.route("/api/v1/projects/:projectId/todos", todos);

app.onError((err, c) => {
  if (err instanceof HttpException) {
    return err.getResponse();
  }

  console.log(err);
  return c.json({ success: false, message: "Internal Server Error" }, 500);
});

export default app;
