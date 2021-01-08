import React, { ReactElement, useState } from "react";
import { useSelector } from "react-redux";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useI18n } from "next-localization";
import absoluteUrl from "next-absolute-url";
import i18nLoader from "../../../utils/i18n";
import { initStore } from "../../../state/store";
import { RootState } from "../../../state/reducers";
import { ModerationStatus, INITIAL_MODERATION_EXTRA, INITIAL_MODERATION_STATUS, INITIAL_NOTIFICATION } from "../../../types/constants";
import { TagOption, ModerationTodoSchema } from "../../../types/general";
import { PhotoStatus } from "../../../types/moderation_status";
import { getTaskStatus, getTaskType } from "../../../utils/conversion";
import Layout from "../../../components/common/Layout";
import ModerationHeader from "../../../components/moderation/ModerationHeader";
import Collapsible from "../../../components/moderation/Collapsible";
import TaskHeader from "../../../components/moderation/TaskHeader";
import ContactModeration from "../../../components/moderation/ContactModeration";
import DescriptionModeration from "../../../components/moderation/DescriptionModeration";
import LinksModeration from "../../../components/moderation/LinksModeration";
import LocationModeration from "../../../components/moderation/LocationModeration";
import MapModeration from "../../../components/moderation/MapModeration";
import PhotosModeration from "../../../components/moderation/PhotosModeration";
import TagsModeration from "../../../components/moderation/TagsModeration";

const ModerationTaskDetail = (): ReactElement => {
  const i18n = useI18n();

  const selectedTaskId = useSelector((state: RootState) => state.moderation.selectedTaskId);
  const modifiedTaskId = useSelector((state: RootState) => state.moderation.modifiedTaskId);

  // The maps only initialise properly when not hidden, so use a flag to only collapse the container after the maps are ready
  const [mapsReady, setMapsReady] = useState<boolean>(false);

  return (
    <Layout>
      <Head>
        <title>{i18n.t("moderation.title")}</title>
      </Head>
      <ModerationHeader currentPage={3} />
      {selectedTaskId > 0 && modifiedTaskId > 0 && (
        <div id="content">
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
            <PhotosModeration />
          </Collapsible>
        </div>
      )}
    </Layout>
  );
};

// Server-side rendering
export const getServerSideProps: GetServerSideProps = async ({ req, params, locales }) => {
  const lngDict = await i18nLoader(locales);

  const reduxStore = initStore();
  const initialReduxState = reduxStore.getState();
  const { origin } = absoluteUrl(req);

  // Reset the task details in the state
  initialReduxState.moderation.selectedTaskId = 0;
  initialReduxState.moderation.selectedTask = { ...INITIAL_NOTIFICATION, location: [0, 0] };
  initialReduxState.moderation.modifiedTaskId = 0;
  initialReduxState.moderation.modifiedTask = { ...INITIAL_NOTIFICATION, location: [0, 0] };
  initialReduxState.moderation.moderationExtra = INITIAL_MODERATION_EXTRA;
  initialReduxState.moderationStatus.moderationStatus = INITIAL_MODERATION_STATUS;

  // Try to fetch the task details for the specified id
  if (params) {
    const { taskId } = params;
    const taskResponse = await fetch(`${origin}/api/moderation/todos/${taskId}/`, { headers: { cookie: req.headers.cookie as string } });

    if (taskResponse.ok) {
      const taskResult = await (taskResponse.json() as Promise<ModerationTodoSchema>);

      try {
        initialReduxState.moderation = {
          ...initialReduxState.moderation,
          selectedTaskId: taskResult.target.id,
          selectedTask: taskResult.target.data,
          modifiedTaskId: taskResult.id,
          modifiedTask: taskResult.data,
          moderationExtra: {
            ...initialReduxState.moderation.moderationExtra,
            created_at: taskResult.created_at,
            updated_at: taskResult.updated_at,
            taskType: getTaskType(taskResult.category),
            status: getTaskStatus(taskResult.status),
            moderator: {
              fullName: taskResult.moderator ? `${taskResult.moderator.first_name} ${taskResult.moderator.last_name}`.trim() : "",
              email: taskResult.moderator && taskResult.moderator.email ? taskResult.moderator.email : "",
            },
            photosSelected: taskResult.target.data.images.map((image) => {
              return {
                sourceType: image.source_type,
                url: image.url,
                altText: {
                  fi: image.alt_text.fi,
                  sv: image.alt_text.sv,
                  en: image.alt_text.en,
                },
                permission: image.permission,
                source: image.source,
                base64: "",
                preview: "",
              };
            }),
            photosModified: taskResult.target.data.images.map((image) => {
              return {
                sourceType: image.source_type,
                url: image.url,
                altText: {
                  fi: image.alt_text.fi,
                  sv: image.alt_text.sv,
                  en: image.alt_text.en,
                },
                permission: image.permission,
                source: image.source,
                base64: "",
                preview: "",
              };
            }),
          },
        };

        initialReduxState.moderationStatus = {
          ...initialReduxState.moderationStatus,
          moderationStatus: {
            ...initialReduxState.moderationStatus.moderationStatus,
            photos: taskResult.target.data.images.map(() => {
              return {
                url: ModerationStatus.Unknown,
                altText: {
                  fi: ModerationStatus.Unknown,
                  sv: ModerationStatus.Unknown,
                  en: ModerationStatus.Unknown,
                },
                permission: ModerationStatus.Unknown,
                source: ModerationStatus.Unknown,
              } as PhotoStatus;
            }),
          },
        };
      } catch (err) {
        console.log("ERROR", err);
      }
    }
  }

  // Note: this currently fetches all tags which may cause performance issues
  const tagResponse = await fetch(`${origin}/api/ontologywords/?format=json&search=`);
  if (tagResponse.ok) {
    const tagResult = await tagResponse.json();
    if (tagResult && tagResult.length > 0) {
      const tagOptions = tagResult.map((tag: TagOption) => ({ id: tag.id, ontologyword: tag.ontologyword }));
      initialReduxState.moderation.moderationExtra.tagOptions = tagOptions;
    }
  }

  return {
    props: {
      initialReduxState,
      lngDict,
    },
  };
};

export default ModerationTaskDetail;
