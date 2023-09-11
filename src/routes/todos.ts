import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { HonoEnv } from "../types";
import { requiredAuth } from "../middleware/required-auth";
import { createTodoSchema } from "../validators/todos";
import * as todos from "../services/todos";

const router = new Hono<HonoEnv>();

router.get("/", requiredAuth(), async (c) => {
  const projectId = parseInt(c.req.param("projectId"));
  const results = await todos.find(projectId);

  return c.json(results);
});

router.get("/:id", requiredAuth(), async (c) => {
  const id = parseInt(c.req.param("id"));
  const projectId = parseInt(c.req.param("projectId"));
  const todo = await todos.findById(id, projectId);

  return c.json(todo);
});

router.post(
  "/",
  requiredAuth(),
  zValidator("json", createTodoSchema),
  async (c) => {
    const user = c.get("user");
    const input = c.req.valid("json");
    const projectId = parseInt(c.req.param("projectId"));
    const todo = await todos.create(user, projectId, input);

    return c.json(todo, 201);
  }
);

router.put(
  "/:id",
  requiredAuth(),
  zValidator("json", createTodoSchema),
  async (c) => {
    const input = c.req.valid("json");
    const id = parseInt(c.req.param("id"));
    const projectId = parseInt(c.req.param("projectId"));
    const todo = await todos.update(id, projectId, input);

    return c.json(todo);
  }
);

router.patch("/:id/toggle", requiredAuth(), async (c) => {
  const id = parseInt(c.req.param("id"));
  const projectId = parseInt(c.req.param("projectId"));
  const todo = await todos.toggleTodo(id, projectId);

  return c.json(todo);
});

router.delete("/:id", requiredAuth(), async (c) => {
  const id = parseInt(c.req.param("id"));
  const projectId = parseInt(c.req.param("projectId"));
  const todo = await todos.deleteById(id, projectId);

  return c.json(todo);
});

export default router;
