import "../styles/globals.css";
import type { AppProps } from "next/app";
import { trpc } from "utils/trpc";
import { SessionProvider } from "next-auth/react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { Analytics } from "@vercel/analytics/react";
config.autoAddCss = false;

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ToastContainer position={"top-center"} autoClose={2000} />
        <Component {...pageProps} />
        <Analytics />
      </QueryClientProvider>
    </SessionProvider>
  );
}
export default trpc.withTRPC(App);
