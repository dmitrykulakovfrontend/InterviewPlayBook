/**
 * Integration test example for the `post` router
 */
import { createContextInner } from "../context";
import { appRouter, AppRouter } from "./_app";
import { inferProcedureInput } from "@trpc/server";
import prisma from "utils/prisma";
import { fail } from "assert";
import { expect, afterAll } from "vitest";

const userInput: inferProcedureInput<AppRouter["auth"]["signUp"]> = {
  email: "test@example.com",
  password: "passwordtest",
  name: "testUserName",
};

describe("Testing auth routes", async () => {
  const ctx = await createContextInner({});
  const caller = appRouter.createCaller(ctx);
  test("Create user", async () => {
    const post = await caller.auth.signUp(userInput);
    const expected = {
      status: 201,
      message: "Account created successfully",
      result: "test@example.com",
    };

    expect(post).toMatchObject(expected);
  });
  test("Make sure user in database with same properties", async () => {
    const createdUser = await prisma.user.findFirst({
      where: { email: userInput.email },
    });
    if (!createdUser) {
      fail("User not found");
      return;
    }
    expect(createdUser.name).toBe(userInput.name);
    expect(createdUser.email).toBe(userInput.email);
  });
});

afterAll(async () => {
  await prisma.user.delete({ where: { email: userInput.email } });
});
