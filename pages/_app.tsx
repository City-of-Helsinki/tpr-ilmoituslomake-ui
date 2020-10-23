import React, { ReactElement } from "react";
import { AppProps } from "next/app";
import "../styles/global.scss";

const App = ({ Component, pageProps }: AppProps): ReactElement => {
  return <Component {...pageProps} />;
};

export default App;
