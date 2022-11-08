import Head from "next/head";
import Layout from "components/Layout";
import Link from "next/link";
import Image from "next/image";
import logoIcon from "public/icons/interview-svgrepo-com.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightLong,
  faUnlock,
  faLifeRing,
  faArrowLeftLong,
  faSignIn,
} from "@fortawesome/free-solid-svg-icons";
import { getProviders, signIn } from "next-auth/react";
import { InferGetServerSidePropsType } from "next";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, Login } from "utils/validations";

function submit(data: FieldValues) {
  const { password, email } = data;
  console.log(password);
  signIn("credentials", {
    callbackUrl: "/",
    password,
    email,
  });
}

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
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
      <div className="xs:p-0 md:max-w-md">
        <Link href="/" className="flex flex-col items-center justify-center">
          <Image
            src={logoIcon}
            className="h-20 w-20 text-gray-500"
            alt=""
            width={80}
            height={80}
          />
          <span className="ml-2 text-3xl text-center font-semibold text-[#252C32]">
            Interview PlayBook
          </span>
        </Link>
        <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
          <form onSubmit={handleSubmit((d) => submit(d))} className="px-5 py-7">
            <label className="font-semibold text-sm text-gray-600 pb-1 block">
              E-mail
            </label>
            {errors.email?.message && <p>{errors.email.message.toString()}</p>}
            <input
              {...register("email")}
              className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
            />
            <label className="font-semibold text-sm text-gray-600 pb-1 block">
              Password
            </label>
            {errors.password?.message && (
              <p>{errors.password.message.toString()}</p>
            )}
            <input
              {...register("password")}
              type="password"
              className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
            />
            <button
              type="submit"
              className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
            >
              <span className="inline-block mr-2">Login</span>
              <FontAwesomeIcon icon={faArrowRightLong} />
            </button>
          </form>
          <div className="p-5">
            <div className="flex flex-wrap w-full gap-1">
              {providers &&
                Object.values(providers)
                  .filter((provider) => provider.type !== "credentials")
                  .map((provider) => (
                    <button
                      key={provider.name}
                      onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                      type="button"
                      className="transition flex-1 duration-200 border border-gray-200 text-gray-500 w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-normal text-center inline-block"
                    >
                      {provider.name}
                    </button>
                  ))}
            </div>
          </div>
          <div className="py-5">
            <div className="flex flex-wrap justify-center w-full gap-1">
              <Link href="/auth/signup">
                <button className="text-center sm:text-left whitespace-nowrap transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                  <FontAwesomeIcon icon={faSignIn} />
                  <span className="inline-block ml-1">Sign Up</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="py-5">
          <div className="grid grid-cols-2 gap-1">
            <div className="text-center sm:text-left whitespace-nowrap">
              <Link href="/">
                <button className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-200 focus:outline-none focus:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                  <FontAwesomeIcon icon={faArrowLeftLong} />
                  <span className="inline-block ml-1">Back to home page</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
