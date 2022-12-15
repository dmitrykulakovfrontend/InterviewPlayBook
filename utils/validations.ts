import * as z from "zod";

const passwordSchema = z
  .string()
  .trim()
  .min(4, { message: "Password must contain atleast 5 characters" })
  .max(60, { message: "Password maximum length is 60" });

export const signInSchema = z.object({
  email: z.string().trim().email(),
  password: passwordSchema,
});

export const signUpSchema = signInSchema.extend({
  name: z
    .string()
    .trim()
    .min(3, { message: "Name must contain atleast 3 characters" })
    .max(15, { message: "Name maximum length is 60" }),
});

export const quizSchema = z.object({
  name: z.string().trim().min(5).max(80),
  description: z.string().trim().min(10).max(200),
  mainDescription: z.string().trim().min(10),
  icon: z.any(),
  questions: z
    .object({
      text: z
        .string()
        .trim()
        .min(5)
        .endsWith("?", { message: "Question must end with question mark" }),
      answer: z.string().trim(),
      choices: z.string().trim().array(),
    })
    .array()
    .min(2, { message: "Quiz must contain atleast 2 questions" }),
});

export const updateQuizSchema = quizSchema.extend({
  oldIcon: z.string(),
  quizId: z.string().trim(),
});

export const userResultsSchema = z.object({
  results: z
    .object({
      correct: z.boolean(),
      userAnswer: z.string().trim(),
      id: z.string().trim(),
    })
    .array(),
  quizId: z.string().trim(),
});

export const userLikeSchema = z.object({
  quizId: z.string().trim(),
  userId: z.string().trim(),
});

export const userSettingsSchema = z.object({
  email: z.string().trim().email().optional(),
  currentPassword: passwordSchema.optional().or(z.literal("")),
  newPassword: passwordSchema.optional().or(z.literal("")),
  name: z.string().trim().optional(),
  avatar: z.any().optional(),
});

export const commentSchema = z.object({
  quizId: z.string(),
  content: z.string().trim().min(1),
  author: z.string(),
  authorId: z.string(),
  authorAvatar: z.string().url().optional(),
});

export type UserSettings = z.infer<typeof userSettingsSchema>;
export type SignIn = z.infer<typeof signInSchema>;
export type SignUp = z.infer<typeof signUpSchema>;
export type Quiz = z.infer<typeof quizSchema>;
export type UpdateQuiz = z.infer<typeof updateQuizSchema>;
export type UserResults = z.infer<typeof userResultsSchema>;
export type UserLike = z.infer<typeof userLikeSchema>;
export type Comment = z.infer<typeof commentSchema>;
