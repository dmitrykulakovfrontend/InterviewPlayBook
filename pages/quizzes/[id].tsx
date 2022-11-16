import Head from "next/head";
import Layout from "components/Layout";
import { useRouter } from "next/router";
import Image from "next/image";
import prisma from "utils/prisma";
import { InferGetStaticPropsType } from "next";

export default function Quizz({
  quizz,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout>
      <Head>
        <title>{quizz?.name}</title>
        <meta name="description" content={quizz?.description} />
      </Head>
      <div className="w-4/5 min-h-[80vh]  shadow-xl rounded-3xl p-6 bg-white max-sm:p-3 max-sm:w-11/12 ">
        <div className="relative -top-6">
          <h2 className="text-4xl font-bold">{quizz?.name}</h2>
        </div>
        <div className="flex justify-center flex-wrap gap-8 max-sm:gap-4"></div>
      </div>
    </Layout>
  );
}
export async function getStaticPaths() {
  const quizzes = await prisma.quizz.findMany();
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
  let quizz = await prisma.quizz.findFirst({
    where: { id },
  });
  return {
    props: {
      quizz,
    },
  };
}
