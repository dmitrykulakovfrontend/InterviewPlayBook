import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
type DataBoxProps = {
  icon: IconProp;
  value: string | number;
  valueName: string;
};
export default function DataBox({ icon, value, valueName }: DataBoxProps) {
  return (
    <div className="flex items-center justify-between p-3 font-medium text-white bg-blue-500 border-b-4 border-blue-600 rounded-md shadow-lg basis-48 dark:bg-gray-800 dark:border-gray-600 group">
      <div className="flex items-center justify-center transition-all duration-300 transform bg-white rounded-full w-14 h-14 group-hover:-translate-y-2">
        <FontAwesomeIcon
          icon={icon}
          className="text-blue-800 transition-transform duration-500 ease-in-out transform  dark:text-gray-800"
        />
      </div>
      <div className="ml-5 text-right">
        <p className="text-2xl">{value}</p>
        <p>{valueName}</p>
      </div>
    </div>
  );
}
