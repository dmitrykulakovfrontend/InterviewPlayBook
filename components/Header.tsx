import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import protectedIcon from "public/icons/protected-user-svgrepo-com.svg";
import publicIcon from "public/icons/answer-public-svgrepo-com.svg";
import logoIcon from "public/icons/interview-svgrepo-com.svg";

export default function Header() {
  const { data: session } = useSession();
  return (
    <div className="bg-white w-screen shadow-md sticky top-0">
      <div className="border py-3 px-6">
        <div className="flex justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src={logoIcon}
              className="h-10 w-10 text-gray-500 max-md:hidden"
              alt=""
              width={40}
              height={40}
            />
            <span className="ml-2 font-semibold text-[#252C32]">
              Interviewistic
            </span>
          </Link>

          <div className="ml-2 flex items-center justify-center gap-4">
            <HeaderLink href="/closed" title="Closed" icon={protectedIcon} />
            <HeaderLink href="/public" title="Public" icon={publicIcon} />

            {session ? (
              <>
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="Your profile icon"
                    className="h-8 max-md:hidden"
                    width={32}
                    height={32}
                  />
                ) : null}

                <span
                  className="text-sm font-medium h-fit overflow-ellipsis max-w-[12ch] whitespace-nowrap overflow-hidden"
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
              <button
                onClick={() => signIn()}
                className="ml-2 flex cursor-pointer items-center gap-x-1 rounded-md border py-2 px-4 hover:bg-gray-100"
              >
                <span className="text-sm font-medium">Sign in</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type HeaderLinkProps = {
  title: string;
  icon: any;
  href: string;
};

const HeaderLink = ({ title, icon, href }: HeaderLinkProps) => {
  return (
    <Link href={href}>
      <div className="flex cursor-pointer items-center gap-x-1 rounded-md py-2 px-2  hover:bg-gray-100">
        <Image
          src={icon}
          className="h-8 w-8 text-gray-500 max-md:hidden"
          alt=""
          width={32}
          height={32}
        />
        <span className="text-sm font-medium">{title}</span>
      </div>
    </Link>
  );
};
