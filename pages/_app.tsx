import React, { ReactElement } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { AppProps } from "next/app";
import { I18nProvider } from "next-localization";
import { useRouter } from "next/router";
import { defaultLocale } from "../utils/i18n";
import { useStore } from "../state/store";
import "../styles/global.scss";

const App = ({ Component, pageProps }: AppProps): ReactElement => {
  // This function is called when doing both server-side and client-side rendering
  // The forceLocale value is used by the translation app to force it to use English
  const router = useRouter();
  const { lngDict, forceLocale, initialReduxState, ...rest } = pageProps;
  if (forceLocale) {
    router.locale = forceLocale;
  }
  const locale = router.locale || router.defaultLocale || defaultLocale;

  const store = useStore(initialReduxState);

  // In the notification form, when changing the application language, make sure it is included in the list of input languages
  // Update the store state to preserve any previously selected input languages
  if (store.getState().notification.notificationExtra.inputLanguages.indexOf(locale) < 0) {
    store.getState().notification.notificationExtra.inputLanguages = [...store.getState().notification.notificationExtra.inputLanguages, locale];
  }

  if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
    import("@axe-core/react").then((axe) => {
      axe.default(React, ReactDOM, 1000, {});
    });
  }

  return (
    <I18nProvider lngDict={lngDict ? lngDict[locale] : {}} locale={locale}>
      <Provider store={store}>
        <Component {...rest} />
      </Provider>
    </I18nProvider>
  );
};

export default App;
