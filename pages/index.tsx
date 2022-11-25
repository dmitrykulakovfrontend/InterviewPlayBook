import Head from "next/head";
import Layout from "components/Layout";
import QuizCard from "components/QuizCard";
import prisma from "utils/prisma";
import { InferGetStaticPropsType } from "next";
import { useEffect } from "react";
import { Quiz } from "@prisma/client";

export default function Quizzes({
  quizzes,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout>
      <Head>
        <title>Interview PlayBook</title>
        <meta
          name="description"
          content="Web application to improve your answers in interviews by completing quizzes!"
        />
        <link
          rel="icon"
          href="https://res.cloudinary.com/dygvw4rwl/image/upload/v1669356857/IPB/IPBlogo.svg"
        />
        <meta property="og:title" content="Interview PlayBook" />
        <meta property="og:description" content="" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/dygvw4rwl/image/upload/v1669356857/IPB/IPBlogo.svg"
        />
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:image"
          content="https://res.cloudinary.com/dygvw4rwl/image/upload/v1669356857/IPB/IPBlogo.svg"
        />
      </Head>
      <div className="w-4/5 min-h-[80vh]   border-t border-gray-200 shadow-xl rounded-3xl p-6 bg-white max-sm:p-3 max-sm:w-11/12 ">
        <h2 className="text-4xl font-bold">Select Topic</h2>
        <span className="text-gray-500 text-xl">Latest</span>
        <div className="flex justify-center flex-wrap gap-8 max-sm:gap-4">
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
