import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useI18n } from "next-localization";
import { Button, IconArrowLeft } from "hds-react";
import i18nLoader from "../utils/i18n";
import { initStore } from "../state/store";
import { RootState } from "../state/reducers";
import { CLEAR_STATE } from "../types/constants";
import Layout from "../components/common/Layout";
import Header from "../components/common/Header";
import PlaceSearch from "../components/notification/PlaceSearch";
import PlaceResults from "../components/notification/PlaceResults";

const NotificationSearch = (): ReactElement => {
  const i18n = useI18n();

  const placeResults = useSelector((state: RootState) => state.notification.placeResults);

  return (
    <Layout>
      <Head>
        <title>{i18n.t("notification.title")}</title>
      </Head>
      <Header />
      <main id="content">
        <PlaceSearch />
        {placeResults.length > 0 && <PlaceResults />}
        <Link href="/">
          <Button variant="secondary" iconLeft={<IconArrowLeft />}>
            {i18n.t("notification.button.returnToStart")}
          </Button>
        </Link>
      </main>
    </Layout>
  );
};

// Server-side rendering
export const getServerSideProps: GetServerSideProps = async ({ locales }) => {
  const lngDict = await i18nLoader(locales);

  const reduxStore = initStore();
  reduxStore.dispatch({ type: CLEAR_STATE });
  const initialReduxState = reduxStore.getState();

  return {
    props: {
      initialReduxState,
      lngDict,
    },
  };
};

export default NotificationSearch;
