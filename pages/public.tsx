import Layout from "components/Layout";
import Head from "next/head";

export default function PublicPage() {
  return (
    <Layout>
      <Head>
        <title>Public</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>
        Hi! You are viewing public and everyone has access to that, even if you
        are not logged in!
      </h1>
    </Layout>
  );
}
