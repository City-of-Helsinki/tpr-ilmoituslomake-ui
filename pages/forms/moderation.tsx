import React, { ReactElement, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useI18n } from "next-localization";
import i18nLoader from "../../utils/i18n";
import { RootState } from "../../state/reducers";
import { initStore } from "../../state/store";
import Layout from "../../components/common/Layout";
import ModerationHeader from "../../components/moderation/ModerationHeader";

const Moderation = (): ReactElement => {
  const i18n = useI18n();

  const currentPage = useSelector((state: RootState) => state.moderation.page);
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
      <ModerationHeader />
      {currentPage === 1 && (
        <div id="content" ref={ref}>
          <h1>{i18n.t("moderation.main.front")}</h1>
        </div>
      )}
      {currentPage === 2 && (
        <div id="content" ref={ref}>
          <h1>{i18n.t("moderation.main.place")}</h1>
        </div>
      )}
      {currentPage === 3 && (
        <div id="content" ref={ref}>
          <h1>{i18n.t("moderation.main.request")}</h1>
        </div>
      )}
      {currentPage === 4 && (
        <div id="content" ref={ref}>
          <h1>{i18n.t("moderation.main.organisation")}</h1>
        </div>
      )}
      {currentPage === 5 && (
        <div id="content" ref={ref}>
          <h1>{i18n.t("moderation.main.translation")}</h1>
        </div>
      )}
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

export default Moderation;
