import Head from "next/head";
import Layout from "components/Layout";

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Interviewistic</title>
        <meta
          name="description"
          content="Next-gen web application to improve your answers in interviews!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Hi! Welcome to Interview PlayBook</h1>
    </Layout>
  );
}
