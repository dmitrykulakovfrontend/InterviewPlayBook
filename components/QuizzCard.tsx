import Image, { StaticImageData } from "next/image";
import Link from "next/link";

type QuizzCardProps = {
  title: string;
  description: string;
  src: StaticImageData;
  href: string;
};

export default function QuizzCard({
  title,
  description,
  src,
  href,
}: QuizzCardProps) {
  return (
    <div className="max-w-md flex-1 basis-72 relative py-4 px-8 bg-white shadow-lg rounded-lg">
      <div className="absolute -top-5 right-0">
        <Image
          className="w-20 h-20 object-cover rounded-full border-2 border-indigo-500"
          src={src}
          alt={title}
        />
      </div>
      <div>
        <h2 className="text-gray-800 text-3xl font-semibold">{title}</h2>
        <p className="mt-2 text-gray-600">{description}</p>
      </div>
      <div className="flex justify-between mt-4">
        <Link
          href={href}
          className="text-xl font-medium text-indigo-500 hover:bg-gray-100  py-2 px-4 rounded-md border"
        >
          Open
        </Link>
        <Link
          href="stats"
          className="text-xl font-medium text-indigo-500  py-2 px-4 rounded-md"
        >
          Your result: <span className="text-red-300">50%</span>
        </Link>
      </div>
    </div>
  );
}
