import Head from "next/head";
import Layout from "components/Layout";
import prisma from "utils/prisma";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { trpc } from "utils/trpc";
import { ParsedUrlQuery } from "querystring";
import { Question } from "@prisma/client";

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
  const [questionChoices, setQuestionChoices] = useState<string[]>([]);

  const question = questions[currentQuestionIndex];

  useEffect(() => {
    setQuestionChoices(shuffleArray([...question.choices, question.answer]));
  }, [question]);

  const { mutate: completeQuiz } = trpc.quiz.complete.useMutation();

  const nextQuestion = () => {
    let userAnswer = questionChoices[selectedQuestion];
    let isCorrect = userAnswer === question.answer;
    if (isCorrect) {
      setResults([
        ...results,
        {
          correct: true,
          userAnswer,
          id: question.id,
        },
      ]);
    } else {
      setResults([
        ...results,
        {
          correct: false,
          userAnswer,
          id: question.id,
        },
      ]);
    }
    let isFinalQuestion = currentQuestionIndex + 1 >= questions.length;
    if (isFinalQuestion) {
      setIsFinished(true);
      completeQuiz({ results, quizId: questions[0].quizId });
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedQuestion(-1);
    }
  };

  function shuffleArray(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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
          <h2 className="text-4xl font-bold">Results:</h2>
          <div className="flex flex-wrap items-center w-4/5 gap-4 p-4">
            {results.map((result, i) => (
              <div
                key={i}
                className={`w-full flex flex-col gap-4  text-center font-bold text-lg p-4 rounded-xl whitespace-pre-wrap border-2  shadow-md ${
                  result.correct
                    ? "shadow-green-500 border-green-500"
                    : "shadow-red-500 border-red-500"
                }`}
              >
                <p>{questions[i].text}</p>
                <div>
                  <p
                    className={`${
                      result.correct ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    Your answer: {result.userAnswer}
                  </p>
                  {!result.correct ? (
                    <p className="text-green-500">
                      Correct answer: {questions[i].answer}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
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
            className="px-4 py-2 text-xl font-medium text-indigo-500 border rounded-md w-fit hover:bg-gray-100"
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
        <meta name="description" content={question.text} />
      </Head>
      <div className="w-4/5 min-h-[80vh] border-t border-gray-200 flex flex-col justify-center items-center gap-4  shadow-xl rounded-xl mb-4 p-6 bg-white max-sm:p-3 max-sm:w-11/12 ">
        <h2 className="w-4/5 text-4xl font-bold text-center break-words whitespace-pre-wrap max-md:text-xl">
          {question.text}
        </h2>
        <div className="flex flex-wrap w-4/5 gap-4 p-4 border rounded-lg shadow-lg">
          {questionChoices.map((text, i) => (
            <button
              onClick={() => setSelectedQuestion(i)}
              className={`w-[calc(50%_-_16px)] text-center break-words p-4 border rounded-lg shadow-md cursor-pointer transition hover:-translate-y-1 active:-translate-y-0 hover:shadow-lg max-lg:w-full ${
                selectedQuestion === i ? "bg-green-500" : ""
              }`}
              key={text}
            >
              {text}
            </button>
          ))}
        </div>
        <button
          onClick={nextQuestion}
          className="px-4 py-2 text-xl font-medium text-indigo-500 transition border rounded-md w-fit hover:-translate-y-1 active:-translate-y-0 hover:shadow-lg"
        >
          Continue
        </button>
      </div>
    </Layout>
  );
}

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
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
};

export const getStaticProps: GetStaticProps<
  { questions: Question[] },
  Params
> = async ({ params }) => {
  let questions;
  try {
    questions = await prisma.question.findMany({
      where: {
        quizId: params?.id,
      },
    });
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }

  // fixes problem with not serializable Date object
  questions = JSON.parse(JSON.stringify(questions));
  return {
    props: {
      questions,
    },
  };
};
