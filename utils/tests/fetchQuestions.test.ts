import { fetchQuestions } from "../fetchQuestions";
import { Question } from "../validations";
import { expect, expectTypeOf } from "vitest";

describe("Fetching questions test", async () => {
  const query = {
    limit: "10",
    category: "code",
  };
  const result = await fetchQuestions(query);

  test("Result type is Question array", () => {
    expectTypeOf(result).toEqualTypeOf<Question[]>;
  });

  test("Result is actually an array with items", () => {
    expect(Array.isArray(result)).toBe(true);
  });

  test("First item of array is an object with 'question' property as string", () => {
    expect(typeof result[0]).toBe("object");
    expect(typeof result[0].question).toBe("string");
  });

  test("All items in array have the same category as query", () => {
    for (const question of result) {
      expect(question.category).toMatch(new RegExp(query.category, "i"));
    }
  });

  test("Amount of questions is the same as query limit", () => {
    expect(result.length).toBe(+query.limit);
  });
});
