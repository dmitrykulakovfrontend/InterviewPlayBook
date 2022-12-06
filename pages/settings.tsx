import { zodResolver } from "@hookform/resolvers/zod";
import Layout from "components/Layout";
import { useSession } from "next-auth/react";
import Image from "next/image";
import router from "next/router";
import { useForm } from "react-hook-form";
import { userSettingsSchema, userSettings } from "utils/validations";

export default function Settings() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push("/");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSettingsSchema),
  });

  const onSubmit = async (data: any) => {
    console.log(data);
  };

  return (
    <Layout>
      <div className="w-4/5 min-h-[80vh] items-center justify-center flex mb-4  border-t border-gray-200 shadow-xl rounded-3xl p-6 bg-white max-sm:p-3 max-sm:w-11/12 ">
        <div className="container mx-auto">
          <div className="w-full max-w-2xl p-6 mx-auto inputs">
            <h2 className="text-2xl text-gray-900">Account Settings</h2>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-wrap pt-4 mt-6 mb-6 -mx-3 border-t border-gray-400"
            >
              <label className="flex flex-col w-full gap-2 px-3 mb-6 text-xs font-bold tracking-wide text-gray-700 uppercase md:w-full">
                Email
                <input
                  className="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-100 border border-gray-400 rounded-md shadow-inner appearance-none focus:outline-none focus:border-gray-500"
                  type="text"
                  placeholder="Enter email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500">
                    {errors.email.message as string}
                  </p>
                )}
              </label>
              <label className="flex flex-col w-full gap-2 px-3 mb-6 text-xs font-bold tracking-wide text-gray-700 uppercase md:w-full">
                Current Password
                <input
                  className="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-100 border border-gray-400 rounded-md shadow-inner appearance-none focus:outline-none focus:border-gray-500"
                  type="text"
                  placeholder="Enter new password"
                  {...register("currentPassword")}
                />
                {errors.currentPassword && (
                  <p className="text-red-500">
                    {errors.currentPassword.message as string}
                  </p>
                )}
              </label>
              <label className="flex flex-col w-full gap-2 px-3 mb-6 text-xs font-bold tracking-wide text-gray-700 uppercase md:w-full">
                New password
                <input
                  className="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-100 border border-gray-400 rounded-md shadow-inner appearance-none focus:outline-none focus:border-gray-500"
                  type="text"
                  placeholder="Enter new password"
                  {...register("newPassword")}
                />
                {errors.newPassword && (
                  <p className="text-red-500">
                    {errors.newPassword.message as string}
                  </p>
                )}
              </label>
              <div className="flex flex-col items-end w-full pt-4 border-t border-gray-400 personal">
                <div className="flex flex-col items-center justify-center m-auto">
                  <Image
                    className="object-cover object-center w-20 h-20 mt-5 rounded-full shrink-0"
                    src="https://res.cloudinary.com/dygvw4rwl/image/upload/v1668246339/cld-sample.jpg"
                    alt="Current profile photo"
                    width={80}
                    height={80}
                  />
                  <label className="block pt-2">
                    <span className="sr-only">Choose profile photo</span>
                    <input
                      type="file"
                      {...register("avatar")}
                      className="text-sm cursor-pointer text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full w-fit file:border-0 file:text-sm file:font-semibold file:cursor-pointer file:bg-gray-100 file:text-zinc-900 hover:file:bg-rose-300"
                    />
                    {errors.avatar && (
                      <p className="text-red-500">
                        {errors.avatar.message as string}
                      </p>
                    )}
                  </label>
                </div>
                <label className="block w-full gap-2 px-3 mb-6 text-xs font-bold tracking-wide text-gray-700 uppercase md:w-full">
                  User name
                  <input
                    {...register("name")}
                    className="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-100 border border-gray-400 rounded-md shadow-inner appearance-none focus:outline-none focus:border-gray-500"
                    type="text"
                  />
                  {errors.name && (
                    <p className="text-red-500">
                      {errors.name.message as string}
                    </p>
                  )}
                </label>
                <button
                  className="px-2 py-1 ml-auto text-gray-900 bg-gray-200 border border-gray-400 rounded-md shadow-sm appearance-none"
                  type="submit"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
