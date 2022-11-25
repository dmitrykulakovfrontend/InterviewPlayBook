import Head from "next/head";
import Layout from "components/Layout";
import Router, { useRouter } from "next/router";
import Image from "next/image";
import prisma from "utils/prisma";
import { InferGetStaticPropsType } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { trpc } from "utils/trpc";
import NotFound from "pages/404";

type Results = {
  correct: boolean;
  userAnswer: string;
  id: string;
}[];

export default function QuizPlay({
  questions,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(-1);
  const [results, setResults] = useState<Results>([]);

  if (!questions) return <NotFound />;

  const { answer, text, choices, id } = questions[currentQuestionIndex];

  const questionChoices = [...choices, answer];

  const { mutate: completeQuiz } = trpc.completeQuiz.useMutation();

  function nextQuestion() {
    let userAnswer = questionChoices[selectedQuestion];
    if (userAnswer === answer) {
      setResults([
        ...results,
        {
          correct: true,
          userAnswer,
          id,
        },
      ]);
    } else {
      setResults([
        ...results,
        {
          correct: false,
          userAnswer,
          id,
        },
      ]);
    }
    if (currentQuestionIndex + 1 >= questions.length) {
      setIsFinished(true);
      completeQuiz({ results, quizId: questions[0].quizId });
      return;
    }
    setCurrentQuestionIndex((prev) => prev + 1);
    setSelectedQuestion(-1);
  }

  if (isFinished)
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
        <div className="w-4/5 min-h-[80vh] border-t border-gray-200 flex flex-col justify-center items-center gap-4  shadow-xl rounded-3xl p-6 bg-white max-sm:p-3 max-sm:w-11/12 ">
          <h2 className="text-4xl font-bold">{text}</h2>
          <div className="flex flex-wrap border gap-4 p-4 w-4/5 rounded-xl  shadow-lg">
            {results.map((result, i) => (
              <div
                key={i}
                className={`w-full text-center font-bold text-lg p-4 rounded-xl ${
                  result.correct ? "bg-green-500" : "bg-red-500"
                }`}
              >
                <p>{questions[i].text}</p>
                <p>Your answer: {result.userAnswer}</p>
                <p>
                  People answer on that question correctly in:{" "}
                  {(
                    (questions[i].answeredCorrectly /
                      (questions[i].answeredCorrectly +
                        questions[i].answeredIncorrectly)) *
                      100 || 0
                  ).toFixed(2) + "%"}
                </p>
              </div>
            ))}
            <p className="mx-auto">
              You scored{" "}
              {results.reduce((acc, curr) => (curr.correct ? acc + 1 : acc), 0)}{" "}
              / {questions.length}
            </p>
          </div>
          <Link
            href={"/"}
            className="text-xl w-fit font-medium text-indigo-500 hover:bg-gray-100  py-2 px-4 rounded-md border"
          >
            Go back to quizzes
          </Link>
        </div>
      </Layout>
    );

  return (
    <Layout>
      <Head>
        <title>
          {`${currentQuestionIndex + 1} / ${questions.length} Questions`}
        </title>
        <meta name="description" content={text} />
      </Head>
      <div className="w-4/5 min-h-[80vh] border-t border-gray-200 flex flex-col justify-center items-center gap-4  shadow-xl rounded-xl mb-4 p-6 bg-white max-sm:p-3 max-sm:w-11/12 ">
        <h2 className="text-4xl  w-4/5 text-center font-bold break-words max-md:text-xl">
          {text}
        </h2>
        <div className="flex flex-wrap border  rounded-lg gap-4 p-4 w-4/5  shadow-lg">
          {questionChoices.map((text, i) => (
            <div
              onClick={() => setSelectedQuestion(i)}
              className={`w-[calc(50%_-_16px)] text-center break-words p-4 border rounded-lg shadow-md cursor-pointer hover:bg-gray-100 max-lg:w-full ${
                selectedQuestion === i ? "bg-green-500 hover:bg-green-400" : ""
              }`}
              key={text}
            >
              {text}
            </div>
          ))}
        </div>
        <button
          onClick={nextQuestion}
          className="text-xl w-fit font-medium text-indigo-500 hover:bg-gray-100  py-2 px-4 rounded-md border"
        >
          Continue
        </button>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const quizzes = await prisma.quiz.findMany();
  const paths = quizzes.map(({ id }) => {
    return {
      params: {
        id,
      },
    };
  });
  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params: { id } }: any) {
  let questions;
  try {
    questions = await prisma.question.findMany({
      where: {
        quizId: id,
      },
    });
  } catch (error) {
    console.error(error);
    return {
      props: {
        quiz: null,
      },
    };
  }

  // fixes problem with not serializable Date object
  questions = JSON.parse(JSON.stringify(questions));
  return {
    props: {
      questions,
    },
  };
}
