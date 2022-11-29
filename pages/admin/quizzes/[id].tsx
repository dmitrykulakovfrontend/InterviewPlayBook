import Head from "next/head";
import Layout from "components/Layout";
import prisma from "utils/prisma";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";
import { Question, Quiz } from "@prisma/client";
import QuizForm from "../../../components/QuizForm";
import { trpc } from "utils/trpc";
import { Quiz as ZodQuiz } from "utils/validations";
import { toast } from "react-toastify";
import { getBase64 } from "utils/getBase64";

export default function QuizEditPage({
  quiz,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const onSubmit = async (data: ZodQuiz) => {
    let base64Icon = await getBase64(data.icon[0]);
    const { description, questions, mainDescription, name } = data;

    updateQuiz({
      name,
      description,
      questions,
      mainDescription,
      icon: base64Icon,
      oldIcon: quiz.icon,
      quizId: quiz.id,
    });
  };

  const { mutate: updateQuiz, isLoading } = trpc.updateQuiz.useMutation({
    onSuccess(data) {
      toast(`Quiz ${data.message} created successfully!`, {
        type: "success",
      });
    },
    onError(error) {
      toast(error.message, {
        type: "error",
      });
    },
  });
  return (
    <Layout aside>
      <div className="flex flex-wrap items-center w-full h-full gap-4 p-4 justify-evenly">
        <QuizForm
          onSubmit={onSubmit}
          defaultValues={quiz}
          buttonText="Update Quizz"
          isLoading={isLoading}
        />
      </div>
    </Layout>
  );
}
interface Params extends ParsedUrlQuery {
  id: string;
}

export const getServerSideProps: GetServerSideProps<
  {
    quiz: Quiz & {
      questions: Question[];
    };
  },
  Params
> = async ({ params }) => {
  let quiz = await prisma.quiz.findFirstOrThrow({
    where: { id: params?.id },
    include: { questions: true },
  });
  // fixes problem with not serializable Date object
  quiz = JSON.parse(JSON.stringify(quiz));
  return {
    props: {
      quiz,
    },
  };
};
