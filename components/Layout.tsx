import Header from "components/Header";
import type { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <main className="flex flex-col justify-center gap-4 items-center h-full">
        {children}
      </main>
    </>
  );
}
