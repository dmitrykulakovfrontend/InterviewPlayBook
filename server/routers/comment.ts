import { commentSchema } from "utils/validations";
import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const commentRouter = router({
  addComment: protectedProcedure
    .input(commentSchema)
    .mutation(async ({ input, ctx }) => {
      console.log(input);
      const comment = await ctx.prisma.comment.create({
        data: {
          content: input.content,
          author: input.author,
          user: { connect: { id: input.authorId } },
          quiz: { connect: { id: input.quizId } },
          authorAvatar: input.authorAvatar,
        },
      });
      if (comment) {
        return {
          status: 201,
          message: "Commented successfully",
          comment,
        };
      }
    }),
  deleteComment: protectedProcedure
    .input(z.string())
    .mutation(async ({ input: id, ctx }) => {
      console.log(id);
      const comment = await ctx.prisma.comment.delete({
        where: { id },
      });
      if (comment) {
        return {
          status: 201,
          message: "Comment deleted successfully",
          comment,
        };
      }
    }),
});
