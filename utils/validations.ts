import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5).max(60),
});

export const signUpSchema = loginSchema.extend({
  name: z.string().min(3).max(15),
});

export type Login = z.infer<typeof loginSchema>;
export type SignUp = z.infer<typeof signUpSchema>;