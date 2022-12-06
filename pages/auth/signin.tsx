import Head from "next/head";
import Layout from "components/Layout";
import Link from "next/link";
import Image from "next/image";
import logoIcon from "public/icons/interview-svgrepo-com.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightLong,
  faArrowLeftLong,
  faSignIn,
} from "@fortawesome/free-solid-svg-icons";
import { getProviders, signIn } from "next-auth/react";
import { InferGetServerSidePropsType } from "next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, SignIn as SignInType } from "utils/validations";
import Form from "components/Form";
import Input from "components/Input";
import { toast } from "react-toastify";
import router from "next/router";

async function submit(data: SignInType) {
  const { password, email } = data;
  const response = await signIn("credentials", {
    redirect: false,
    password,
    email,
  });
  if (response?.error) {
    toast(response.error, {
      type: "error",
    });
    return;
  }
  toast(`Welcome!`, {
    type: "success",
  });
  router.push("/");
}

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInType>({
    resolver: zodResolver(signInSchema),
  });
  return (
    <Layout>
      <Head>
        <title>Interview PlayBook</title>
        <meta
          name="description"
          content="Web application to improve your answers in interviews by completing quizzes!"
        />
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
      <div className="xs:p-0 md:max-w-md">
        <Link href="/" className="flex flex-col items-center justify-center">
          <Image
            src={logoIcon}
            className="w-20 h-20 text-gray-500"
            alt=""
            width={80}
            height={80}
          />
          <span className="ml-2 text-3xl text-center font-semibold text-[#252C32]">
            Interview PlayBook
          </span>
        </Link>
        <div className="w-full bg-white divide-y divide-gray-200 rounded-lg shadow-lg">
          <Form
            buttonLabel="Login"
            handleSubmit={handleSubmit}
            onSubmit={(d: SignInType) => submit(d)}
            icon={faArrowRightLong}
          >
            <Input
              register={register}
              name="email"
              type="email"
              placeholder="Enter your email"
              error={errors.email?.message}
              autoFocus
              label="Email"
            />
            <Input
              register={register}
              name="password"
              type="password"
              placeholder="Password"
              label="Password"
              error={errors.password?.message}
            />
          </Form>
          <div className="p-5">
            <div className="flex flex-wrap w-full gap-1">
              <button
                onClick={() => signIn("google", { callbackUrl: "/" })}
                type="button"
                className="transition flex-1 duration-200 border border-gray-200 text-gray-500 w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-normal text-center inline-block"
              >
                Google
              </button>
              <button
                onClick={() => signIn("github", { callbackUrl: "/" })}
                type="button"
                className="transition flex-1 duration-200 border border-gray-200 text-gray-500 w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-normal text-center inline-block"
              >
                Github
              </button>
            </div>
          </div>
          <div className="py-5">
            <div className="flex flex-wrap justify-center w-full gap-1">
              <Link href="/auth/signup">
                <button className="px-5 py-4 mx-5 text-sm font-normal text-center text-gray-500 transition duration-200 rounded-lg cursor-pointer sm:text-left whitespace-nowrap hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
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
                <button className="px-5 py-4 mx-5 text-sm font-normal text-gray-500 transition duration-200 rounded-lg cursor-pointer hover:bg-gray-200 focus:outline-none focus:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
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
