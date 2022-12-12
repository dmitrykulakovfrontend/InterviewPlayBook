import { Comment } from "@prisma/client";
import Image from "next/image";
type QuizzCommentProps = {
  comment: Comment;
};
export default function QuizzComment({ comment }: QuizzCommentProps) {
  return (
    <div className="max-w-xl px-10 py-5 mx-auto mt-4 transition duration-500 bg-white border rounded-2xl hover:shadow-xl">
      <div className="flex items-center gap-4">
        <Image
          className="w-12 h-12 rounded-full"
          src={comment.authorAvatar}
          alt=""
          height="48"
          width="48"
        />
        <div className="text-sm font-semibold">
          {comment.author} •{" "}
          <span className="font-normal">
            {`${new Date(comment.createdAt).toDateString()} `}
          </span>
        </div>
      </div>
      <p className="mt-4 text-gray-600 text-md">{comment.content}</p>
      <p className="mt-4 text-gray-600 text-md">
        {comment.updatedAt !== comment.createdAt
          ? new Date(comment.updatedAt).toDateString()
          : ""}
      </p>
    </div>
  );
}
