import { TRPCError } from "@trpc/server";
import { uploadImage } from "utils/cloudinary";
import {
  quizSchema,
  updateQuizSchema,
  userLikeSchema,
  userResultsSchema,
} from "utils/validations";
import { z } from "zod";
import {
  router,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
} from "../trpc";

export const quizRouter = router({
  create: adminProcedure
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
  update: adminProcedure
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
  delete: adminProcedure
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
  complete: protectedProcedure
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
  data: publicProcedure.input(z.string()).query(async ({ input: id, ctx }) => {
    return await ctx.prisma.quiz.findFirst({ where: { id } });
  }),
  like: publicProcedure
    .input(userLikeSchema)
    .mutation(async ({ input: { quizId, userId }, ctx }) => {
      let quiz = await ctx.prisma.quiz.findFirst({ where: { id: quizId } });

      if (!quiz) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No such quiz: " + quizId,
        });
      }

      let isLiked = quiz.usersWhoLikedId.includes(userId);

      if (isLiked) {
        let newUsersWhoLiked = quiz.usersWhoLikedId.filter(
          (likedUserId) => likedUserId !== userId
        );

        let newQuiz = await ctx.prisma.quiz.update({
          where: { id: quizId },
          data: { usersWhoLikedId: newUsersWhoLiked },
        });

        return {
          status: 201,
          message: "Quiz like removed successfully",
          newQuiz,
        };
      } else {
        let newQuiz = await ctx.prisma.quiz.update({
          where: { id: quizId },
          data: { usersWhoLikedId: { push: userId } },
        });

        return {
          status: 201,
          message: "Quiz liked successfully",
          newQuiz,
        };
      }
    }),
});
