import React, { ReactElement, useState } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useI18n } from "next-localization";
import { Tab, TabList, TabPanel, Tabs } from "hds-react";
import { initStore } from "../../state/store";
import { CLEAR_STATE } from "../../types/constants";
import i18nLoader from "../../utils/i18n";
import { checkUser, getMatkoTags, getTags, redirectToLogin, redirectToNotAuthorized } from "../../utils/serverside";
import Layout from "../../components/common/Layout";
import ModerationHeader from "../../components/moderation/ModerationHeader";
import PlaceSearch from "../../components/translation/moderation/PlaceSearch";
import PlaceResults from "../../components/translation/moderation/PlaceResults";
import RequestResults from "../../components/translation/moderation/RequestResults";
import TaskSearch from "../../components/translation/moderation/TaskSearch";
import TaskResults from "../../components/translation/moderation/TaskResults";
import MoreResultsButton from "../../components/translation/moderation/MoreResultsButton";

const ModerationTranslation = (): ReactElement => {
  const i18n = useI18n();

  const [showStatus, setShowStatus] = useState<string>("all");
  const [showResults, setShowResults] = useState<string>("requests");

  return (
    <Layout>
      <Head>
        <title>{i18n.t("moderation.title")}</title>
      </Head>
      <ModerationHeader currentPage={4} />
      <main id="content">
        <Tabs>
          <TabList>
            <Tab>{i18n.t("moderation.translation.tabs.translationTasks")}</Tab>
            <Tab>{i18n.t("moderation.translation.tabs.placesTranslationInfo")}</Tab>
          </TabList>
          <TabPanel>
            <TaskSearch showStatus={showStatus} setShowStatus={setShowStatus} />
            {showResults === "requests" && <RequestResults showStatus={showStatus} showResults={showResults} setShowResults={setShowResults} />}
            {showResults === "tasks" && <TaskResults showStatus={showStatus} showResults={showResults} setShowResults={setShowResults} />}
            <MoreResultsButton />
          </TabPanel>
          <TabPanel>
            <PlaceSearch />
            <PlaceResults />
          </TabPanel>
        </Tabs>
      </main>
    </Layout>
  );
};

// Server-side rendering
export const getServerSideProps: GetServerSideProps = async ({ req, resolvedUrl, locales }) => {
  const lngDict = await i18nLoader(locales, true);

  const reduxStore = initStore();
  reduxStore.dispatch({ type: CLEAR_STATE });
  const initialReduxState = reduxStore.getState();

  const user = await checkUser(req);
  if (!user) {
    // Invalid user but login is required, so redirect to login
    return redirectToLogin(resolvedUrl);
  }
  if (user && !user.is_staff) {
    // Valid user but moderator login is required, so redirect to not authorized page
    return redirectToNotAuthorized();
  }
  if (user && user.authenticated) {
    initialReduxState.general.user = user;
  }

  initialReduxState.moderation.moderationExtra.tagOptions = await getTags();
  initialReduxState.moderation.moderationExtra.matkoTagOptions = await getMatkoTags();

  return {
    props: {
      initialReduxState,
      lngDict,
    },
  };
};

export default ModerationTranslation;
