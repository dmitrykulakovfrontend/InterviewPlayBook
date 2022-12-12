import Image from "next/image";
import Link from "next/link";

type QuizCardProps = {
  title: string;
  description: string;
  src: string;
  href: string;
};

export default function QuizCard({
  title,
  description,
  src,
  href,
}: QuizCardProps) {
  return (
    <div className="max-w-md flex-1 basis-72 min-h-[300px] flex flex-col justify-between relative py-4 px-8 bg-white shadow-lg rounded-lg">
      <div className="absolute right-0 -top-5">
        <Image
          className="object-cover w-20 h-20 border-2 border-indigo-500 rounded-full"
          src={src}
          alt="Quiz icon"
          width={80}
          height={80}
        />
      </div>
      <div className="w-10/12">
        <h2 className="text-3xl font-semibold text-gray-800">{title}</h2>
        <p className="mt-2 text-gray-600">{description}</p>
      </div>
      <div className="flex items-center justify-between mt-4 max-lg:flex-col">
        <Link
          href={href}
          className="px-4 py-2 text-xl font-medium text-indigo-500 border rounded-md w-fit hover:bg-gray-100"
        >
          Open
        </Link>
      </div>
    </div>
  );
}
