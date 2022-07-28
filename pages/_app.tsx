import "../styles/style.scss";
import { MantineProvider } from "@mantine/core";
import MainLayout from "../src/layouts/MainLayout";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={{colorScheme: "dark"}}>
      <MainLayout>
          <Component {...pageProps} />
      </MainLayout>
    </MantineProvider>
  );
}

export default MyApp;
