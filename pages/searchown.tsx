import React, { ReactElement } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useI18n } from "next-localization";
import { Button, IconArrowLeft } from "hds-react";
import { initStore } from "../state/store";
import { CLEAR_STATE } from "../types/constants";
import i18nLoader from "../utils/i18n";
import { checkUser, redirectToLogin } from "../utils/serverside";
import Layout from "../components/common/Layout";
import Header from "../components/common/Header";
import PlaceSearch from "../components/notification/PlaceSearch";
import PlaceResults from "../components/notification/PlaceResults";

const NotificationSearchOwn = (): ReactElement => {
  const i18n = useI18n();

  return (
    <Layout>
      <Head>
        <title>{i18n.t("notification.title")}</title>
      </Head>
      <Header />
      <main id="content">
        <PlaceSearch showOwnPlaces />
        <PlaceResults showOwnPlaces />
        <Link href="/">
          <Button variant="secondary" iconLeft={<IconArrowLeft aria-hidden />}>
            {i18n.t("notification.button.returnToStart")}
          </Button>
        </Link>
      </main>
    </Layout>
  );
};

// Server-side rendering
export const getServerSideProps: GetServerSideProps = async ({ req, resolvedUrl, locales }) => {
  const lngDict = await i18nLoader(locales);

  const reduxStore = initStore();
  reduxStore.dispatch({ type: CLEAR_STATE });
  const initialReduxState = reduxStore.getState();

  const user = await checkUser(req);
  if (!user) {
    // Invalid user but login is required, so redirect to login
    return redirectToLogin(resolvedUrl);
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

export default NotificationSearchOwn;
