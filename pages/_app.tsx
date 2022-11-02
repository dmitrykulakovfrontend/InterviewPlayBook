import "../styles/globals.css";
import type { AppProps } from "next/app";
import { trpc } from "utils/trpc";

function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Component {...pageProps} />
    </div>
  );
}
export default trpc.withTRPC(App);
