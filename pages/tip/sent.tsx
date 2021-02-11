import React, { ReactElement } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useI18n } from "next-localization";
import { Button, IconCheckCircleFill } from "hds-react";
import { initStore } from "../../state/store";
import { CLEAR_STATE } from "../../types/constants";
import i18nLoader from "../../utils/i18n";
import { checkUser } from "../../utils/serverside";
import Layout from "../../components/common/Layout";
import Header from "../../components/common/Header";
import Notice from "../../components/common/Notice";
import styles from "./sent.module.scss";

const TipSent = (): ReactElement => {
  const i18n = useI18n();

  return (
    <Layout>
      <Head>
        <title>{i18n.t("notification.title")}</title>
      </Head>
      <Header />
      <main id="content" className={styles.content}>
        <Notice
          className={styles.sent}
          icon={<IconCheckCircleFill size="xl" />}
          titleKey="notification.message.saveSucceeded.title"
          messageKey="notification.message.saveSucceeded.message"
        />

        <div className={styles.footer}>
          <div className="flexSpace" />
          <Link href="/">
            <Button variant="secondary">{i18n.t("notification.button.return")}</Button>
          </Link>
        </div>
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

export default TipSent;
