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
import TaskSearch from "../../components/moderation/TaskSearch";
import TaskResults from "../../components/moderation/TaskResults";

const ModerationTask = (): ReactElement => {
  const i18n = useI18n();

  const taskResults = useSelector((state: RootState) => state.moderation.taskResults);

  return (
    <Layout>
      <Head>
        <title>{i18n.t("moderation.title")}</title>
      </Head>
      <ModerationHeader currentPage={3} />
      <div id="content">
        <TaskSearch />
        {taskResults.length > 0 && <TaskResults />}
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

export default ModerationTask;
