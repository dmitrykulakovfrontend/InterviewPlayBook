import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { Session, unstable_getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next/types";
import { authOptions } from "pages/api/auth/[...nextauth]";

import prisma from "utils/prisma";

interface CreateContextOptions {
  // session: Session | null
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function createContextInner(_opts: CreateContextOptions) {
  const session = {} as Session;
  return {
    session,
    prisma,
    req: {} as NextApiRequest,
    res: {} as NextApiResponse,
  };
}

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
