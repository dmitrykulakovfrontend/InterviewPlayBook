import Layout from "components/Layout";
import { useSession } from "next-auth/react";
import Head from "next/head";

export default function PublicPage() {
  const { status } = useSession();
  if (status === "unauthenticated") {
    return (
      <Layout>
        <Head>
          <title>Closed</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <h1>
          This is closed page for authenticated users only! You can't see data
          here :(
        </h1>
      </Layout>
    );
  }
  if (status === "authenticated") {
    return (
      <Layout>
        <Head>
          <title>Public</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <h1>
          Its restricted area, but you have access because you are logged in!
          Congrats!
        </h1>
      </Layout>
    );
  }
}
