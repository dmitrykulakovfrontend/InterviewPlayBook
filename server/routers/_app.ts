import { router } from "../trpc";
import { authRouter } from "./auth";
import { commentRouter } from "./comment";
import { quizRouter } from "./quiz";
import { testsRouter } from "./tests";

export const appRouter = router({
  auth: authRouter,
  quiz: quizRouter,
  comment: commentRouter,
  tests: testsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
