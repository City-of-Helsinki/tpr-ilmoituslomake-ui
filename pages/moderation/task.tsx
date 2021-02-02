import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useI18n } from "next-localization";
import { initStore } from "../../state/store";
import { RootState } from "../../state/reducers";
import { CLEAR_STATE } from "../../types/constants";
import { checkUser } from "../../utils/serverside";
import i18nLoader from "../../utils/i18n";
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
      <main id="content">
        <TaskSearch />
        {taskResults.length > 0 && <TaskResults />}
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

export default ModerationTask;
