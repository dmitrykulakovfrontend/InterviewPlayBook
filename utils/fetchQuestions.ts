import { ParsedUrlQuery } from "querystring";
import { apiResponseSchema } from "./validations";

export const fetchQuestions = async (
  query: ParsedUrlQuery,
  signal?: AbortSignal
) => {
  if (!query.category || !query.limit) {
    throw new Error("Invalid category or limit");
  }
  const res = await fetch(
    `https://quizapi.io/api/v1/questions?category=${query.category}&limit=${query.limit}`,
    {
      headers: {
        "X-Api-Key": "LDfSjagSXrHmVV9By2sSC32M7uVVJ4pDO05XxEw3",
      },
      signal,
    }
  );
  const data = await res.json();
  console.log("HERE", data);
  return apiResponseSchema.parse(data);
};
