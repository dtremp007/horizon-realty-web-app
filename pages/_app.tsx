import dynamic from "next/dynamic";
import "../styles/style.scss";
import { MantineProvider } from "@mantine/core";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { AuthUserProvider } from "../src/context/authUserContext";
import AltMainLayout from "../src/layouts/AltMainLayout";
import Head from "next/head";
import { getAnalytics, logEvent } from "firebase/analytics";
import { useEffect } from "react";
import { analytics } from "../lib/firebase.config";
import NavTracker from "../src/utils/NavTracker";

const AdminLayout = dynamic(() => import("../src/layouts/AdminLayout"));
export const navTracker = new NavTracker();

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") analytics();
  }, []);

  useEffect(() => {
    const analytics = getAnalytics();

    const logRouteChange = (url: string) => {
      // @ts-ignore
      logEvent(analytics, "screen_view", {
        firebase_screen: url,
      });
    };

    router.events.on("routeChangeComplete", logRouteChange);

    return () => router.events.off("routeChangeComplete", logRouteChange);
  }, []);

  return (
    <MantineProvider
      theme={{
        colorScheme: "dark",
        components: {
            Flex: {
                defaultProps: {
                    gap: 18
                }
            }
        },
        colors: {
          "charcoal-gray": [
            "#f2f2f2",
            "#d9d9d9",
            "#bfbfbf",
            "#a6a6a6",
            "#8c8c8c",
            "#737373",
            "#595959",
            "#404040",
            "#282828",
            "#0d0d0d",
          ],
          gold: [
            "#fcf4e3",
            "#e8dec7",
            "#d6c8a6",
            "#c4b286",
            "#b49c65",
            "#78663a",
            "#574928",
            "#342c15",
            "#AA9053",
            "#140f00",
          ],
        },
      }}
    >
      <AuthUserProvider>
        <DecideLayout>
          <>
            <Head>
              <title>Horizon Real Estate</title>
              <meta
                name="description"
                content="Website designed and developed by David Rempel"
              />
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <Component {...pageProps} />
          </>
        </DecideLayout>
      </AuthUserProvider>
    </MantineProvider>
  );
}

export default MyApp;

type DecideLayoutProps = {
  children: React.ReactNode;
};

const DecideLayout = ({ children }: DecideLayoutProps) => {
  const router = useRouter();

  if (RegExp(/^\/admin.*/).test(router.pathname)) {
    return <AdminLayout>{children}</AdminLayout>;
  }

  return <AltMainLayout>{children}</AltMainLayout>;
};
