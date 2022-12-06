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
          <main className="flex flex-col items-center justify-center flex-1 gap-4 mt-16">
            {children}
          </main>
        </div>
      </div>
    );
  return (
    <div className="h-screen">
      <Header />

      <main className="flex flex-col items-center justify-center gap-4 mt-16">
        {children}
      </main>
    </div>
  );
}
