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
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "utils/validations";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";
import { toast } from "react-toastify";

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });
  const router = useRouter();
  const { mutate: SignUpUser, isLoading } = trpc.signUp.useMutation({
    onSuccess(data) {
      toast(`Welcome ${data.result}! Please log in now.`, {
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
          <span className="ml-2 text-3xl font-semibold text-[#252C32]">
            Interview PlayBook
          </span>
        </Link>
        <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
          <form
            onSubmit={handleSubmit((d: any) => SignUpUser(d))}
            className="px-5 py-7"
          >
            <label className="font-semibold text-sm text-gray-600 pb-1 block">
              Name
            </label>
            {errors.name?.message && <p>{errors.name.message.toString()}</p>}
            <input
              {...register("name")}
              className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
            />
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
              <span className="inline-block mr-2">Sign Up</span>
              <FontAwesomeIcon icon={faArrowRightLong} />
            </button>
          </form>
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
