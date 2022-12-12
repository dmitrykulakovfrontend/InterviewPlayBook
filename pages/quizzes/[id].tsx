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
import QuizzComment from "components/QuizzComment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faInfo,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import DefaultIcon from "components/DefaultIcon";
import { Comment, commentSchema } from "utils/validations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
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

  const { mutate: addComment } = trpc.quiz.addComment.useMutation({
    onError(error) {
      toast(error.message, {
        type: "error",
      });
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Comment>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      quizId: quiz.id,
    },
  });
  useEffect(() => {
    if (session && session.user.name && session.user.image) {
      setValue("author", session.user.name);
      setValue("authorId", session.user.id);
      setValue("authorAvatar", session.user.image);
    }
  }, [session, setValue]);
  const onSubmit = async (data: Comment) => {
    console.log(data);
    if (!session?.user.name) return;
    addComment({ ...data, quizId: quiz.id, author: session.user.name });
  };

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
      <div className="w-4/5 min-h-[80vh] mt-8 border-t border-gray-200 flex flex-col gap-4  shadow-xl rounded-3xl p-6 bg-white max-sm:p-3 max-sm:w-11/12  max-lg:items-center">
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
        <div className="flex gap-4 py-2 border-b-2 justify-self-end">
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-center justify-center w-full max-w-xl p-4 mx-auto border rounded-2xl"
        >
          <div className="flex flex-wrap ">
            {session?.user.image ? (
              <div className="flex items-center w-full gap-4 px-3">
                <Image
                  className="w-12 h-12 rounded-full"
                  src={session.user.image}
                  alt=""
                  height="48"
                  width="48"
                />
                <div className="text-sm font-semibold">
                  {session.user.name} •{" "}
                  <span className="font-normal">Just now</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center w-full gap-4 px-3">
                <DefaultIcon height={48} width={48} />
                <div className="text-sm font-semibold">
                  You •<span className="font-normal">Just now</span>
                </div>
              </div>
            )}

            {errors.content && (
              <p className="text-red-500">{errors.content.message as string}</p>
            )}
            <textarea
              className="w-full h-20 px-3 py-2 mt-2 mb-2 font-medium leading-normal placeholder-gray-700 bg-gray-100 border border-gray-400 rounded resize-none md:w-fullw-full focus:outline-none focus:bg-white"
              {...register("content")}
              placeholder="Type Your Comment"
              required
              disabled={!session}
            ></textarea>
            <div className="flex items-start justify-between w-full gap-4 px-3 md:w-full max-sm:flex-col max-sm:items-center">
              <div className="flex items-center px-2 text-gray-700">
                <FontAwesomeIcon className="w-5 h-5 mr-1" icon={faCircleInfo} />
                <p className="pt-px text-sm ">Login to write comments</p>
              </div>
              {session ? (
                <button
                  type="submit"
                  className="px-4 py-1 mr-1 font-medium tracking-wide text-gray-700 bg-white border border-gray-400 rounded-lg hover:bg-gray-100"
                >
                  Post Comment
                </button>
              ) : (
                <Link
                  href="/auth/signin"
                  className="px-4 py-1 mr-1 font-medium tracking-wide text-gray-700 bg-white border border-gray-400 rounded-lg hover:bg-gray-100"
                >
                  <span className="text-sm font-medium">Sign in</span>
                </Link>
              )}
            </div>
          </div>
        </form>
        <ul className="mt-8 ">
          {data ? (
            data.comments.map((comment, i) => (
              <li key={i}>
                <QuizzComment comment={comment} />
              </li>
            ))
          ) : (
            <>
              <li>
                <div className="max-w-xl px-10 py-5 mx-auto mt-4 transition duration-500 bg-white border rounded-2xl hover:shadow-xl">
                  <div className="flex items-center gap-4">
                    <Skeleton circle height={48} width={48} />
                    <div className="w-1/2 text-sm font-semibold">
                      <Skeleton />
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600 text-md">
                    <Skeleton count={5} />
                  </p>
                </div>
              </li>
              <li>
                <div className="max-w-xl px-10 py-5 mx-auto mt-4 transition duration-500 bg-white border rounded-2xl hover:shadow-xl">
                  <div className="flex items-center gap-4">
                    <Skeleton circle height={48} width={48} />
                    <div className="w-1/2 text-sm font-semibold">
                      <Skeleton />
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600 text-md">
                    <Skeleton count={5} />
                  </p>
                </div>
              </li>
              <li>
                <div className="max-w-xl px-10 py-5 mx-auto mt-4 transition duration-500 bg-white border rounded-2xl hover:shadow-xl">
                  <div className="flex items-center gap-4">
                    <Skeleton circle height={48} width={48} />
                    <div className="w-1/2 text-sm font-semibold">
                      <Skeleton />
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600 text-md">
                    <Skeleton count={5} />
                  </p>
                </div>
              </li>
            </>
          )}
        </ul>
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
