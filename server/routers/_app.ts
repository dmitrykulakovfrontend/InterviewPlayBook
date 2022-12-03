import { router } from "../trpc";
import { authRouter } from "./auth";
import { quizRouter } from "./quiz";

export const appRouter = router({
  auth: authRouter,
  quiz: quizRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
