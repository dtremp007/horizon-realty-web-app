import "../styles/style.scss";
import { MantineProvider } from "@mantine/core";
import MainLayout from "../src/layouts/MainLayout";
import type { AppProps } from "next/app";

//TODO: make router path a global property
function MyApp({ Component, pageProps }: AppProps) {
  process.on("warning", (e) => console.warn(e.stack));

  return (
    <MantineProvider theme={{ colorScheme: "dark" }}>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
    </MantineProvider>
  );
}

export default MyApp;
