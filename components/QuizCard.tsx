import Image, { StaticImageData } from "next/image";
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
      <div className="absolute -top-5 right-0">
        <Image
          className="w-20 h-20 object-cover rounded-full border-2 border-indigo-500"
          src={src}
          alt="Quiz icon"
          width={80}
          height={80}
        />
      </div>
      <div className="w-10/12">
        <h2 className="text-gray-800 text-3xl font-semibold">{title}</h2>
        <p className="mt-2 text-gray-600">{description}</p>
      </div>
      <div className="flex items-center justify-between mt-4 max-lg:flex-col">
        <Link
          href={href}
          className="text-xl w-fit font-medium text-indigo-500 hover:bg-gray-100  py-2 px-4 rounded-md border"
        >
          Open
        </Link>
      </div>
    </div>
  );
}
