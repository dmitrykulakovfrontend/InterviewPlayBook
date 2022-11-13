import * as z from "zod";

export const signInSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(5, { message: "Password must contain atleast 5 characters" })
    .max(60, { message: "Password maximum length is 60" }),
});

export const signUpSchema = signInSchema.extend({
  name: z
    .string()
    .min(3, { message: "Name must contain atleast 3 characters" })
    .max(15, { message: "Name maximum length is 60" }),
});

const MAX_FILE_SIZE = 500000;
export const QuizzSchema = z.object({
  name: z.string().min(5).max(40),
  description: z.string().min(10),
  icon: z.any(),
  questions: z
    .object({
      text: z
        .string()
        .min(5)
        .endsWith("?", { message: "Question must end with question mark" }),
      answer: z.string().min(5),
    })
    .array()
    .min(5, { message: "Quizz must contain atleast 5 questions" }),
});

export type SignIn = z.infer<typeof signInSchema>;
export type SignUp = z.infer<typeof signUpSchema>;
export type Quizz = z.infer<typeof QuizzSchema>;
