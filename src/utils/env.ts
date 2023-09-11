import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string({ required_error: "DATABASE_URL must be defined" }),
  JWT_SECRET_KEY: z.string({
    required_error: "JWT_SECRET_KEY must be defined",
  }),
});

const env = schema.parse(Bun.env);

export default env;
