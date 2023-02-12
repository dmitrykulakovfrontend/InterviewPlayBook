import { useQuery } from "@tanstack/react-query";
import Layout from "components/Layout";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Results } from "types/results";
import { Question } from "utils/validations";
import { fetchQuestions } from "../../utils/fetchQuestions";
import Skeleton from "react-loading-skeleton";

export type RandomQuizProps = {};

export default function RandomQuiz(props: RandomQuizProps) {
  const { query } = useRouter();
  const { data: questions } = useQuery({
    queryFn: (e) => fetchQuestions(query, e.signal),
    queryKey: ["questions", query],
    staleTime: Infinity,
    retry: false,
  });

  console.log(questions);

  const [currentQuestion, setCurrentQuestion] = useState<Question | undefined>(
    undefined
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState<
    [string | null, string | null]
  >([null, null]);
  const [results, setResults] = useState<Results>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [answer, setAnswer] = useState<(string | null | undefined)[]>([""]);
  console.log(answer);

  useEffect(() => {
    console.log({
      isFinished,
      results,
      selectedQuestion,
      currentQuestionIndex,
      currentQuestion,
    });
  }, [
    isFinished,
    results,
    selectedQuestion,
    currentQuestionIndex,
    currentQuestion,
  ]);

  const nextQuestion = () => {
    if (!currentQuestion) return;
    const isCorrect = answer.includes(selectedQuestion[1]);

    setResults([
      ...results,
      {
        correctAnswer: answer,
        correct: isCorrect,
        userAnswer: selectedQuestion[1]!,
        id: currentQuestion.question,
      },
    ]);

    if (!query.limit) return;

    let isFinalQuestion = currentQuestionIndex + 1 >= +query.limit;

    if (isFinalQuestion) {
      setIsFinished(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedQuestion([null, null]);
    }
  };

  useEffect(() => {
    if (!questions) return;
    const question = questions[currentQuestionIndex];
    setCurrentQuestion(question);
    const answers = [];
    for (let [key, value] of Object.entries(question.correct_answers)) {
      if (value === "true") {
        if (key === "answer_a_correct") {
          answers.push(currentQuestion?.answers.answer_a);
        }
        if (key === "answer_b_correct") {
          answers.push(currentQuestion?.answers.answer_b);
        }
        if (key === "answer_c_correct") {
          answers.push(currentQuestion?.answers.answer_c);
        }
        if (key === "answer_d_correct") {
          answers.push(currentQuestion?.answers.answer_d);
        }
        if (key === "answer_e_correct") {
          answers.push(currentQuestion?.answers.answer_e);
        }
        if (key === "answer_f_correct") {
          answers.push(currentQuestion?.answers.answer_f);
        }
      }
    }
    setAnswer(answers);
  }, [questions, currentQuestionIndex, currentQuestion]);

  if (!currentQuestion)
    return (
      <Layout>
        <Head>
          <title>{`${currentQuestionIndex + 1} / ${
            query.limit
          } Questions`}</title>
        </Head>
        <div className="w-4/5 min-h-[80vh] border-t border-gray-200 flex  mt-8  flex-col justify-center items-center gap-4  shadow-xl rounded-xl mb-4 p-6 bg-white max-sm:p-3 max-sm:w-11/12 ">
          <h2 className="w-4/5 text-4xl font-bold text-center break-words whitespace-pre-wrap max-md:text-xl">
            <Skeleton />
            <Skeleton height={300} />
          </h2>
          <Skeleton
            width={100}
            className="px-4 py-2 text-xl font-medium text-indigo-500 transition border rounded-md w-fit hover:-translate-y-1 active:-translate-y-0 hover:shadow-lg"
          />
        </div>
      </Layout>
    );

  const choices = Object.entries(currentQuestion.answers).filter(
    (entry) => entry[1]
  );

  if (isFinished && questions)
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
                className={`w-full flex flex-col gap-4 break-words  text-center font-bold text-lg p-4 rounded-xl whitespace-pre-wrap border-2  shadow-md ${
                  result.correct
                    ? "shadow-green-500 border-green-500"
                    : "shadow-red-500 border-red-500"
                }`}
              >
                <p>{questions[i].question}</p>
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
                      Correct answer(s): {result.correctAnswer.join(" | ")}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
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
        <title>{`${currentQuestionIndex + 1} / ${
          query.limit
        } Questions`}</title>
      </Head>
      <div className="w-4/5 min-h-[80vh] border-t border-gray-200 flex  mt-8  flex-col justify-center items-center gap-4  shadow-xl rounded-xl mb-4 p-6 bg-white max-sm:p-3 max-sm:w-11/12 ">
        <h2 className="w-4/5 text-4xl font-bold text-center break-words whitespace-pre-wrap max-md:text-xl">
          {currentQuestion?.question}
        </h2>
        <div className="flex flex-wrap justify-center w-4/5 gap-4 p-4 border rounded-lg shadow-lg">
          {choices.map(([key, answer]) => (
            <button
              onClick={() => setSelectedQuestion([key, answer])}
              className={`w-[calc(50%_-_16px)] text-center break-words p-4 border rounded-lg shadow-md cursor-pointer transition hover:-translate-y-1 active:-translate-y-0 hover:shadow-lg max-lg:w-full ${
                selectedQuestion[1] === answer ? "bg-green-500" : ""
              }`}
              key={answer}
            >
              {answer}
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
