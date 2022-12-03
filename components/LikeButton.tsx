import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HTMLProps } from "react";

type LikeButtonProps = {
  isLiked: boolean;
  onClick: () => void;
  amount: number;
};

export default function LikeButton({
  isLiked,
  onClick,
  amount,
}: LikeButtonProps) {
  const className = `text-xl w-fit flex gap-4 justify-center transition-all tran items-center font-medium py-2 px-4 border ${
    isLiked
      ? "text-white bg-red-500 hover:bg-red-600 rounded-full"
      : "text-red-500 bg-white hover:bg-gray-100 rounded-md"
  }`;
  return (
    <button className={className} onClick={onClick}>
      <FontAwesomeIcon icon={faHeart} />
      {amount}
    </button>
  );
}
