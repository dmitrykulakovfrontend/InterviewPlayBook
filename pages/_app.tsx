import "../styles/globals.css";
import type { AppProps } from "next/app";
import { trpc } from "utils/trpc";
import { SessionProvider } from "next-auth/react";

function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <SessionProvider>
        <Component {...pageProps} />
      </SessionProvider>
    </div>
  );
}
export default trpc.withTRPC(App);
