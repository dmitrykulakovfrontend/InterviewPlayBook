import Head from "next/head";
import Layout from "components/Layout";
import Image from "next/image";
import prisma from "utils/prisma";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";
import { Quiz } from "@prisma/client";

import LikeButton from "components/LikeButton";
import { trpc } from "utils/trpc";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
export default function QuizPage({
  quiz,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { mutate: likeQuiz } = trpc.quiz.like.useMutation({
    onSuccess(data) {
      refetch();
    },
    onError(error, variables, context) {
      toast.error(error.message);
    },
  });
  const { data, isLoading, refetch } = trpc.quiz.data.useQuery(quiz.id, {
    queryKey: ["quiz.data", "qu"],
  });
  const { data: session, status } = useSession();
  return (
    <Layout>
      <Head>
        <title>{quiz.name}</title>
        <meta name="description" content={quiz.description} />
        <link rel="icon" href={quiz.icon} />
        <meta property="og:title" content={quiz.name} />
        <meta property="og:description" content="" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={quiz.icon} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:image" content={quiz.icon} />
      </Head>
      <div className="w-4/5 min-h-[80vh] border-t border-gray-200 flex flex-col gap-4  shadow-xl rounded-3xl p-6 bg-white max-sm:p-3 max-sm:w-11/12  max-lg:items-center">
        <h2 className="text-4xl font-bold">{quiz.name}</h2>
        <div className="flex justify-start gap-12 max-lg:flex-col">
          <Image
            src={quiz.icon}
            className="shadow-xl"
            alt="Quiz icon"
            width={400}
            height={400}
            priority
          />
          <div className="flex gap-4 font-sans text-2xl">
            <div className="flex flex-col">
              <h3>Created:</h3>
              <h3>Times Played:</h3>
              <h3>Likes:</h3>
              <h3>Updated:</h3>
            </div>
            <div className="flex flex-col">
              <span>{new Date(quiz.createdAt).toLocaleDateString()}</span>
              <span>
                {data ? data.timesPlayed : <Skeleton width={110} height={30} />}
              </span>
              <span>
                {data ? (
                  data.usersWhoLikedId.length
                ) : (
                  <Skeleton width={110} height={30} />
                )}
              </span>
              <span>{new Date(quiz.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-bold">Description:</h2>
        <p className="text-lg text-center whitespace-pre-wrap">
          {quiz.mainDescription}
        </p>
        <div className="flex gap-4 justify-self-end;">
          <Link
            href={`/quizzes/play/${quiz.id}`}
            className="px-4 py-2 text-xl font-medium text-indigo-500 border rounded-md w-fit hover:bg-gray-100"
          >
            Start
          </Link>
          {data ? (
            <LikeButton
              isLiked={
                data.usersWhoLikedId.includes(session?.user.id || "") &&
                session !== null
              }
              onClick={() => {
                if (session) {
                  likeQuiz({
                    quizId: quiz.id,
                    userId: session.user.id,
                  });
                } else {
                  toast.info("To like that quiz, you need to authenticate");
                }
              }}
              amount={data.usersWhoLikedId.length}
            />
          ) : (
            <Skeleton width={80} height={45} />
          )}
        </div>
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

export const getStaticProps: GetStaticProps<{ quiz: Quiz }, Params> = async ({
  params,
}) => {
  let quiz;
  try {
    quiz = await prisma.quiz.findFirstOrThrow({
      where: { id: params?.id },
    });
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }

  // fixes problem with not serializable Date object
  quiz = JSON.parse(JSON.stringify(quiz));
  return {
    props: {
      quiz,
    },
  };
};
