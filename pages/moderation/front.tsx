import React, { ReactElement } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useI18n } from "next-localization";
import i18nLoader from "../../utils/i18n";
import { initStore } from "../../state/store";
import Layout from "../../components/common/Layout";
import ModerationHeader from "../../components/moderation/ModerationHeader";
import Intro from "../../components/moderation/Intro";
import NewTasks from "../../components/moderation/NewTasks";
import OrganisationNotice from "../../components/moderation/OrganisationNotice";
import TranslationNotice from "../../components/moderation/TranslationNotice";

const ModerationFront = (): ReactElement => {
  const i18n = useI18n();

  return (
    <Layout>
      <Head>
        <title>{i18n.t("moderation.title")}</title>
      </Head>
      <ModerationHeader currentPage={1} />
      <div id="content">
        <Intro />
        <NewTasks />
        <TranslationNotice />
        <OrganisationNotice />
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

export default ModerationFront;
