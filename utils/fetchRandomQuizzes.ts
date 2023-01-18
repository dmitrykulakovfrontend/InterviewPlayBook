import { QueryFunctionContext } from "@tanstack/react-query";
import { Filter } from "types/filter";

const QUIZ_AMOUNT = 5;

export const fetchRandomQuizzes = async ({
  queryKey: [type, userFilter],
  signal,
}: QueryFunctionContext<[string, Filter]>) => {
  const urls = [];

  urls.push(
    `https://random-word-form.herokuapp.com/random/adjective?count=${QUIZ_AMOUNT}`
  );
  // https://random.imagecdn.app/v1/image?width=80&height=80
  //
  for (let i = 0; i < QUIZ_AMOUNT; i++) {
    urls.push("https://picsum.photos/80");
  }

  const fetchPromises = urls.map(async (url, i) => {
    return fetch(url, { signal });
  });

  const responses = await Promise.all(fetchPromises);

  const responsesPromises = responses.map(async (resp, i) => {
    if (!resp.ok) {
      throw new Error("Network response was not ok");
    }
    return i === 0 ? resp.json() : resp.url;
  });

  const data = await Promise.all(responsesPromises);

  const adjectives = data.shift();

  const randomQuizzes = [];

  for (let i = 0; i < data.length; i++) {
    randomQuizzes.push({
      image: data[i],
      title: `${
        adjectives[i].slice(0, 1).toUpperCase() + adjectives[i].slice(1)
      } ${userFilter.category} Quizz`,
    });
  }
  return randomQuizzes;
};
