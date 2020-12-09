import React, { ReactElement } from "react";
import { Provider } from "react-redux";
import { AppProps } from "next/app";
import { I18nProvider } from "next-localization";
import { useRouter } from "next/router";
import { defaultLocale } from "../utils/i18n";
import { useStore } from "../state/store";
import "../styles/global.scss";

const App = ({ Component, pageProps }: AppProps): ReactElement => {
  const router = useRouter();
  const { lngDict, initialReduxState, ...rest } = pageProps;
  const locale = router.locale || router.defaultLocale || defaultLocale;

  const store = useStore(initialReduxState);

  return (
    <I18nProvider lngDict={lngDict} locale={locale}>
      <Provider store={store}>
        <Component {...rest} />
      </Provider>
    </I18nProvider>
  );
};

export default App;
