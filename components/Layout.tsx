import Header from "components/Header";
import type { ReactNode } from "react";
import { ToastContainer } from "react-toastify";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Header />
      <main className="flex flex-col justify-center gap-4 h-[calc(100vh_-_80px)] items-center">
        {children}
      </main>
    </div>
  );
}
