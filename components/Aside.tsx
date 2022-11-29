import Head from "next/head";
import Layout from "components/Layout";
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
      className="sticky z-50 h-screen top-0 left-0 mt-16 flex lg:flex flex-shrink-0 flex-col w-64 transition-width duration-75"
      aria-label="Sidebar"
    >
      <div className="relative flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white pt-0">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex-1 px-3 bg-white divide-y space-y-1">
            <ul className="space-y-2 pb-2">
              <li>
                <Link
                  href="/admin"
                  className="text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group"
                >
                  <FontAwesomeIcon
                    icon={faHome}
                    className="w-6 h-6 text-gray-500 group-hover:text-gray-900 transition duration-75"
                  />
                  <span className="ml-3">Home</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/quizzes"
                  className="text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group"
                >
                  <FontAwesomeIcon
                    icon={faQuestion}
                    className="w-6 h-6 text-gray-500 group-hover:text-gray-900 transition duration-75"
                  />
                  <span className="ml-3">Quizzes</span>
                </Link>
              </li>
            </ul>
            <div className="space-y-2 pt-2">
              <Link
                href="/admin"
                className="text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 group transition duration-75 flex items-center p-2"
              >
                <FontAwesomeIcon
                  icon={faBookOpen}
                  className="w-6 h-6 text-gray-500 flex-shrink-0 group-hover:text-gray-900 transition duration-75"
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
