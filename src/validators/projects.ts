import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().nonempty(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
