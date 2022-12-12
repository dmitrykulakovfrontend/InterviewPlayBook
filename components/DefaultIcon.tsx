import Image from "next/image";
import img from "/public/blank-profile-picture.png";
type DefaultIconProps = {
  height: number;
  width: number;
};
export default function DefaultIcon({ height, width }: DefaultIconProps) {
  return (
    <Image
      alt="default icon"
      height={height}
      width={width}
      src={img}
      className="bg-white bg-center bg-no-repeat bg-cover rounded-full shadow-lg ring-black ring-1"
    />
  );
}
