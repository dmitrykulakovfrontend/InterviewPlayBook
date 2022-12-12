import Image from "next/image";
export default function QuizzComment() {
  return (
    <div className="max-w-xl px-10 py-5 mx-auto mt-4 transition duration-500 bg-white border rounded-2xl hover:shadow-xl">
      <div className="flex items-center gap-4">
        <Image
          className="w-12 h-12 rounded-full"
          src="https://res.cloudinary.com/dygvw4rwl/image/upload/v1670585223/IPB/QuizIcons/kzqhq6f4rq3gwx5tfbwd.png"
          alt=""
          height="48"
          width="48"
        />
        <div className="text-sm font-semibold">
          John Lucas • <span className="font-normal"> 5 minutes ago</span>
        </div>
      </div>
      <p className="mt-4 text-gray-600 text-md">
        But I must explain to you how all this mistaken idea of denouncing
        pleasure and praising pain was born and I will give you a complete
        account of the system, and expound the actual teachings of the great
        explorer of the truth, the master-builder of human happines.
      </p>
    </div>
  );
}
