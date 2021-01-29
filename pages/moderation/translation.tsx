import React, { ReactElement, useEffect, useRef } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useI18n } from "next-localization";
import i18nLoader from "../../utils/i18n";
import { initStore } from "../../state/store";
import { CLEAR_STATE } from "../../types/constants";
import Layout from "../../components/common/Layout";
import ModerationHeader from "../../components/moderation/ModerationHeader";

const ModerationTranslation = (): ReactElement => {
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
      <ModerationHeader currentPage={5} />
      <main id="content" ref={ref}>
        <h1 className="moderation">{i18n.t("moderation.main.translation")}</h1>
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

export default ModerationTranslation;
