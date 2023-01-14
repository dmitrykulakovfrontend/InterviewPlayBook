import Head from "next/head";
import { InferGetStaticPropsType } from "next";

import Layout from "components/Layout";
import QuizCard from "components/QuizCard";

import prisma from "utils/prisma";
import { apiResponseSchema } from "../utils/validations";
import { useQuery } from "@tanstack/react-query";
import QuizFilter from "components/QuizFilter";
import { useState } from "react";
import { Filter } from "types/filter";

export default function Quizzes({
  quizzes,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const logo =
    "https://res.cloudinary.com/dygvw4rwl/image/upload/v1669356857/IPB/IPBlogo.svg";

  const [userFilter, setUserFilter] = useState<Filter>({
    category: "Code",
    limit: 10,
  });

  const fetchQuizzes = async () => {
    const res = await fetch(
      `https://quizapi.io/api/v1/questions?category=${userFilter.category}&limit=${userFilter.limit}`,
      {
        headers: {
          "X-Api-Key": "LDfSjagSXrHmVV9By2sSC32M7uVVJ4pDO05XxEw3",
        },
      }
    );
    const data = await res.json();
    return apiResponseSchema.parse(data);
  };

  const { data: apiQuizzes } = useQuery({
    queryKey: ["quizzes", userFilter],
    queryFn: fetchQuizzes,
    refetchOnWindowFocus: false,
  });

  console.log(apiQuizzes);

  return (
    <Layout>
      <Head>
        <title>Interview PlayBook</title>
        <meta
          name="description"
          content="Web application to improve your answers in interviews by completing quizzes!"
        />
        <meta property="og:title" content="Interview PlayBook" />
        <meta property="og:description" content="" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={logo} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:image" content={logo} />
      </Head>
      <div className="w-4/5 min-h-[80vh]   border-t border-gray-200 shadow-xl rounded-3xl p-6 bg-white max-sm:p-3 max-sm:w-11/12 mt-8 ">
        <h2 className="text-4xl font-bold">Select Topic</h2>
        <span className="text-xl text-gray-500">Latest</span>
        <QuizFilter userFilter={userFilter} updateFilter={setUserFilter} />
        <div className="flex flex-wrap justify-center gap-8 max-sm:gap-4">
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              href={`/quizzes/${quiz.id}`}
              title={quiz.name}
              description={quiz.description}
              src={quiz.icon}
            />
          ))}
          {/* {apiQuizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              href={`/quizzes/${quiz.id}`}
              title={quiz.name}
              description={quiz.description}
              src={quiz.icon}
            />
          ))} */}
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  let quizzes = await prisma.quiz.findMany();

  // fixes problem with not serializable Date object
  quizzes = JSON.parse(JSON.stringify(quizzes));

  return {
    props: {
      quizzes,
    },
  };
}
