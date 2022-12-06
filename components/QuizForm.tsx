import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Quiz, quizSchema } from "utils/validations";
import { faNoteSticky, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Form from "./Form";
import Input from "./Input";

type QuizFormProps = {
  onSubmit: (data: Quiz) => void;
  isLoading?: boolean;
  defaultValues?: Quiz;
  buttonText: string;
};

export default function QuizForm({
  onSubmit,
  defaultValues,
  isLoading,
  buttonText,
}: QuizFormProps) {
  defaultValues = defaultValues || {
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
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<Quiz>({
    resolver: zodResolver(quizSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  return (
    <Form
      className="w-2/3 m-auto border"
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
          <div className="flex flex-col w-full gap-4" key={item.id}>
            <div className="flex items-center justify-end w-full gap-4 mb-1">
              <h3>Question {index + 1}</h3>
              <button
                className="inline-block px-3 py-2 text-sm font-semibold text-center text-white transition duration-200 bg-red-500 rounded-lg shadow-sm  w-fit hover:bg-red-600 focus:bg-red-700 focus:shadow-sm focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 hover:shadow-md"
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
              error={errors.questions && errors.questions[index]?.text?.message}
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
                  errors.questions && errors.questions[index]?.choices?.message
                }
              />
            ))}
          </div>
        );
      })}
      <div className="flex justify-around gap-4">
        {isLoading ? (
          <button className="inline-block px-5 py-3 text-sm font-semibold text-center text-white transition duration-200 bg-blue-500 rounded-lg shadow-sm w-fit hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 hover:shadow-md">
            Loading...
          </button>
        ) : (
          <>
            <button
              type="submit"
              className="inline-block px-5 py-3 text-sm font-semibold text-center text-white transition duration-200 bg-blue-500 rounded-lg shadow-sm w-fit hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 hover:shadow-md"
            >
              <span className="inline-block mr-2">{buttonText}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                append({ text: "", answer: "", choices: ["", "", "", ""] });
              }}
              className="inline-block px-5 py-3 text-sm font-semibold text-center text-white transition duration-200 bg-blue-500 rounded-lg shadow-sm w-fit hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 hover:shadow-md"
            >
              <span className="inline-block mr-2">Add Question</span>
            </button>
          </>
        )}
      </div>
    </Form>
  );
}
