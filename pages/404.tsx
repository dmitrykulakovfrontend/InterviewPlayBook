import Head from "next/head";
import Layout from "components/Layout";

export default function NotFound() {
  return (
    <Layout>
      <Head>
        <title>404 - Page Not Found</title>
        <link
          rel="icon"
          href="https://res.cloudinary.com/dygvw4rwl/image/upload/v1669356857/IPB/IPBlogo.svg"
        />
        <meta property="og:title" content="Interview PlayBook" />
        <meta property="og:description" content="" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/dygvw4rwl/image/upload/v1669356857/IPB/IPBlogo.svg"
        />
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:image"
          content="https://res.cloudinary.com/dygvw4rwl/image/upload/v1669356857/IPB/IPBlogo.svg"
        />
      </Head>
      <div className="w-4/5 min-h-[80vh] items-center justify-center flex  border-t border-gray-200 shadow-xl rounded-3xl p-6 bg-white max-sm:p-3 max-sm:w-11/12  mt-8 ">
        <h1 className="m-auto text-3xl font-bold text-center">
          Something went wrong and we couldn&apos;t find that page :(
        </h1>
      </div>
    </Layout>
  );
}
