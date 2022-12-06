import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faHome,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";

export default function Aside() {
  return (
    <aside
      id="sidebar"
      className="sticky top-0 left-0 z-50 flex flex-col flex-shrink-0 w-64 h-screen mt-16 duration-75 lg:flex transition-width"
      aria-label="Sidebar"
    >
      <div className="relative flex flex-col flex-1 min-h-0 pt-0 bg-white border-r border-gray-200">
        <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
          <div className="flex-1 px-3 space-y-1 bg-white divide-y">
            <ul className="pb-2 space-y-2">
              <li>
                <Link
                  href="/admin"
                  className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 group"
                >
                  <FontAwesomeIcon
                    icon={faHome}
                    className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900"
                  />
                  <span className="ml-3">Home</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/quizzes"
                  className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 group"
                >
                  <FontAwesomeIcon
                    icon={faQuestion}
                    className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900"
                  />
                  <span className="ml-3">Quizzes</span>
                </Link>
              </li>
            </ul>
            <div className="pt-2 space-y-2">
              <Link
                href="/admin"
                className="flex items-center p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 group"
              >
                <FontAwesomeIcon
                  icon={faBookOpen}
                  className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900"
                />

                <span className="ml-3">Documentation (WIP)</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
