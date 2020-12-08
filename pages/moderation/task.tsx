import React, { ReactElement, useState } from "react";
import { useSelector } from "react-redux";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useI18n } from "next-localization";
import absoluteUrl from "next-absolute-url";
import i18nLoader from "../../utils/i18n";
import { initStore } from "../../state/store";
import { RootState } from "../../state/reducers";
import Layout from "../../components/common/Layout";
import ModerationHeader from "../../components/moderation/ModerationHeader";
import Collapsible from "../../components/moderation/Collapsible";
import TaskHeader from "../../components/moderation/TaskHeader";
import TaskSearch from "../../components/moderation/TaskSearch";
import TaskResults from "../../components/moderation/TaskResults";
import ContactModeration from "../../components/moderation/ContactModeration";
import DescriptionModeration from "../../components/moderation/DescriptionModeration";
import LinksModeration from "../../components/moderation/LinksModeration";
import LocationModeration from "../../components/moderation/LocationModeration";
import MapModeration from "../../components/moderation/MapModeration";
import TagsModeration from "../../components/moderation/TagsModeration";
import { TagOption } from "../../types/general";

const ModerationTask = (): ReactElement => {
  const i18n = useI18n();

  const taskResults = useSelector((state: RootState) => state.moderation.taskResults);
  const selectedTaskId = useSelector((state: RootState) => state.moderation.selectedTaskId);

  // The maps only initialise properly when not hidden, so use a flag to only collapse the container after the maps are ready
  const [mapsReady, setMapsReady] = useState<boolean>(false);

  return (
    <Layout>
      <Head>
        <title>{i18n.t("moderation.title")}</title>
      </Head>
      <ModerationHeader currentPage={3} />
      <div id="content">
        {selectedTaskId <= 0 && (
          <>
            <TaskSearch />
            {taskResults.length > 0 && <TaskResults />}
          </>
        )}

        {selectedTaskId > 0 && (
          <>
            <TaskHeader />

            <h3>{i18n.t("moderation.task.title")}</h3>
            <Collapsible section={1} title={i18n.t("moderation.task.basic")}>
              <DescriptionModeration />
              <TagsModeration />
            </Collapsible>
            <Collapsible section={2} title={i18n.t("moderation.task.contact")} forceExpanded={!mapsReady}>
              <LocationModeration />
              <MapModeration setMapsReady={setMapsReady} />
              <ContactModeration />
              <LinksModeration />
            </Collapsible>
            <Collapsible section={3} title={i18n.t("moderation.task.photos")}>
              TODO
            </Collapsible>
          </>
        )}
      </div>
    </Layout>
  );
};

// Server-side rendering
export const getServerSideProps: GetServerSideProps = async ({ req, locale }) => {
  const lngDict = await i18nLoader(locale);

  // Note: this currently fetches all tags which may cause performance issues
  const { origin } = absoluteUrl(req);
  const tagResponse = await fetch(`${origin}/api/ontologywords/?format=json&search=`);
  let tagOptions = [];
  if (tagResponse.ok) {
    const tagResult = await tagResponse.json();
    if (tagResult && tagResult.length > 0) {
      tagOptions = tagResult.map((tag: TagOption) => ({ id: tag.id, ontologyword: tag.ontologyword }));
    }
  }

  const reduxStore = initStore();
  const initialReduxState = reduxStore.getState();
  initialReduxState.notification.notificationExtra.tagOptions = tagOptions;

  return {
    props: {
      initialReduxState,
      lngDict,
    },
  };
};

export default ModerationTask;
