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
    difficulty: "Medium",
  });

  const fetchRandomQuizzes = async () => {
    // https://random-word-form.herokuapp.com/random/adjective?count=5

    const urls = [];

    urls.push(
      `https://random-word-form.herokuapp.com/random/adjective?count=5`
    );

    // https://random.imagecdn.app/v1/image?width=500&height=150&category=buildings
    for (let i = 0; i < 5; i++) {
      urls.push(`https://random.imagecdn.app/v1/image?width=80&height=80`);
    }
    const data = await Promise.all(
      urls.map(async (url, i) => {
        const resp = await fetch(url);
        return i === 0 ? resp.json() : resp.text();
      })
    );
    console.log(data);
    const adjective = data.shift();

    const randomQuizzes = [];

    for (let i = 0; i < data.length; i++) {
      randomQuizzes.push({
        image: data[i],
        title: `${
          adjective[i].slice(0, 1).toUpperCase() + adjective[i].slice(1)
        } ${userFilter.category} Quizz`,
      });
    }
    return randomQuizzes;

    // const res = await fetch(
    //   `https://quizapi.io/api/v1/questions?category=${userFilter.category}&limit=${userFilter.limit}`,
    //   {
    //     headers: {
    //       "X-Api-Key": "LDfSjagSXrHmVV9By2sSC32M7uVVJ4pDO05XxEw3",
    //     },
    //   }
    // );
    // const data = await res.json();
    // return apiResponseSchema.parse(data);
  };

  const { data: randomQuizzes } = useQuery({
    queryKey: ["quizzes", userFilter],
    queryFn: fetchRandomQuizzes,
    refetchOnWindowFocus: false,
  });

  console.log(randomQuizzes);

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
      <div className="w-4/5 min-h-[80vh] border-t border-gray-200 shadow-xl rounded-3xl p-6 bg-white max-sm:p-3 max-sm:w-11/12 mt-8 ">
        <h2 className="text-4xl font-bold">Select Topic</h2>
        <span className="text-xl text-gray-500">Latest</span>
        <h2 className="p-2 mb-8 text-3xl font-bold text-center border-b">
          Featured Quizzes
        </h2>
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
        </div>
        <h2 className="p-2 my-8 text-3xl font-bold text-center border-b">
          Random Quizzes
        </h2>
        <QuizFilter userFilter={userFilter} updateFilter={setUserFilter} />
        <div className="flex flex-wrap justify-center gap-8 max-sm:gap-4">
          {randomQuizzes?.map((quiz, i) => (
            <QuizCard
              key={i}
              href={`/quizzes/${i}`}
              title={quiz.title}
              src={quiz.image}
            />
          ))}
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
