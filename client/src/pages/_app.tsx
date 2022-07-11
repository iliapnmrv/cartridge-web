import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "../lib/apollo";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import "moment/locale/ru";
import moment from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers";
moment.updateLocale("ru", null);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
      </ApolloProvider>
    </LocalizationProvider>
  );
}

export default MyApp;
