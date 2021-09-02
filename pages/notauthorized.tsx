import React, { ReactElement } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useI18n } from "next-localization";
import { Koros } from "hds-react";
import { initStore } from "../state/store";
import { CLEAR_STATE } from "../types/constants";
import i18nLoader from "../utils/i18n";
import { checkUser } from "../utils/serverside";
import Layout from "../components/common/Layout";
import Header from "../components/common/Header";
import styles from "./notauthorized.module.scss";

const Main = (): ReactElement => {
  const i18n = useI18n();

  return (
    <Layout>
      <Head>
        <title>{i18n.t("notification.title.notauthorized")}</title>
      </Head>
      <Header />
      <main id="content" className={styles.content}>
        <div className={styles.korosTextBox}>
          <h1>{i18n.t("common.notAuthorized")}</h1>
        </div>
        <Koros className={styles.koros} type="basic" flipHorizontal />
      </main>
    </Layout>
  );
};

// Server-side rendering
export const getServerSideProps: GetServerSideProps = async ({ req, locales }) => {
  const lngDict = await i18nLoader(locales);

  const reduxStore = initStore();
  reduxStore.dispatch({ type: CLEAR_STATE });
  const initialReduxState = reduxStore.getState();

  const user = await checkUser(req);
  if (!user) {
    // Invalid user but login is not required
  }
  if (user && user.authenticated) {
    initialReduxState.general.user = user;
  }

  return {
    props: {
      initialReduxState,
      lngDict,
    },
  };
};

export default Main;
