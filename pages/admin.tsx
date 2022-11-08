import { faNoteSticky, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import Form from "components/Form";
import Input from "components/Input";
import Layout from "components/Layout";
import Spinner from "components/Spinner";
import { InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import prisma from "utils/prisma";
import { SignUp, signUpSchema } from "utils/validations";
import { useForm } from "react-hook-form";

export default function Admin({
  users,
  comments,
  quizess,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: session, status } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUp>({ resolver: zodResolver(signUpSchema) });

  const onSubmit = (data: SignUp) => console.log(data);

  if (status === "loading") {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }

  if (session?.user.role !== "admin") {
    return (
      <Layout>
        <p>Admin access required</p>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="w-full justify-center flex flex-wrap p-4 gap-4">
        <div className="bg-blue-500 basis-48 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
          <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:-translate-y-2">
            <FontAwesomeIcon
              icon={faUsers}
              className=" text-blue-800 dark:text-gray-800 transform transition-transform duration-500 ease-in-out"
            />
          </div>
          <div className="text-right ml-5">
            <p className="text-2xl">{users}</p>
            <p>Users</p>
          </div>
        </div>
        <div className="bg-blue-500 basis-48 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
          <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:-translate-y-2">
            <svg
              width="30"
              height="30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="stroke-current text-blue-800 dark:text-gray-800 transform transition-transform duration-500 ease-in-out"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              ></path>
            </svg>
          </div>
          <div className="text-right ml-5">
            <p className="text-2xl">{comments}</p>
            <p>Comments</p>
          </div>
        </div>
        <div className="bg-blue-500 basis-48 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
          <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:-translate-y-2">
            <svg
              width="30"
              height="30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="stroke-current text-blue-800 dark:text-gray-800 transform transition-transform duration-500 ease-in-out"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              ></path>
            </svg>
          </div>
          <div className="text-right ml-5">
            <p className="text-2xl">{quizess}</p>
            <p>Quizess</p>
          </div>
        </div>
      </div>

      <h1 className="text-center text-2xl font-bold">Create quizz</h1>
      <Form
        className="border w-fit m-auto"
        buttonLabel="Change Email"
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        icon={faNoteSticky}
      >
        <Input
          name="email"
          type="email"
          placeholder="Enter your email"
          error={errors.email?.message}
          autoFocus
          label="Email"
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          label="Password"
          error={errors.password?.message}
        />
      </Form>
    </Layout>
  );
}

export async function getServerSideProps() {
  let users = await prisma.user.count();
  let comments = await prisma.comment.count();
  let quizess = await prisma.quizz.count();
  return {
    props: {
      users,
      comments,
      quizess,
    },
  };
}
