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
import Layout from "./Layout";
import DefaultIcon from "./DefaultIcon";

export default function Header() {
  const { data: session, status } = useSession();
  if (status === "loading")
    return (
      <div className="fixed top-0 z-40 w-screen px-6 py-3 bg-white border shadow-md">
        <div className="flex justify-between">
          <Link href="/" className="flex items-center relative z-[99]">
            <Image
              src={logoIcon}
              className="w-10 h-10 text-gray-500"
              alt="Interview PlayBook"
              width={40}
              height={40}
              priority
            />
            <span className="ml-2 font-semibold text-[#252C32] max-md:hidden">
              Interview PlayBook
            </span>
          </Link>
          <div className="flex items-center justify-center gap-4 ml-2 max-sm:gap-1">
            <div className="flex items-center justify-center px-2 py-2 rounded-md gap-x-1">
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
              className="flex items-center px-4 py-2 ml-2 border rounded-md gap-x-1"
            />

            <Skeleton
              count={1}
              width={90}
              className="flex items-center px-4 py-2 ml-2 border rounded-md gap-x-1"
            />
          </div>
        </div>
      </div>
    );

  if (status === "unauthenticated")
    return (
      <div className="fixed top-0 z-50 w-screen px-6 py-3 bg-white border shadow-md">
        <div className="flex justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src={logoIcon}
              className="w-10 h-10 text-gray-500"
              alt=""
              width={40}
              height={40}
              priority
            />
            <span className="ml-2 font-semibold text-[#252C32] max-md:hidden">
              Interview PlayBook
            </span>
          </Link>
          <div className="flex items-center justify-center gap-4 ml-2 max-sm:gap-1">
            <HeaderLink href="/" title="Quizzes" icon={faPlay} />
            <>
              <Link
                href="/auth/signin"
                className="flex items-center px-4 py-2 ml-2 border rounded-md cursor-pointer gap-x-1 hover:bg-gray-100"
              >
                <span className="text-sm font-medium">Sign in</span>
              </Link>
              <Link
                href="/auth/signup"
                className="flex items-center px-4 py-2 ml-2 border rounded-md cursor-pointer gap-x-1 hover:bg-gray-100"
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
      <div className="fixed top-0 z-50 w-screen px-6 py-3 bg-white border shadow-md">
        <div className="flex justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src={logoIcon}
              className="w-10 h-10 text-gray-500"
              alt=""
              width={40}
              height={40}
              priority
            />
            <span className="ml-2 font-semibold text-[#252C32] max-md:hidden">
              Interview PlayBook
            </span>
          </Link>
          <div className="flex items-center justify-center gap-4 ml-2 max-sm:gap-1">
            <HeaderLink href="/" title="Quizzes" icon={faPlay} />
            <HeaderLink href="/settings" title="Settings" icon={faCog} />

            {session.user.role === "admin" && (
              <HeaderLink href="/admin" title="Admin" icon={faShield} />
            )}
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt="Your profile icon"
                className="h-8 rounded-full shadow-lg ring-1"
                width={32}
                height={32}
              />
            ) : (
              <DefaultIcon height={32} width={32} />
            )}

            <span
              className="text-sm font-medium max-sm:hidden h-fit overflow-ellipsis max-w-[12ch] whitespace-nowrap overflow-hidden"
              title={session.user.name!}
            >
              {session.user.role === "admin" && (
                <span className="mr-2 text-xs text-red-400 border border-red-400 border-solid">
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
              className="flex items-center px-4 py-2 ml-2 border rounded-md cursor-pointer gap-x-1 hover:bg-gray-100"
            >
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  return (
    <Layout>
      <h1>Something went wrong, please refresh the page</h1>
    </Layout>
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
      <div className="flex items-center px-2 py-2 rounded-md cursor-pointer gap-x-1 hover:bg-gray-100">
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
