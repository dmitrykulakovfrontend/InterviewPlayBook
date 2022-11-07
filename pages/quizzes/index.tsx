import Head from "next/head";
import Layout from "components/Layout";
import QuizzCard from "components/QuizzCard";
import react from "public/icons/react.png";

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Interview PlayBook</title>
        <meta
          name="description"
          content="Next-gen web application to improve your answers in interviews!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-4/5 min-h-[80vh]  shadow-xl rounded-3xl p-6 bg-white max-sm:p-3 max-sm:w-11/12 ">
        <div className="relative -top-6">
          <h2 className="text-4xl font-bold">Select Topic</h2>
          <span className="text-gray-500 text-xl">Latest</span>
        </div>
        <div className="flex justify-center flex-wrap gap-8 max-sm:gap-4">
          <QuizzCard
            href="/quizzes/react"
            title="React"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae dolores
                    deserunt ea doloremque natus error, rerum quas odio quaerat nam ex
                    commodi hic, suscipit in a veritatis pariatur minus consequuntur!"
            src={react}
          />
        </div>
      </div>
    </Layout>
  );
}
