import React, { ReactElement, useState } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useI18n } from "next-localization";
import { initStore } from "../../state/store";
import { CLEAR_STATE } from "../../types/constants";
import i18nLoader from "../../utils/i18n";
import { checkUser, redirectToLogin, redirectToNotAuthorized } from "../../utils/serverside";
import Layout from "../../components/common/Layout";
import Header from "../../components/common/Header";
import Intro from "../../components/translation/Intro";
import TaskSearch from "../../components/translation/TaskSearch";
import RequestResults from "../../components/translation/RequestResults";
import TaskResults from "../../components/translation/TaskResults";
import MoreResultsButton from "../../components/translation/MoreResultsButton";

const TranslationRequest = (): ReactElement => {
  const i18n = useI18n();

  const [showStatus, setShowStatus] = useState<string>("active");
  const [showResults, setShowResults] = useState<string>("requests");

  return (
    <Layout>
      <Head>
        <title>{i18n.t("translation.title")}</title>
      </Head>
      <Header includeLanguageSelector={false} homePagePath="/translation/request" />
      <main id="content">
        <Intro />
        <TaskSearch />
        {showResults === "requests" && (
          <RequestResults showStatus={showStatus} showResults={showResults} setShowStatus={setShowStatus} setShowResults={setShowResults} />
        )}
        {showResults === "tasks" && (
          <TaskResults showStatus={showStatus} showResults={showResults} setShowStatus={setShowStatus} setShowResults={setShowResults} />
        )}
        <MoreResultsButton />
      </main>
    </Layout>
  );
};

// Server-side rendering
export const getServerSideProps: GetServerSideProps = async ({ req, resolvedUrl, locales }) => {
  const lngDict = await i18nLoader(locales, false, true);

  const reduxStore = initStore();
  reduxStore.dispatch({ type: CLEAR_STATE });
  const initialReduxState = reduxStore.getState();

  const user = await checkUser(req);
  if (!user) {
    // Invalid user but login is required, so redirect to login
    return redirectToLogin(resolvedUrl);
  }
  if (user && !user.is_translator) {
    // Valid user but translator login is required, so redirect to not authorized page
    return redirectToNotAuthorized();
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

export default TranslationRequest;
