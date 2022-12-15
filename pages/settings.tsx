import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import router from "next/router";

import DefaultIcon from "components/DefaultIcon";
import Layout from "components/Layout";

import { userSettingsSchema, UserSettings } from "utils/validations";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import { getBase64 } from "utils/getBase64";
import { trpc } from "utils/trpc";
import SettingsForm from "components/settingsForm";

export default function Settings() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push("/");
    },
  });

  const { mutate: updateSettings } = trpc.auth.updateSettings.useMutation({
    onSuccess() {
      toast(`Settings updated successfully! Relog to see changes`, {
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

  const onSubmit = useCallback(
    async (data: UserSettings) => {
      let avatar = null;
      if (data.avatar[0]) avatar = await getBase64(data.avatar[0]);
      updateSettings({ ...data, avatar });
    },
    [updateSettings]
  );

  const { mutate: deleteAccount } = trpc.auth.deleteAccount.useMutation({
    onSuccess() {
      toast(`Account deleted successfully`, {
        type: "success",
      });
      signOut();
    },
    onError(error) {
      toast(error.message, {
        type: "error",
      });
    },
  });

  return (
    <Layout>
      <div className="w-4/5 min-h-[80vh] items-center justify-center flex mb-4  border-t border-gray-200 shadow-xl rounded-3xl p-6 bg-white max-sm:p-3 max-sm:w-11/12 ">
        <div className="container mx-auto">
          <div className="w-full max-w-2xl p-6 mx-auto inputs">
            <h2 className="text-2xl text-gray-900">Account Settings</h2>
            <SettingsForm
              handleDeleteAccount={() => deleteAccount()}
              onSubmit={onSubmit}
              session={session}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
