import Head from "next/head";
import Layout from "components/Layout";
import prisma from "utils/prisma";
import { InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCancel,
  faTrash,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { trpc } from "utils/trpc";
import router from "next/router";
import { useSession } from "next-auth/react";

export default function QuizzesPage({
  quizzes,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push("/");
    },
  });

  const { mutate: deleteQuiz, isLoading } = trpc.quiz.delete.useMutation({
    onSuccess(data) {
      toast(`Quiz ${data.result.name} deleted successfully!`, {
        type: "success",
      });
      router.push("/admin/quizzes");
    },
    onError(error) {
      toast(error.message, {
        type: "error",
      });
    },
  });

  if (session?.user.role !== "admin") {
    return (
      <Layout>
        <p>Admin access required</p>
      </Layout>
    );
  }

  return (
    <Layout aside>
      <div className="flex flex-wrap items-center w-full h-full gap-4 p-4 justify-evenly">
        {quizzes.map((quiz, i) => {
          return (
            <div
              className="relative w-full border shadow-lg md:w-1/2 lg:w-1/4 h-fit"
              key={i}
            >
              <Link href={`/admin/quizzes/${quiz.id}`}>
                <div className="relative block h-48 overflow-hidden rounded">
                  <Image
                    alt="ecommerce"
                    className="block object-cover object-center w-full h-full border cursor-pointer"
                    src={quiz.icon}
                    width={420}
                    height={260}
                    priority
                  />
                </div>
                <div className="p-2 mt-4">
                  <h3 className="mb-1 text-xs tracking-widest text-gray-500 title-font">
                    QUIZ
                  </h3>
                  <h2 className="text-lg font-medium text-gray-900 title-font">
                    {quiz.name}
                  </h2>
                  <p className="mt-1">
                    {new Date(quiz.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
              <button
                onClick={() => {
                  deleteQuiz(quiz.id);
                }}
                className="absolute w-12 h-12 text-xl font-medium bg-red-500 border rounded-full -top-5 -right-5 hover:bg-red-600"
              >
                <FontAwesomeIcon icon={faTrashAlt} className="text-white" />
              </button>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  let [quizzes] = await Promise.all([prisma.quiz.findMany()]);
  // fixes problem with not serializable Date object
  quizzes = JSON.parse(JSON.stringify(quizzes));
  return {
    props: {
      quizzes,
    },
  };
}
