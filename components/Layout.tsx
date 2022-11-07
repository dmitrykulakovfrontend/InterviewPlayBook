import Header from "components/Header";
import type { ReactNode } from "react";
import { ToastContainer } from "react-toastify";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="h-screen">
      <Header />
      <main className="flex flex-col justify-center mt-10 gap-4 items-center">
        {children}
      </main>
    </div>
  );
}
