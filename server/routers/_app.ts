import { router } from "../trpc";
import { authRouter } from "./auth";
import { commentRouter } from "./comment";
import { quizRouter } from "./quiz";

export const appRouter = router({
  auth: authRouter,
  quiz: quizRouter,
  comment: commentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
