import prisma from "utils/prisma";

describe("User Navigation", () => {
  it("Navigating between pages", () => {
    cy.visit("/");
    cy.contains("Select Topic");
    cy.contains("Featured Quizzes");

    cy.get("header a[href='/auth/signup']").click();
    cy.url().should("include", "/auth/signup");
    cy.get("button[type='submit']").contains("Sign Up");

    cy.get("header a[href='/auth/signin']").click();
    cy.url().should("include", "/auth/signin");
    cy.get("button[type='submit']").contains("Login");

    cy.contains("Quizzes").click();
    cy.url().should("include", "/");
    cy.contains("Select Topic");
    cy.contains("Featured Quizzes");
  });
});
