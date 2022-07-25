import "styles/globals.css";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "../lib/apollo";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import "moment/locale/ru";
import moment from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store } from "store/store";
import { persistStore } from "redux-persist";
moment.updateLocale("ru", null);

function MyApp({ Component, pageProps }: AppProps) {
  const persistor = persistStore(store);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <ApolloProvider client={apolloClient}>
            <Component {...pageProps} />
          </ApolloProvider>
        </LocalizationProvider>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
