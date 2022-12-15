import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSettings, userSettingsSchema } from "utils/validations";
import { Session } from "next-auth";
import Skeleton from "react-loading-skeleton";
import Image from "next/image";
import DefaultIcon from "./DefaultIcon";
import { useState } from "react";

type SettingsFormProps = {
  onSubmit: (data: UserSettings) => void;
  isLoading?: boolean;
  session: Session | null;
  handleDeleteAccount: () => void;
};

export default function SettingsForm({
  onSubmit,
  session,
  handleDeleteAccount,
}: SettingsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserSettings>({
    resolver: zodResolver(userSettingsSchema),
  });

  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-wrap pt-4 mt-6 mb-6 -mx-3 border-t border-gray-400"
    >
      <label className="flex flex-col w-full gap-2 px-3 mb-6 text-xs font-bold tracking-wide text-gray-700 uppercase md:w-full">
        Email
        {session?.user.email ? (
          <input
            className="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-100 border border-gray-400 rounded-md shadow-inner appearance-none focus:outline-none focus:border-gray-500"
            type="text"
            defaultValue={session?.user.email}
            placeholder="Enter email"
            {...register("email")}
          />
        ) : (
          <Skeleton />
        )}
        {errors.email && (
          <p className="text-red-500">{errors.email.message as string}</p>
        )}
      </label>
      <label className="flex flex-col w-full gap-2 px-3 mb-6 text-xs font-bold tracking-wide text-gray-700 uppercase md:w-full">
        Current Password
        <input
          className="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-100 border border-gray-400 rounded-md shadow-inner appearance-none focus:outline-none focus:border-gray-500"
          type="password"
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
          type="password"
          placeholder="Enter new password"
          {...register("newPassword")}
        />
        {errors.newPassword && (
          <p className="text-red-500">{errors.newPassword.message as string}</p>
        )}
      </label>
      <div className="flex flex-col items-end w-full pt-4 border-t border-gray-400 personal">
        <div className="flex flex-col items-center justify-center m-auto">
          {session?.user.image ? (
            <Image
              className="object-cover object-center w-20 h-20 mt-5 rounded-full shrink-0"
              src={session.user.image}
              alt="Current profile photo"
              width={80}
              height={80}
            />
          ) : (
            <DefaultIcon height={32} width={32} />
          )}

          <label className="block pt-2">
            <span className="sr-only">Choose profile photo</span>
            <input
              type="file"
              accept="image/*"
              {...register("avatar")}
              className="text-sm cursor-pointer text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full w-fit file:border-0 file:text-sm file:font-semibold file:cursor-pointer file:bg-gray-100 file:text-zinc-900 hover:file:bg-rose-300"
            />
            {errors.avatar && (
              <p className="text-red-500">{errors.avatar.message as string}</p>
            )}
          </label>
        </div>
        <label className="block w-full gap-2 px-3 mb-6 text-xs font-bold tracking-wide text-gray-700 uppercase md:w-full">
          User name
          {session?.user.name ? (
            <input
              {...register("name")}
              defaultValue={session.user.name}
              className="block w-full px-4 py-3 leading-tight text-gray-700 bg-gray-100 border border-gray-400 rounded-md shadow-inner appearance-none focus:outline-none focus:border-gray-500"
              type="text"
            />
          ) : (
            <Skeleton />
          )}
          {errors.name && (
            <p className="text-red-500">{errors.name.message as string}</p>
          )}
        </label>
        <div className="flex justify-between w-full">
          {isDeletingAccount ? (
            <button
              className="px-2 py-1 text-red-400 border-gray-400 rounded-md appearance-none hover:bg-gray-100 hover:shadow-lg"
              type="button"
              onClick={handleDeleteAccount}
            >
              Are you sure? Click again to confirm
            </button>
          ) : (
            <button
              className="px-2 py-1 text-red-400 border-gray-400 rounded-md appearance-none hover:bg-gray-100 hover:shadow-lg"
              type="button"
              onClick={() => setIsDeletingAccount(true)}
            >
              Delete account
            </button>
          )}
          <button
            className="px-2 py-1 text-gray-900 bg-gray-200 border border-gray-400 rounded-md shadow-sm appearance-none"
            type="submit"
          >
            Save changes
          </button>
        </div>
      </div>
    </form>
  );
}
