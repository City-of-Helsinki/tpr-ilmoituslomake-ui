import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useI18n } from "next-localization";
import { initStore } from "../../state/store";
import { RootState } from "../../state/reducers";
import { CLEAR_STATE } from "../../types/constants";
import i18nLoader from "../../utils/i18n";
import { checkUser } from "../../utils/serverside";
import Layout from "../../components/common/Layout";
import ModerationHeader from "../../components/moderation/ModerationHeader";
import PlaceSearch from "../../components/moderation/PlaceSearch";
import PlaceResults from "../../components/moderation/PlaceResults";

const ModerationPlace = (): ReactElement => {
  const i18n = useI18n();

  const placeResults = useSelector((state: RootState) => state.notification.placeResults);

  return (
    <Layout>
      <Head>
        <title>{i18n.t("moderation.title")}</title>
      </Head>
      <ModerationHeader currentPage={2} />
      <main id="content">
        <PlaceSearch />
        {placeResults.length > 0 && <PlaceResults />}
      </main>
    </Layout>
  );
};

// Server-side rendering
export const getServerSideProps: GetServerSideProps = async ({ req, res, resolvedUrl, locales }) => {
  const lngDict = await i18nLoader(locales);

  const reduxStore = initStore();
  reduxStore.dispatch({ type: CLEAR_STATE });
  const initialReduxState = reduxStore.getState();

  const user = await checkUser(req, res, resolvedUrl, true, true);
  if (user) {
    initialReduxState.general.user = user;
  }

  return {
    props: {
      initialReduxState,
      lngDict,
    },
  };
};

export default ModerationPlace;
