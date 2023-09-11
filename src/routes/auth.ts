import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { HonoEnv } from "../types";
import { signIn, signUp } from "../services/auth";
import { requiredAuth } from "../middleware/required-auth";
import { signInSchema, signUpSchema } from "../validators/auth";

const auth = new Hono<HonoEnv>();

auth.post("/login", zValidator("json", signInSchema), async (c) => {
  const input = c.req.valid("json");
  const result = await signIn(input);

  return c.json(result);
});

auth.post("/signup", zValidator("json", signUpSchema), async (c) => {
  const input = c.req.valid("json");
  const result = await signUp(input);

  return c.json(result);
});

auth.get("/me", requiredAuth(), (c) => {
  const user = c.get("user");

  return c.json(Object.assign(user, { password: undefined }));
});

export default auth;
