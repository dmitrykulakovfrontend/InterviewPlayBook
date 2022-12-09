import { TRPCError } from "@trpc/server";
import { compare, hash } from "bcrypt";
import { signUpSchema } from "utils/validations";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { userSettingsSchema } from "../../utils/validations";
import { uploadImage } from "utils/cloudinary";

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
  updateSettings: protectedProcedure
    .input(userSettingsSchema)
    .mutation(async ({ input, ctx }) => {
      let avatarUrl: null | undefined | string = null;
      if (input.avatar) {
        let publicImageId = ctx.session.user.image?.slice(
          ctx.session.user.image.lastIndexOf("/") + 1,
          ctx.session.user.image.lastIndexOf(".")
        );
        avatarUrl = await uploadImage(input.avatar, publicImageId);
        if (!avatarUrl) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "We couldn't upload your image, please try again later.",
          });
        }
      }
      if (ctx.session.user.email !== input.email) {
        const existingUser = await ctx.prisma.user.findFirst({
          where: { email: input.email },
        });
        if (existingUser) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "This user email already exists",
          });
        }
      }

      let hashedPassword: string | null = null;

      if (input.newPassword && input.currentPassword) {
        const previousUser = await ctx.prisma.user.findFirst({
          where: { id: ctx.session.user.id },
        });
        if (previousUser?.password) {
          if (!compare(previousUser.password, input.currentPassword)) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Incorrect password, please try again",
            });
          }
          hashedPassword = await hash(input.newPassword, 10);
        }
      }

      const newUser = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          email: input.email || undefined,
          name: input.name || undefined,
          image: avatarUrl || undefined,
          password: hashedPassword || undefined,
        },
      });

      return {
        status: 201,
        message: "Settings updated successfully",
        newUser,
      };
    }),
  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.user.delete({ where: { id: ctx.session.user.id } });

    return {
      status: 201,
      message: "Account deleted successfully",
    };
  }),
});
