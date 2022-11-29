import { publicProcedure, router } from "../trpc";
import { quizSchema, signUpSchema, userResultsSchema } from "utils/validations";
import { TRPCError } from "@trpc/server";
import { hash } from "bcrypt";
import { uploadImage } from "utils/cloudinary";
import { updateQuizSchema } from "../../utils/validations";
import { z } from "zod";

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
    .input(quizSchema)
    .mutation(
      async ({
        input: { description, name, questions, icon, mainDescription },
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
            mainDescription,
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
  updateQuiz: publicProcedure
    .input(updateQuizSchema)
    .mutation(
      async ({
        input: {
          description,
          name,
          questions,
          icon,
          mainDescription,
          oldIcon,
          quizId,
        },
        ctx: { req, res, prisma },
      }) => {
        // get image id from url to cloudinary image
        let publicImageId = oldIcon.slice(
          oldIcon.lastIndexOf("/") + 1,
          oldIcon.lastIndexOf(".")
        );
        let iconUrl = await uploadImage(icon, publicImageId);
        if (!iconUrl) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "We couldn't upload your image, please try again later.",
          });
        }

        let result = await prisma.quiz.update({
          where: { id: quizId },
          data: {
            name,
            mainDescription,
            description,
            questions: {
              deleteMany: {},
              createMany: { data: questions },
            },
            icon: iconUrl,
          },
        });

        try {
          await Promise.allSettled([
            res.revalidate("/"),
            res.revalidate(`/quizzes/${result.id}`),
            res.revalidate(`/quizzes/play/${result.id}`),
          ]);

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
  deleteQuiz: publicProcedure
    .input(z.string())
    .mutation(async ({ input: id, ctx: { req, res, prisma } }) => {
      let result = await prisma.quiz.delete({
        where: { id },
      });

      try {
        await res.revalidate("/");

        return {
          status: 201,
          message: "Quiz deleted successfully",
          result,
        };
      } catch (err) {
        console.error(err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Revalidation error",
        });
      }
    }),
  completeQuiz: publicProcedure
    .input(userResultsSchema)
    .mutation(async ({ input, ctx }) => {
      let promises = [];
      promises.push(
        ctx.prisma.quiz.update({
          where: {
            id: input.quizId,
          },
          data: {
            timesPlayed: {
              increment: 1,
            },
          },
        })
      );
      for (let question of input.results) {
        promises.push(
          ctx.prisma.question.update({
            where: {
              id: question.id,
            },
            data: {
              [question.correct ? "answeredCorrectly" : "answeredIncorrectly"]:
                {
                  increment: 1,
                },
            },
          })
        );
      }
      await Promise.all(promises);
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
