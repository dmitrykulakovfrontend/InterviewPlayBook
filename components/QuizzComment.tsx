import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Comment } from "@prisma/client";
import { Session } from "next-auth";
import Image from "next/image";
import DefaultIcon from "./DefaultIcon";
type QuizzCommentProps = {
  comment: Comment & {
    user: {
      name: string | null;
      image: string | null;
    };
  };
  session: Session | null;
  handleDelete: (id: string) => void;
};
export default function QuizzComment({
  comment,
  session,
  handleDelete,
}: QuizzCommentProps) {
  return (
    <div className="relative max-w-xl px-10 py-5 mx-auto mt-4 transition duration-500 bg-white border rounded-2xl hover:shadow-xl">
      <div className="flex items-center gap-4">
        {comment.user.image ? (
          <Image
            className="w-12 h-12 rounded-full"
            src={comment.user.image}
            alt=""
            height="48"
            width="48"
          />
        ) : (
          <DefaultIcon height={48} width={48} />
        )}

        <div className="text-sm font-semibold">
          {comment.user.name} •{" "}
          <span
            className="font-normal"
            title={`${new Date(comment.createdAt).toTimeString()} `}
          >
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
      {session?.user.name === comment.user.name ? (
        <button
          onClick={() => handleDelete(comment.id)}
          className="absolute text-xl text-red-500 right-4 top-4"
        >
          <FontAwesomeIcon icon={faClose} />
        </button>
      ) : (
        ""
      )}
    </div>
  );
}
