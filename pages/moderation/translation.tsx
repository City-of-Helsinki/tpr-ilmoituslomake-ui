import React, { ReactElement, useState } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useI18n } from "next-localization";
import { RadioButton, SelectionGroup, Tab, TabList, TabPanel, Tabs } from "hds-react";
import { initStore } from "../../state/store";
import { CLEAR_STATE } from "../../types/constants";
import i18nLoader from "../../utils/i18n";
import { checkUser, getMatkoTags, getTags, redirectToLogin, redirectToNotAuthorized } from "../../utils/serverside";
import Layout from "../../components/common/Layout";
import ModerationHeader from "../../components/moderation/ModerationHeader";
import PlaceSearch from "../../components/moderation/translation/PlaceSearch";
import PlaceResults from "../../components/moderation/translation/PlaceResults";
import RequestResults from "../../components/moderation/translation/RequestResults";
import TaskSearch from "../../components/moderation/translation/TaskSearch";
import TaskResults from "../../components/moderation/translation/TaskResults";
import styles from "./translation.module.scss";

const ModerationTranslation = (): ReactElement => {
  const i18n = useI18n();

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
            <TaskSearch />

            <div className={styles.showResults}>
              <div>{i18n.t("moderation.translation.taskSearch.showResults.show")}</div>
              <SelectionGroup id="showResults" direction="horizontal">
                <RadioButton
                  id="showResults_requests"
                  label={i18n.t("moderation.translation.taskSearch.showResults.requests")}
                  name="showResult"
                  value="requests"
                  checked={showResults === "requests"}
                  onChange={() => setShowResults("requests")}
                />
                <RadioButton
                  id="showResults_tasks"
                  label={i18n.t("moderation.translation.taskSearch.showResults.tasks")}
                  name="showResult"
                  value="tasks"
                  checked={showResults === "tasks"}
                  onChange={() => setShowResults("tasks")}
                />
              </SelectionGroup>
            </div>

            {showResults === "requests" && <RequestResults />}
            {showResults === "tasks" && <TaskResults />}
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
