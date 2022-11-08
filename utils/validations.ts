import * as z from "zod";

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5, {message: 'Password must contain atleast 5 characters'}).max(60, {message: 'Password maximum length is 60'}),
});

export const signUpSchema = signInSchema.extend({
  name: z.string().min(3, {message: 'Name must contain atleast 3 characters'}).max(15, {message: 'Name maximum length is 60'}),
});

export type SignIn = z.infer<typeof signInSchema>;
export type SignUp = z.infer<typeof signUpSchema>;