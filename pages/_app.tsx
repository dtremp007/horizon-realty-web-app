import "../styles/style.scss";
import { MantineProvider } from "@mantine/core";
import MainLayout from "../src/layouts/MainLayout";
import type { AppProps } from "next/app";

//TODO: make router path a global property
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={{colorScheme: "dark"}}>xxx
      <MainLayout>
          <Component {...pageProps} />
      </MainLayout>
    </MantineProvider>
  );
}

export default MyApp;
