import prisma from "utils/prisma";
import { trpc } from "utils/trpc";

const user = {
  email: "test@example.com",
  password: "passwordtest",
  name: "testUserName",
};
before(() => {
  cy.task("userCleanup");
});

describe("User Authenticating", () => {
  it("Create new user", () => {
    cy.visit("/");

    cy.get("header a[href='/auth/signup']").click();
    cy.url().should("include", "/auth/signup");

    cy.get("input[name='name']").type(user.name);
    cy.get("input[name='email']").type(user.email);
    cy.get("input[name='password']").type(user.password);

    cy.get("button[type='submit']").contains("Sign Up").click();

    cy.url().should("include", "/auth/signin");
    cy.contains("Please log in now");
  });
  it("Log in", () => {
    cy.visit("/");

    cy.get("header a[href='/auth/signin']").click();
    cy.url().should("include", "/auth/signin");

    cy.get("input[name='email']").type(user.email);
    cy.get("input[name='password']").type(user.password);

    cy.get("button[type='submit']").contains("Login").click();

    cy.contains("Welcome!");
  });
});
