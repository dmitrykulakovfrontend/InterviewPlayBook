import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { signUpSchema } from "../../utils/validations";
import { TRPCError } from "@trpc/server";
import {hash} from 'bcrypt'

export const appRouter = router({
  signUp: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ input, ctx }) => {
      const { name, email, password } = input;
      
      const exists = await ctx.prisma.user.findFirst({ where: {
        OR: [
          { email },
          { name }
        ]} });

      if (exists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists.",
        });
      }

      const hashedPassword = await hash(password,10);

      const result = await ctx.prisma.user.create({
        data: { name, email, password: hashedPassword },
      });

      return {
        status: 201,
        message: "Account created successfully",
        result: result.email,
      };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
