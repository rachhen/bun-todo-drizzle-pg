import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { HonoEnv } from "../types";
import * as projects from "../services/projects";
import { requiredAuth } from "../middleware/required-auth";
import { createProjectSchema } from "../validators/projects";

const router = new Hono<HonoEnv>();

router.get("/", requiredAuth(), async (c) => {
  const user = c.get("user");
  const results = await projects.find(user);

  return c.json(results);
});

router.get("/:id", requiredAuth(), async (c) => {
  const user = c.get("user");
  const id = parseInt(c.req.param("id"));
  const project = await projects.findById(user, id);

  return c.json(project);
});

router.post(
  "/",
  requiredAuth(),
  zValidator("json", createProjectSchema),
  async (c) => {
    const user = c.get("user");
    const input = c.req.valid("json");
    const project = await projects.create(user, input);

    return c.json(project);
  }
);

router.put(
  "/:id",
  requiredAuth(),
  zValidator("json", createProjectSchema),
  async (c) => {
    const user = c.get("user");
    const input = c.req.valid("json");
    const id = parseInt(c.req.param("id"));
    const project = await projects.update(user, id, input);

    return c.json(project);
  }
);

router.delete("/:id", requiredAuth(), async (c) => {
  const user = c.get("user");
  const id = parseInt(c.req.param("id"));
  const project = await projects.findById(user, id);

  return c.json(project);
});

export default router;
