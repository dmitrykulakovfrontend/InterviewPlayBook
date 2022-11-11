import {
  faClose,
  faComment,
  faNoteSticky,
  faQuestion,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import Form from "components/Form";
import Input from "components/Input";
import Layout from "components/Layout";
import Spinner from "components/Spinner";
import { InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import prisma from "utils/prisma";
import { Quizz, QuizzSchema } from "utils/validations";
import { useForm, useFieldArray } from "react-hook-form";

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
    control,
  } = useForm<Quizz>({
    resolver: zodResolver(QuizzSchema),
    defaultValues: {
      title: "Your quizz name",
      description: "Your quizz description",
      question: [
        { text: "Question 1?", answer: "Answer 1" },
        { text: "Question 2?", answer: "Answer 2" },
        { text: "Question 3?", answer: "Answer 3" },
        { text: "Question 4?", answer: "Answer 4" },
        { text: "Question 5?", answer: "Answer 5" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "question",
  });

  const onSubmit = (data: Quizz) => console.log(data);

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
            <FontAwesomeIcon
              icon={faComment}
              className=" text-blue-800 dark:text-gray-800 transform transition-transform duration-500 ease-in-out"
            />
          </div>
          <div className="text-right ml-5">
            <p className="text-2xl">{comments}</p>
            <p>Comments</p>
          </div>
        </div>
        <div className="bg-blue-500 basis-48 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
          <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:-translate-y-2">
            <FontAwesomeIcon
              icon={faQuestion}
              className=" text-blue-800 dark:text-gray-800 transform transition-transform duration-500 ease-in-out"
            />
          </div>
          <div className="text-right ml-5">
            <p className="text-2xl">{quizess}</p>
            <p>Quizess</p>
          </div>
        </div>
      </div>

      <h1 className="text-center text-2xl font-bold">Create quizz</h1>
      <Form
        className="border w-2/3 m-auto"
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        icon={faNoteSticky}
      >
        <Input
          name="title"
          type="text"
          register={register}
          placeholder="Quizz name"
          error={errors.title?.message}
          autoFocus
          label="Quizz name"
        />
        <Input
          name="description"
          textarea
          register={register}
          placeholder="Quizz description"
          label="Quizz description"
          error={errors.description?.message}
        />
        <Input
          type="file"
          accept=".png"
          name="icon"
          placeholder="Icon"
          register={register}
          label="Icon"
          error={errors.icon?.message?.toString()}
        />
        {errors.question?.message && (
          <span role="alert" className="text-red-400">
            Quizz must contain atleast 5 questions
          </span>
        )}
        {fields.map((item, index) => {
          return (
            <div className="w-full" key={item.id}>
              <div className="mb-1 w-full flex gap-4 items-center justify-end">
                <h3>Question {index + 1}</h3>
                <button
                  className=" w-fit py-2 px-3 transition duration-200 bg-red-500 hover:bg-red-600 focus:bg-red-700 focus:shadow-sm focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 text-white rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
                  onClick={() => remove(index)}
                >
                  <FontAwesomeIcon icon={faClose} />
                </button>
              </div>
              <Input
                name={`question.${index}.text`}
                register={register}
                placeholder="Question"
                error={errors.question && errors.question[index]?.text?.message}
                label="Question"
                textarea
              />
              <Input
                name={`question.${index}.answer`}
                placeholder="Answer"
                register={register}
                label="Answer"
                error={
                  errors.question && errors.question[index]?.answer?.message
                }
                textarea
              />
            </div>
          );
        })}
        <div className="flex gap-4 justify-around">
          <button
            type="submit"
            className="w-fit py-3 px-5 transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
          >
            <span className="inline-block mr-2">Create Quizz</span>
          </button>
          <button
            type="button"
            onClick={() => {
              append({ text: "", answer: "" });
            }}
            className="w-fit py-3 px-5 transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
          >
            <span className="inline-block mr-2">Add Question</span>
          </button>
        </div>
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
