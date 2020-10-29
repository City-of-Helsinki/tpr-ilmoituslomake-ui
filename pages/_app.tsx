import React, { ReactElement } from "react";
import { Provider } from "react-redux";
import { AppProps } from "next/app";
import { useStore } from "../state/store";
import "../styles/global.scss";

const App = ({ Component, pageProps }: AppProps): ReactElement => {
  const store = useStore(pageProps.initialReduxState);

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default App;
