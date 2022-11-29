import Header from "components/Header";
import type { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import Aside from "./Aside";

type LayoutProps = {
  children: ReactNode;
  aside?: boolean;
};

export default function Layout({ children, aside }: LayoutProps) {
  if (aside)
    return (
      <div className="h-screen">
        <Header />

        <div className="flex">
          <Aside />
          <main className="flex flex-1 flex-col justify-center mt-16 gap-4 items-center">
            {children}
          </main>
        </div>
      </div>
    );
  return (
    <div className="h-screen">
      <Header />

      <main className="flex flex-col justify-center mt-16 gap-4 items-center">
        {children}
      </main>
    </div>
  );
}
