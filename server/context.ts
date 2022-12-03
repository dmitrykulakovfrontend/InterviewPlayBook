import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";

import prisma from "utils/prisma";

export async function createContext(ctx: trpcNext.CreateNextContextOptions) {
  const session = await unstable_getServerSession(
    ctx.req,
    ctx.res,
    authOptions
  );

  return {
    session,
    prisma,
    req: ctx.req,
    res: ctx.res,
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
