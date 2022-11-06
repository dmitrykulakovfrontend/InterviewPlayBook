import "../styles/globals.css";
import type { AppProps } from "next/app";
import { trpc } from "utils/trpc";
import { SessionProvider } from "next-auth/react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
config.autoAddCss = false;

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ToastContainer position={"top-center"} />
        <Component {...pageProps} />
      </QueryClientProvider>
    </SessionProvider>
  );
}
export default trpc.withTRPC(App);
