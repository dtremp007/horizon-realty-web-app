import "../styles/style.scss";
import { MantineProvider } from "@mantine/core";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import AdminLayout from "../src/layouts/AdminLayout";
import { AuthUserProvider } from "../src/context/authUserContext";
import AltMainLayout from "../src/layouts/AltMainLayout";
import Head from "next/head";

//TODO: make router path a global property
function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <MantineProvider theme={{ colorScheme: "dark" }}>
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
