import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email(),
  firstName: z.string({ required_error: "First name is required" }),
  lastName: z.string({ required_error: "Last name is required" }),
  password: z.string({ required_error: "Password is required" }),
});

export const signInSchema = signUpSchema.pick({
  email: true,
  password: true,
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
