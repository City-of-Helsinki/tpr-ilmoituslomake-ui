import React, { ReactElement, useEffect, useRef } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useI18n } from "next-localization";
import i18nLoader from "../../utils/i18n";
import { initStore } from "../../state/store";
import Layout from "../../components/common/Layout";
import ModerationHeader from "../../components/moderation/ModerationHeader";
import PlaceSearch from "../../components/moderation/PlaceSearch";
import PlaceResults from "../../components/moderation/PlaceResults";

const ModerationPlace = (): ReactElement => {
  const i18n = useI18n();

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView();
    }
  });

  return (
    <Layout>
      <Head>
        <title>{i18n.t("moderation.title")}</title>
      </Head>
      <ModerationHeader currentPage={2} />
      <div id="content" ref={ref}>
        <PlaceSearch />
        <PlaceResults />
      </div>
    </Layout>
  );
};

// Server-side rendering
export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const lngDict = await i18nLoader(locale);

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
