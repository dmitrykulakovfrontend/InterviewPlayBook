import Head from "next/head";
import Layout from "components/Layout";
import { useRouter } from "next/router";
import Image from "next/image";
import prisma from "utils/prisma";
import { InferGetStaticPropsType } from "next";

export default function Quiz({
  quiz,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout>
      <Head>
        <title>{quiz.name}</title>
        <meta name="description" content={quiz.description} />
      </Head>
      <div className="w-4/5 min-h-[80vh]  shadow-xl rounded-3xl p-6 bg-white max-sm:p-3 max-sm:w-11/12 ">
        <div className="relative -top-6">
          <h2 className="text-4xl font-bold">{quiz.name}</h2>
        </div>
        <div className="flex flex-col gap-8 max-sm:gap-4">
          <div className="flex justify-center gap-4">
            <Image
              src={quiz.icon}
              className="shadow-2xl"
              alt="Quiz icon"
              width={250}
              height={250}
            />
            <div>
              <h3>Times Played: {quiz.timesPlayed}</h3>
            </div>
          </div>
        </div>
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
  return {
    props: {
      quiz,
    },
  };
}
