/**
 * Integration test example for the `post` router
 */
import { createContextInner } from "../context";
import { appRouter, AppRouter } from "./_app";
import { inferProcedureInput } from "@trpc/server";

test("add and get post", async () => {
  const ctx = await createContextInner({});
  const caller = appRouter.createCaller(ctx);

  const input: inferProcedureInput<AppRouter["auth"]["signUp"]> = {
    email: "test@example.com",
    password: "passwordtest",
    name: "testUserName",
  };

  const post = await caller.auth.signUp(input);
  const expected = {
    status: 201,
    message: "Account created successfully",
    result: "test@example.com",
  };

  expect(post).toMatchObject(expected);
});
