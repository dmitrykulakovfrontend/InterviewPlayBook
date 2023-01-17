import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import { Filter } from "types/filter";
import { fetchRandomQuizzes } from "utils/fetchRandomQuizzes";
import QuizCard from "./QuizCard";
import QuizFilter from "./QuizFilter";

type RandomQuizzesProps = {};

export default function RandomQuizzes({}: RandomQuizzesProps) {
  const [userFilter, setUserFilter] = useState<Filter>({
    category: "Code",
    limit: 10,
    difficulty: "Medium",
  });

  const {
    data: randomQuizzes,
    isLoading,
    isSuccess,
    isFetching,
  } = useQuery({
    queryKey: ["quizzes", userFilter],
    queryFn: () => fetchRandomQuizzes(userFilter.category),
    refetchOnWindowFocus: false,
    retry: false,
    onError: (err) => {
      console.error(err);
      toast("Random Quizzes is not available :(", { type: "error" });
    },
    keepPreviousData: false,
  });

  console.log({ isFetching, isSuccess });

  return (
    <>
      <h2 className="p-2 my-8 text-3xl font-bold text-center border-b">
        Random Quizzes
      </h2>
      <QuizFilter userFilter={userFilter} updateFilter={setUserFilter} />
      <div className="flex flex-wrap justify-center gap-8 max-sm:gap-4">
        {isFetching ? (
          <>
            <Skeleton
              containerClassName={
                "basis-72 max-w-md flex-1  min-h-[300px] flex flex-col justify-between relative py-4 px-8 "
              }
              className="rounded-lg shadow-lg"
              height={300}
            />
            <Skeleton
              containerClassName={
                "basis-72 max-w-md flex-1  min-h-[300px] flex flex-col justify-between relative py-4 px-8 "
              }
              className="rounded-lg shadow-lg"
              height={300}
            />
            <Skeleton
              containerClassName={
                "basis-72 max-w-md flex-1  min-h-[300px] flex flex-col justify-between relative py-4 px-8 "
              }
              className="rounded-lg shadow-lg"
              height={300}
            />
            <Skeleton
              containerClassName={
                "basis-72 max-w-md flex-1  min-h-[300px] flex flex-col justify-between relative py-4 px-8 "
              }
              className="rounded-lg shadow-lg"
              height={300}
            />
            <Skeleton
              containerClassName={
                "basis-72 max-w-md flex-1  min-h-[300px] flex flex-col justify-between relative py-4 px-8 "
              }
              className="rounded-lg shadow-lg"
              height={300}
            />
          </>
        ) : isSuccess ? (
          randomQuizzes.map((quiz, i) => (
            <QuizCard
              key={i}
              href={`/quizzes/${i}`}
              title={quiz.title}
              src={quiz.image}
            />
          ))
        ) : (
          ""
        )}
      </div>
    </>
  );
}
