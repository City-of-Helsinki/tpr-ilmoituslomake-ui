import React, { ReactElement, useState } from "react";
import { useSelector } from "react-redux";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useI18n } from "next-localization";
import i18nLoader from "../../../utils/i18n";
import { initStore } from "../../../state/store";
import { RootState } from "../../../state/reducers";
import { ModerationStatus, TaskStatus, TaskType, CLEAR_STATE, INITIAL_NOTIFICATION } from "../../../types/constants";
import { ModerationPlaceResult } from "../../../types/general";
import { PhotoStatus } from "../../../types/moderation_status";
import { checkUser, getOriginServerSide, getTags, redirectToLogin } from "../../../utils/serverside";
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

const ModerationPlaceDetail = (): ReactElement => {
  const i18n = useI18n();

  const moderationExtra = useSelector((state: RootState) => state.moderation.moderationExtra);
  const { taskType, taskStatus } = moderationExtra;
  const selectedTaskId = useSelector((state: RootState) => state.moderation.selectedTaskId);

  // The maps only initialise properly when not hidden, so use a flag to only collapse the container after the maps are ready
  const [mapsReady, setMapsReady] = useState<boolean>(false);

  return (
    <Layout>
      <Head>
        <title>{i18n.t("moderation.title")}</title>
      </Head>
      <ModerationHeader currentPage={2} />
      {selectedTaskId > 0 && (
        <main id="content">
          <TaskHeader />
          <h2 className="moderation">{i18n.t("moderation.task.title")}</h2>
          <Collapsible section={1} title={i18n.t("moderation.task.basic")} taskType={taskType} taskStatus={taskStatus}>
            <DescriptionModeration />
            <TagsModeration />
          </Collapsible>
          <Collapsible section={2} title={i18n.t("moderation.task.contact")} taskType={taskType} taskStatus={taskStatus} forceExpanded={!mapsReady}>
            <LocationModeration />
            <MapModeration setMapsReady={setMapsReady} />
            <ContactModeration />
            <LinksModeration />
          </Collapsible>
          <Collapsible section={3} title={i18n.t("moderation.task.photos")} taskType={taskType} taskStatus={taskStatus}>
            <PhotosModeration />
          </Collapsible>
        </main>
      )}
    </Layout>
  );
};

// Server-side rendering
export const getServerSideProps: GetServerSideProps = async ({ req, resolvedUrl, params, locales }) => {
  const lngDict = await i18nLoader(locales, true);

  // Reset the task details in the state
  const reduxStore = initStore();
  reduxStore.dispatch({ type: CLEAR_STATE });
  const initialReduxState = reduxStore.getState();

  const user = await checkUser(req);
  if (!user) {
    // Invalid user but login is required, so redirect to login
    return redirectToLogin(resolvedUrl);
  }
  if (user && user.authenticated) {
    initialReduxState.general.user = user;
  }

  initialReduxState.moderation.moderationExtra.tagOptions = await getTags();

  // Try to fetch the task details for the specified id
  if (params) {
    const { placeId } = params;
    const placeResponse = await fetch(`${getOriginServerSide()}/api/moderation/get/${placeId}/`, {
      headers: { cookie: req.headers.cookie as string },
    });

    if (placeResponse.ok) {
      const placeResult = await (placeResponse.json() as Promise<ModerationPlaceResult>);

      try {
        const placeData = placeResult.data || INITIAL_NOTIFICATION;

        initialReduxState.moderation = {
          ...initialReduxState.moderation,
          selectedTaskId: placeResult.id,
          selectedTask: placeData,
          modifiedTaskId: 0,
          modifiedTask: placeData,
          moderationExtra: {
            ...initialReduxState.moderation.moderationExtra,
            created_at: placeResult.created_at,
            updated_at: placeResult.updated_at,
            taskType: TaskType.PlaceInfo,
            taskStatus: TaskStatus.Unknown,
            userPlaceName: "",
            userComments: "",
            userDetails: "",
            moderator: {
              fullName: "",
              email: "",
            },
            photosSelected: placeResult.data.images.map((image) => {
              return {
                uuid: image.uuid ?? "",
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
            photosModified: placeResult.data.images.map((image) => {
              return {
                uuid: image.uuid ?? "",
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
            photos: placeResult.data.images.map(() => {
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

  return {
    props: {
      initialReduxState,
      lngDict,
    },
  };
};

export default ModerationPlaceDetail;
