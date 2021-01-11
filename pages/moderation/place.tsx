import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useI18n } from "next-localization";
import i18nLoader from "../../utils/i18n";
import { initStore } from "../../state/store";
import { RootState } from "../../state/reducers";
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
      <div id="content">
        <PlaceSearch />
        {placeResults.length > 0 && <PlaceResults />}
      </div>
    </Layout>
  );
};

// Server-side rendering
export const getServerSideProps: GetServerSideProps = async ({ locales }) => {
  const lngDict = await i18nLoader(locales);

  const reduxStore = initStore();
  const initialReduxState = reduxStore.getState();

  return {
    props: {
      initialReduxState,
      lngDict,
    },
  };
};

export default ModerationPlace;
