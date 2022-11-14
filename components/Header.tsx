import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import logoIcon from "public/icons/interview-svgrepo-com.svg";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faPlay, faShield } from "@fortawesome/free-solid-svg-icons";
import Spinner from "./Spinner";
import router from "next/router";
import Skeleton from "react-loading-skeleton";

export default function Header() {
  const { data: session, status } = useSession();
  console.log(session);

  if (status === "loading")
    return (
      <div className="bg-white w-screen shadow-md sticky z-50 top-0 border py-3 px-6">
        <div className="flex justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src={logoIcon}
              className="h-10 w-10 text-gray-500"
              alt="Interview PlayBook"
              width={40}
              height={40}
              priority
            />
            <span className="ml-2 font-semibold text-[#252C32] max-md:hidden">
              Interview PlayBook
            </span>
          </Link>
          <div className="ml-2 flex items-center justify-center gap-4 max-sm:gap-1">
            <div className="flex items-center justify-center gap-x-1 rounded-md py-2 px-2">
              <Skeleton circle width={25} height={25} />
              <Skeleton
                count={1}
                width={50}
                containerClassName="max-sm:hidden"
              />
            </div>

            <Skeleton
              count={1}
              width={90}
              className="ml-2 flex items-center gap-x-1 rounded-md border py-2 px-4"
            />

            <Skeleton
              count={1}
              width={90}
              className="ml-2 flex items-center gap-x-1 rounded-md border py-2 px-4"
            />
          </div>
        </div>
      </div>
    );

  if (status === "unauthenticated")
    return (
      <div className="bg-white w-screen shadow-md sticky z-50 top-0 border py-3 px-6">
        <div className="flex justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src={logoIcon}
              className="h-10 w-10 text-gray-500"
              alt=""
              width={40}
              height={40}
              priority
            />
            <span className="ml-2 font-semibold text-[#252C32] max-md:hidden">
              Interview PlayBook
            </span>
          </Link>
          <div className="ml-2 flex items-center justify-center gap-4 max-sm:gap-1">
            <HeaderLink href="/quizzes" title="Quizzes" icon={faPlay} />
            <>
              <Link
                href="/auth/signin"
                className="ml-2 flex cursor-pointer items-center gap-x-1 rounded-md border py-2 px-4 hover:bg-gray-100"
              >
                <span className="text-sm font-medium">Sign in</span>
              </Link>
              <Link
                href="/auth/signup"
                className="ml-2 flex cursor-pointer items-center gap-x-1 rounded-md border py-2 px-4 hover:bg-gray-100"
              >
                <span className="text-sm font-medium">Sign Up</span>
              </Link>
            </>
          </div>
        </div>
      </div>
    );

  if (status === "authenticated")
    return (
      <div className="bg-white w-screen shadow-md sticky z-50 top-0 border py-3 px-6">
        <div className="flex justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src={logoIcon}
              className="h-10 w-10 text-gray-500"
              alt=""
              width={40}
              height={40}
              priority
            />
            <span className="ml-2 font-semibold text-[#252C32] max-md:hidden">
              Interview PlayBook
            </span>
          </Link>
          <div className="ml-2 flex items-center justify-center gap-4 max-sm:gap-1">
            <HeaderLink href="/quizzes" title="Quizzes" icon={faPlay} />
            <HeaderLink href="/settings" title="Settings" icon={faCog} />

            {session.user.role === "admin" && (
              <HeaderLink href="/admin" title="Admin" icon={faShield} />
            )}
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt="Your profile icon"
                className="h-8 shadow-lg ring-1 rounded-full"
                width={32}
                height={32}
              />
            ) : (
              <div className="h-8 w-8 bg-[url('../public/blank-profile-picture.png')] bg-no-repeat bg-center bg-cover bg-white  shadow-lg ring-black ring-1 rounded-full" />
            )}

            <span
              className="text-sm font-medium max-sm:hidden h-fit overflow-ellipsis max-w-[12ch] whitespace-nowrap overflow-hidden"
              title={session.user.name!}
            >
              {session.user.role === "admin" && (
                <span className="text-xs text-red-400 border-solid border border-red-400  mr-2">
                  Admin{" "}
                </span>
              )}
              {session.user.name}
            </span>

            <button
              onClick={() => {
                signOut({ redirect: false });
                router.push("/");
              }}
              className="ml-2 flex cursor-pointer items-center gap-x-1 rounded-md border py-2 px-4 hover:bg-gray-100"
            >
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    );
}

type HeaderLinkProps = {
  title: string;
  icon: IconProp;
  href: string;
};

const HeaderLink = ({ title, icon, href }: HeaderLinkProps) => {
  return (
    <Link href={href}>
      <div className="flex cursor-pointer items-center gap-x-1 rounded-md py-2 px-2  hover:bg-gray-100">
        <FontAwesomeIcon
          icon={icon}
          className="text-xl text-gray-500 fill-white"
        />
        <span className="text-sm font-medium max-sm:hidden" title={title}>
          {title}
        </span>
      </div>
    </Link>
  );
};
