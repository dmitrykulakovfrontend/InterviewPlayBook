import { TRPCError } from "@trpc/server";
import { hash } from "bcrypt";
import { signUpSchema } from "utils/validations";
import { router, publicProcedure } from "../trpc";

export const authRouter = router({
  signUp: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ input, ctx }) => {
      const { name, email, password } = input;

      const exists = await ctx.prisma.user.findFirst({
        where: {
          OR: [{ email }, { name }],
        },
      });

      if (exists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists.",
        });
      }

      const hashedPassword = await hash(password, 10);

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
