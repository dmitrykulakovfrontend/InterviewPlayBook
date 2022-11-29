import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
type DataBoxProps = {
  icon: IconProp;
  value: string | number;
  valueName: string;
};
export default function DataBox({ icon, value, valueName }: DataBoxProps) {
  return (
    <div className="bg-blue-500 basis-48 dark:bg-gray-800 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group">
      <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:-translate-y-2">
        <FontAwesomeIcon
          icon={icon}
          className=" text-blue-800 dark:text-gray-800 transform transition-transform duration-500 ease-in-out"
        />
      </div>
      <div className="text-right ml-5">
        <p className="text-2xl">{value}</p>
        <p>{valueName}</p>
      </div>
    </div>
  );
}
