import { Question } from "../validations";
import { fetchRandomQuizzes } from "../fetchRandomQuizzes";
import { QueryFunctionContext } from "@tanstack/react-query";
import { Filter } from "types/filter";
import { expect, expectTypeOf } from "vitest";

describe("Fetching quizzes test", async () => {
  const query = {
    queryKey: [
      "type",
      {
        category: "code",
        limit: "10",
        difficulty: "easy",
      },
    ],
  } as QueryFunctionContext<[string, Filter]>;
  const result = await fetchRandomQuizzes(query);

  test("Result type is array of objects with 'image' and 'title' property", () => {
    expectTypeOf(result).toEqualTypeOf<
      {
        image: string;
        title: string;
      }[]
    >;
  });

  test("Result is actually an array with items", () => {
    expect(Array.isArray(result)).toBe(true);
  });

  test("First item of array is an object with 'question' property as string", () => {
    expect(typeof result[0]).toBe("object");
    expect(typeof result[0].title).toBe("string");
  });

  test("All items in array have the same category as query", () => {
    for (const quizz of result) {
      expect(quizz.title).toMatch(new RegExp(query.queryKey[1].category, "ig"));
    }
  });

  test("Amount of questions is 5", () => {
    expect(result.length).toBe(5);
  });
});
