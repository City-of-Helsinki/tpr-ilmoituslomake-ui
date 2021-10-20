import React, { ReactElement } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useI18n } from "next-localization";
import { Koros } from "hds-react";
import { initStore } from "../../state/store";
import { CLEAR_STATE } from "../../types/constants";
// import i18nLoader from "../../utils/i18n";
import { checkUser, redirectToEnglish, redirectToLogin, redirectToNotAuthorized } from "../../utils/serverside";
import Layout from "../../components/common/Layout";
import Header from "../../components/common/Header";
import styles from "./index.module.scss";

const Translation = (): ReactElement => {
  const i18n = useI18n();

  return (
    <Layout>
      <Head>
        <title>{i18n.t("translation.title.request")}</title>
      </Head>
      <Header includeLanguageSelector={false} homePagePath="/translation/request" />
      <main id="content" className={styles.content}>
        <div className={styles.korosTextBox}>
          <h1>{i18n.t("common.redirecting")}</h1>
        </div>
        <Koros className={styles.koros} type="basic" flipHorizontal />
      </main>
    </Layout>
  );
};

// Server-side rendering
export const getServerSideProps: GetServerSideProps = async ({ req, resolvedUrl }) => {
  // const lngDict = await i18nLoader(locales, false, true);

  const reduxStore = initStore();
  reduxStore.dispatch({ type: CLEAR_STATE });
  const initialReduxState = reduxStore.getState();

  const user = await checkUser(req);
  if (!user) {
    // Invalid user but login is required, so redirect to login
    return redirectToLogin(resolvedUrl);
  }
  if (user && !user.is_translator) {
    // Valid user but translator login is required, so redirect to not authorized page
    return redirectToNotAuthorized();
  }
  if (user && user.authenticated) {
    initialReduxState.general.user = user;
  }

  // Redirect to the translation request page, and force the app to use English
  return redirectToEnglish("/translation/request/");

  /*
  return {
    props: {
      initialReduxState,
      lngDict,
    },
  };
  */
};

export default Translation;
