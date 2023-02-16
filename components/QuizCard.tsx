import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link, { LinkProps } from "next/link";
import Skeleton from "react-loading-skeleton";
import { Url } from "url";
import DefaultIcon from "./DefaultIcon";

type QuizCardProps = {
  title: string;
  description?: string;
  src?: string;
  href: Partial<Url> | string;
  unoptimized?: boolean;
  likes?: number;
};

export default function QuizCard({
  title,
  description,
  src,
  href,
  unoptimized = false,
  likes,
}: QuizCardProps) {
  return (
    <Link
      href={href}
      className={`relative block overflow-hidden rounded-xl bottom-0  shadow-xl transition-all duration-500 hover:rotate-3 hover:bottom-2 border`}
    >
      {/* {likes && (
        <span className="absolute z-10 inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-white bg-gray-400 rounded-full right-4 top-4">
          {likes}
          <FontAwesomeIcon icon={faHeart} className="text-red-400" />
        </span>
      )} */}

      <div className="relative min-w-[270px] min-h-[265px] p-8 pt-40 text-white bg-black">
        <Image
          width={400}
          height={400}
          src={src ? src : ""}
          className="absolute top-0 left-0 object-cover w-full h-full opacity-60"
          alt="background image"
        ></Image>
        <h3 className="relative z-10 text-2xl font-bold text-center">
          {title}
        </h3>

        <p className="relative z-10 text-sm text-center">{description}</p>
      </div>
    </Link>
  );
}
