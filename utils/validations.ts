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

export const quizSchema = z.object({
  name: z.string().min(5).max(80),
  description: z.string().min(10).max(200),
  mainDescription: z.string().min(10),
  icon: z.any(),
  questions: z
    .object({
      text: z
        .string()
        .min(5)
        .endsWith("?", { message: "Question must end with question mark" }),
      answer: z.string(),
      choices: z.string().array(),
    })
    .array()
    .min(2, { message: "Quiz must contain atleast 2 questions" }),
});

export const updateQuizSchema = quizSchema.extend({
  oldIcon: z.string(),
  quizId: z.string(),
});

export const userResultsSchema = z.object({
  results: z
    .object({
      correct: z.boolean(),
      userAnswer: z.string(),
      id: z.string(),
    })
    .array(),
  quizId: z.string(),
});

export type SignIn = z.infer<typeof signInSchema>;
export type SignUp = z.infer<typeof signUpSchema>;
export type Quiz = z.infer<typeof quizSchema>;
export type UpdateQuiz = z.infer<typeof updateQuizSchema>;
export type userResults = z.infer<typeof userResultsSchema>;
