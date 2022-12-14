import {
  faComment,
  faQuestion,
  faThumbsUp,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import Layout from "components/Layout";
import { InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import prisma from "utils/prisma";
import { Quiz } from "utils/validations";
import { trpc } from "utils/trpc";
import { getBase64 } from "utils/getBase64";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import DataBox from "components/DataBox";
import QuizForm from "components/QuizForm";
import router from "next/router";

export default function Admin({
  usersAmount,
  likesAmount,
  quizzessAmount,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push("/");
    },
  });

  const onSubmit = async (data: Quiz) => {
    let base64Icon = await getBase64(data.icon[0]);
    const { description, questions, mainDescription, name } = data;

    createQuiz({
      name,
      description,
      questions,
      mainDescription,
      icon: base64Icon,
    });
  };
  const { mutate: createQuiz, isLoading } = trpc.quiz.create.useMutation({
    onSuccess(data) {
      toast(`Quiz ${data.result.name} created successfully!`, {
        type: "success",
      });
    },
    onError(error) {
      toast(error.message, {
        type: "error",
      });
    },
  });

  if (status === "loading") {
    return (
      <Layout>
        <div className="flex flex-wrap justify-center w-full gap-4 p-4">
          <Skeleton width={192} height={85} />
          <Skeleton width={192} height={85} />
          <Skeleton width={192} height={85} />
        </div>
        <h1 className="text-2xl font-bold text-center">
          <Skeleton width={130} />
        </h1>
        <Skeleton width={"70vw"} height={800} />
      </Layout>
    );
  }

  if (session?.user.role !== "admin") {
    return (
      <Layout>
        <p>Admin access required</p>
      </Layout>
    );
  }
  return (
    <Layout aside>
      <div className="flex flex-wrap justify-center w-full gap-4 p-4">
        <DataBox icon={faUsers} valueName="Users" value={usersAmount} />
        <DataBox icon={faThumbsUp} valueName="Likes" value={likesAmount} />
        <DataBox icon={faQuestion} valueName="Quizzes" value={quizzessAmount} />
      </div>

      <h1 className="text-2xl font-bold text-center">Create quiz</h1>
      <QuizForm
        isLoading={isLoading}
        onSubmit={onSubmit}
        buttonText="Create Quizz"
      />
    </Layout>
  );
}

export async function getServerSideProps() {
  const [usersAmount, likes, quizzessAmount] = await Promise.all([
    prisma.user.count(),
    prisma.quiz.findMany({}),
    prisma.quiz.count(),
  ]);
  return {
    props: {
      usersAmount,
      likesAmount: likes.reduce(
        (acc, curr) => acc + curr.usersWhoLikedId.length,
        0
      ),
      quizzessAmount,
    },
  };
}
