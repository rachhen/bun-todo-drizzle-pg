import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().optional(),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
