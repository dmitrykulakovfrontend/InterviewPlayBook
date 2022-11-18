import { publicProcedure, router } from "../trpc";
import { QuizSchema, signUpSchema } from "../../utils/validations";
import { TRPCError } from "@trpc/server";
import { hash } from "bcrypt";
import { uploadImage } from "utils/cloudinary";

export const appRouter = router({
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
  createQuiz: publicProcedure
    .input(QuizSchema)
    .mutation(
      async ({
        input: { description, name, questions, icon },
        ctx: { req, res, prisma },
      }) => {
        const exists = await prisma.quiz.findFirst({
          where: {
            OR: [{ name }, { description }],
          },
        });

        if (exists) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Same quiz already exists.",
          });
        }

        let iconUrl = await uploadImage(icon);
        if (!iconUrl) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "We couldn't upload your image, please try again later.",
          });
        }

        let result = await prisma.quiz.create({
          data: {
            name,
            description,
            questions: { create: questions },
            icon: iconUrl,
          },
        });

        try {
          await res.revalidate("/");
          return {
            status: 201,
            message: "Quiz created successfully",
            result,
          };
        } catch (err) {
          console.error(err);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Revalidation error",
          });
        }
      }
    ),
});

// export type definition of API
export type AppRouter = typeof appRouter;
