import prisma from "utils/prisma";
import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const testsRouter = router({
  cleanupUser: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: email }) => {
      await prisma.user.delete({ where: { email } });
    }),
});
