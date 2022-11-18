import Head from "next/head";
import Layout from "components/Layout";
import { useRouter } from "next/router";
import Image from "next/image";
import prisma from "utils/prisma";
import { InferGetStaticPropsType } from "next";
import Link from "next/link";

export default function Quiz({
  quiz,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout>
      <Head>
        <title>{quiz.name}</title>
        <meta name="description" content={quiz.description} />
      </Head>
      <div className="w-4/5 min-h-[80vh] border-t border-gray-200 flex flex-col gap-4  shadow-xl rounded-3xl p-6 bg-white max-sm:p-3 max-sm:w-11/12 ">
        <h2 className="text-4xl font-bold">{quiz.name}</h2>
        <div className="flex justify-start gap-12 ">
          <Image
            src={quiz.icon}
            className="shadow-xl"
            alt="Quiz icon"
            width={400}
            height={400}
            priority
          />
          <div className="flex gap-4 text-2xl font-sans">
            <div className="flex flex-col">
              <h3>Created:</h3>
              <h3>Times Played:</h3>
              <h3>Likes:</h3>
              <h3>Dislikes:</h3>
              <h3>Updated:</h3>
            </div>
            <div className="flex flex-col">
              <span>{new Date(quiz.createdAt).toLocaleDateString()}</span>
              <span>{quiz.timesPlayed}</span>
              <span>{quiz.likes}</span>
              <span>{quiz.dislikes}</span>
              <span>{new Date(quiz.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-bold">Description:</h2>
        <p className="text-lg whitespace-pre-wrap">{quiz.mainDescription}</p>
        <Link
          href={"/"}
          className="text-xl w-fit font-medium text-indigo-500 hover:bg-gray-100  py-2 px-4 rounded-md border"
        >
          Start
        </Link>
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
  console.log(paths);
  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params: { id } }: any) {
  let quiz = await prisma.quiz.findFirstOrThrow({
    where: { id },
  });

  // fixes problem with not serializable Date object
  quiz = JSON.parse(JSON.stringify(quiz));
  return {
    props: {
      quiz,
    },
  };
}
