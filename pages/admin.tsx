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
import { Quiz, QuizSchema } from "utils/validations";
import { useForm, useFieldArray } from "react-hook-form";
import { trpc } from "utils/trpc";
import { useRef } from "react";
import getBase64 from "utils/getBase64";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";

export default function Admin({
  usersAmount,
  commentsAmount,
  quizzessAmount,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: session, status } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<Quiz>({
    resolver: zodResolver(QuizSchema),
    defaultValues: {
      name: "Your quiz name",
      description: "Your quiz description",
      mainDescription: "Quiz info on it's page",
      questions: [
        {
          text: "Question 1?",
          answer: "Answer 1",
          choices: ["Choice 1", "Choice 2", "Choice 3"],
        },
        {
          text: "Question 2?",
          answer: "Answer 2",
          choices: ["Choice 1", "Choice 2", "Choice 3"],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const onSubmit = async (data: Quiz) => {
    let base64Icon = await getBase64(data.icon[0]);
    const { description, questions, mainDescription, name } = data;

    createQuiz({
      name,
      description,
      questions,
      mainDescription,
      icon: base64Icon,
    });
  };
  const { mutate: createQuiz, isLoading } = trpc.createQuiz.useMutation({
    onSuccess(data) {
      toast(`Quiz ${data.result.name} created successfully!`, {
        type: "success",
        autoClose: false,
      });
    },
    onError(error) {
      toast(error.message, {
        type: "error",
      });
    },
  });

  if (status === "loading") {
    return (
      <Layout>
        <div className="w-full justify-center flex flex-wrap p-4 gap-4">
          <Skeleton width={192} height={85} />
          <Skeleton width={192} height={85} />
          <Skeleton width={192} height={85} />
        </div>
        <h1 className="text-center text-2xl font-bold">
          <Skeleton width={130} />
        </h1>
        <Skeleton width={"70vw"} height={800} />
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
            <p className="text-2xl">{usersAmount}</p>
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
            <p className="text-2xl">{commentsAmount}</p>
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
            <p className="text-2xl">{quizzessAmount}</p>
            <p>Quizzess</p>
          </div>
        </div>
      </div>

      <h1 className="text-center text-2xl font-bold">Create quiz</h1>
      <Form
        className="border w-2/3 m-auto"
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        icon={faNoteSticky}
      >
        <Input
          name="name"
          type="text"
          required
          register={register}
          placeholder="Quiz name"
          error={errors.name?.message}
          autoFocus
          label="Quiz name"
        />
        <Input
          name="description"
          textarea
          required
          register={register}
          placeholder="Quiz description"
          label="Quiz description"
          error={errors.description?.message}
        />
        <Input
          name="mainDescription"
          textarea
          required
          register={register}
          placeholder="Quiz info on it's page"
          label="Quiz info on it's page"
          error={errors.mainDescription?.message}
        />
        <Input
          type="file"
          required
          accept="image/*"
          name="icon"
          placeholder="Icon"
          register={register}
          label="Icon"
          error={errors.icon?.message?.toString()}
        />
        {errors.questions?.message && (
          <span role="alert" className="text-red-400">
            Quiz must contain atleast 5 questions
          </span>
        )}
        {fields.map((item, index) => {
          return (
            <div className="w-full flex flex-col gap-4" key={item.id}>
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
                name={`questions.${index}.text`}
                register={register}
                required
                placeholder="Question"
                error={
                  errors.questions && errors.questions[index]?.text?.message
                }
                label="Question"
              />
              <Input
                name={`questions.${index}.answer`}
                placeholder="Answer"
                register={register}
                required
                label="Answer"
                error={
                  errors.questions && errors.questions[index]?.answer?.message
                }
              />
              {item.choices.map((choice, choiceIndex) => (
                <Input
                  key={choice}
                  name={`questions.${index}.choices.${choiceIndex}`}
                  placeholder={`Choice ${choiceIndex + 1}`}
                  register={register}
                  required
                  label={`Choice ${choiceIndex + 1}`}
                  error={
                    errors.questions &&
                    errors.questions[index]?.choices?.message
                  }
                />
              ))}
            </div>
          );
        })}
        <div className="flex gap-4 justify-around">
          {isLoading ? (
            <button className="w-fit py-3 px-5 transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block">
              Loading...
            </button>
          ) : (
            <>
              <button
                type="submit"
                className="w-fit py-3 px-5 transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
              >
                <span className="inline-block mr-2">Create Quiz</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  append({ text: "", answer: "", choices: ["", "", "", ""] });
                }}
                className="w-fit py-3 px-5 transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
              >
                <span className="inline-block mr-2">Add Question</span>
              </button>
            </>
          )}
        </div>
      </Form>
    </Layout>
  );
}

export async function getServerSideProps() {
  const [usersAmount, commentsAmount, quizzessAmount] = await Promise.all([
    prisma.user.count(),
    prisma.comment.count(),
    prisma.quiz.count(),
  ]);
  return {
    props: {
      usersAmount,
      commentsAmount,
      quizzessAmount,
    },
  };
}
