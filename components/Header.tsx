import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import logoIcon from "public/icons/interview-svgrepo-com.svg";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faPlay, faQuestion } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const { data: session, status } = useSession();
  console.log(session);
  return (
    <div className="bg-white w-screen shadow-md sticky top-0 border py-3 px-6">
      <div className="flex justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src={logoIcon}
            className="h-10 w-10 text-gray-500"
            alt=""
            width={40}
            height={40}
          />
          <span className="ml-2 font-semibold text-[#252C32] max-md:hidden">
            Interview PlayBook
          </span>
        </Link>

        <div className="ml-2 flex items-center justify-center gap-4 max-sm:gap-1">
          <HeaderLink href="/quizzes" title="Quizzes" icon={faPlay} />
          <HeaderLink href="/settings" title="Settings" icon={faCog} />
          {session ? (
            <>
              {session.user?.image ? (
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
                title={session.user?.name!}
              >
                {session.user?.name}
              </span>

              <button
                onClick={() => signOut()}
                className="ml-2 flex cursor-pointer items-center gap-x-1 rounded-md border py-2 px-4 hover:bg-gray-100"
              >
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </>
          ) : (
            <Link
              href="/auth/signin"
              className="ml-2 flex cursor-pointer items-center gap-x-1 rounded-md border py-2 px-4 hover:bg-gray-100"
            >
              <span className="text-sm font-medium">Sign in</span>
            </Link>
          )}
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
