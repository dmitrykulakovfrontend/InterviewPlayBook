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
      text: z.string().trim().min(5),
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
  authorId: z.string(),
});

export const answersSchema = z.object({
  answer_a: z.string().nullable(),
  answer_b: z.string().nullable(),
  answer_c: z.string().nullable(),
  answer_d: z.string().nullable(),
  answer_e: z.string().nullable(),
  answer_f: z.string().nullable(),
});

export const correctAnswersSchema = z.object({
  answer_a_correct: z.enum(["false", "true"]),
  answer_b_correct: z.enum(["false", "true"]),
  answer_c_correct: z.enum(["false", "true"]),
  answer_d_correct: z.enum(["false", "true"]),
  answer_e_correct: z.enum(["false", "true"]),
  answer_f_correct: z.enum(["false", "true"]),
});

export const questionSchema = z.object({
  id: z.number(),
  question: z.string(),
  description: z.string().nullable(),
  answers: answersSchema,
  correct_answers: correctAnswersSchema,
  explanation: z.string().nullable(),
  tip: z.string().nullable(),
  tags: z.array(z.object({ name: z.string() })),
  category: z.string(),
  multiple_correct_answers: z.string(),
  difficulty: z.string(),
});

export const apiResponseSchema = z.array(questionSchema);

export type UserSettings = z.infer<typeof userSettingsSchema>;
export type SignIn = z.infer<typeof signInSchema>;
export type SignUp = z.infer<typeof signUpSchema>;
export type Quiz = z.infer<typeof quizSchema>;
export type UpdateQuiz = z.infer<typeof updateQuizSchema>;
export type UserResults = z.infer<typeof userResultsSchema>;
export type UserLike = z.infer<typeof userLikeSchema>;
export type Comment = z.infer<typeof commentSchema>;
export type Question = z.infer<typeof questionSchema>;
export type ApiResponse = z.infer<typeof apiResponseSchema>;
