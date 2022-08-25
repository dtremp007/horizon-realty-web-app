import "../styles/style.scss";
import { MantineProvider } from "@mantine/core";
import MainLayout from "../src/layouts/MainLayout";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import AdminLayout from "../src/layouts/AdminLayout";
import { AuthUserProvider } from "../src/context/authUserContext";

//TODO: make router path a global property
function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  if (RegExp(/^\/admin.*/).test(router.pathname)) {
    return (
      <MantineProvider theme={{ colorScheme: "dark" }}>
        <AuthUserProvider>
          <AdminLayout>
            <Component {...pageProps} />
          </AdminLayout>
        </AuthUserProvider>
      </MantineProvider>
    );
  }

  return (
    <MantineProvider theme={{ colorScheme: "dark" }}>
      <AuthUserProvider>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </AuthUserProvider>
    </MantineProvider>
  );
}

export default MyApp;
