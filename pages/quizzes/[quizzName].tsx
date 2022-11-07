import Head from "next/head";
import Layout from "components/Layout";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Quizz() {
  const router = useRouter();
  const { quizzName } = router.query;
  return (
    <Layout>
      <Head>
        <title>{quizzName} quizz</title>
        <meta
          name="description"
          content="Next-gen web application to improve your answers in interviews!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-4/5 min-h-[80vh]  shadow-xl rounded-3xl p-6 bg-white max-sm:p-3 max-sm:w-11/12 ">
        <div className="relative -top-6">
          <h2 className="text-4xl font-bold">
            {typeof quizzName == "string" &&
              quizzName.slice(0, 1).toUpperCase() + quizzName.slice(1)}
          </h2>
        </div>
        <div className="flex justify-center flex-wrap gap-8 max-sm:gap-4"></div>
      </div>
    </Layout>
  );
}
