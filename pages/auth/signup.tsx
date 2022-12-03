import Head from "next/head";
import Layout from "components/Layout";
import Link from "next/link";
import Image from "next/image";
import logoIcon from "public/icons/interview-svgrepo-com.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightLong,
  faArrowLeftLong,
} from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUp, signUpSchema } from "utils/validations";
import router from "next/router";
import { trpc } from "utils/trpc";
import { toast } from "react-toastify";
import Form from "components/Form";
import Input from "components/Input";

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUp>({
    resolver: zodResolver(signUpSchema),
  });
  const { mutate: SignUpUser, isLoading } = trpc.auth.signUp.useMutation({
    onSuccess(data) {
      toast(`Please log in now with ${data.result}.`, {
        type: "success",
        delay: 1000,
      });
      router.push("/auth/signin");
    },
    onError(error) {
      toast(error.message, {
        type: "error",
        delay: 1000,
      });
    },
  });
  const onSubmit = (data: SignUp) => SignUpUser(data);
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
        <Link
          href="/"
          className="flex flex-col mb-4 items-center justify-center"
        >
          <Image
            src={logoIcon}
            className="h-20 w-20 text-gray-500"
            alt=""
            width={80}
            height={80}
          />
          <span className="ml-2 text-3xl font-semibold text-[#252C32]">
            Interview PlayBook
          </span>
        </Link>
        <div className="bg-white shadow-lg w-full rounded-lg divide-y divide-gray-200">
          <Form
            buttonLabel="Sign Up"
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            icon={faArrowRightLong}
          >
            <Input
              register={register}
              name="name"
              type="name"
              placeholder="Name"
              label="Name"
              error={errors.name?.message}
            />
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
        </div>

        <div className="py-5">
          <div className="grid grid-cols-2 gap-1">
            <div className="text-center sm:text-left whitespace-nowrap">
              <Link href="/auth/signin">
                <button className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-200 focus:outline-none focus:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                  <FontAwesomeIcon icon={faArrowLeftLong} />
                  <span className="inline-block ml-1">Back to sign in</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
