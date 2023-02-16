import Head from "next/head";
import { InferGetStaticPropsType } from "next";

import Layout from "components/Layout";
import QuizCard from "components/QuizCard";

import prisma from "utils/prisma";
import RandomQuizzes from "components/RandomQuizzes";

export default function Quizzes({
  quizzes,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const logo =
    "https://res.cloudinary.com/dygvw4rwl/image/upload/v1669356857/IPB/IPBlogo.svg";

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
              likes={quiz.usersWhoLikedId.length}
            />
          ))}
        </div>
        <RandomQuizzes />
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
