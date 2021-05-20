import React, { ReactElement, useState } from "react";
import { useSelector } from "react-redux";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useI18n } from "next-localization";
import i18nLoader from "../../../utils/i18n";
import { initStore } from "../../../state/store";
import { RootState } from "../../../state/reducers";
import { ModerationStatus, CLEAR_STATE, INITIAL_NOTIFICATION, INITIAL_MODERATION_STATUS_EDITED, LANGUAGE_OPTIONS } from "../../../types/constants";
import { ModerationTodoSchema } from "../../../types/general";
import { PhotoStatus } from "../../../types/moderation_status";
import { NotificationSchema } from "../../../types/notification_schema";
import { getTaskStatus, getTaskType } from "../../../utils/conversion";
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

const ModerationTaskDetail = (): ReactElement => {
  const i18n = useI18n();

  const modifiedTaskId = useSelector((state: RootState) => state.moderation.modifiedTaskId);
  const moderationStatus = useSelector((state: RootState) => state.moderationStatus.moderationStatus);
  const moderationExtra = useSelector((state: RootState) => state.moderation.moderationExtra);
  const { photosModified, taskType, taskStatus } = moderationExtra;

  // The maps only initialise properly when not hidden, so use a flag to only collapse the container after the maps are ready
  const [mapsReady, setMapsReady] = useState<boolean>(false);

  const isModerated = (statusToCheck: ModerationStatus) => {
    return statusToCheck !== ModerationStatus.Edited;
  };

  const isSectionModerated = (section: number) => {
    switch (section) {
      case 1: {
        // Basic
        const moderated1 = LANGUAGE_OPTIONS.flatMap((option) => [
          isModerated(moderationStatus.name[option]),
          isModerated(moderationStatus.description.short[option]),
          isModerated(moderationStatus.description.long[option]),
        ]);
        const moderated2 = [isModerated(moderationStatus.ontology_ids)];

        return moderated1.every((mod) => mod) && moderated2.every((mod) => mod);
      }
      case 2: {
        // Contact
        const moderated1 = LANGUAGE_OPTIONS.flatMap((option) => [isModerated(moderationStatus.website[option])]);
        const moderated2 = [
          isModerated(moderationStatus.location),
          isModerated(moderationStatus.address.fi.street),
          isModerated(moderationStatus.address.fi.postal_code),
          isModerated(moderationStatus.address.fi.post_office),
          isModerated(moderationStatus.address.fi.neighborhood),
          isModerated(moderationStatus.address.sv.street),
          isModerated(moderationStatus.address.sv.postal_code),
          isModerated(moderationStatus.address.sv.post_office),
          isModerated(moderationStatus.address.sv.neighborhood),
          isModerated(moderationStatus.phone),
          isModerated(moderationStatus.email),
        ];

        return moderated1.every((mod) => mod) && moderated2.every((mod) => mod);
      }
      case 3: {
        // Photos
        const moderated = photosModified.map((photo, index) => {
          const photoModerated1 = [
            isModerated(moderationStatus.photos[index].url),
            isModerated(moderationStatus.photos[index].permission),
            isModerated(moderationStatus.photos[index].source),
          ];
          const photoModerated2 = LANGUAGE_OPTIONS.flatMap((option) => [isModerated(moderationStatus.photos[index].altText[option])]);

          return photoModerated1.every((mod) => mod) && photoModerated2.every((mod) => mod);
        });

        return moderated.every((mod) => mod);
      }
      default: {
        return true;
      }
    }
  };

  return (
    <Layout>
      <Head>
        <title>{i18n.t("moderation.title")}</title>
      </Head>
      <ModerationHeader currentPage={3} />
      {modifiedTaskId > 0 && (
        <main id="content">
          <TaskHeader isModerated={isSectionModerated(1) && isSectionModerated(2) && isSectionModerated(3)} />
          <h2 className="moderation">{i18n.t("moderation.task.title")}</h2>
          <Collapsible
            section={1}
            title={i18n.t("moderation.task.basic")}
            taskType={taskType}
            taskStatus={taskStatus}
            isModerated={isSectionModerated(1)}
          >
            <DescriptionModeration />
            <TagsModeration />
          </Collapsible>
          <Collapsible
            section={2}
            title={i18n.t("moderation.task.contact")}
            taskType={taskType}
            taskStatus={taskStatus}
            isModerated={isSectionModerated(2)}
            forceExpanded={!mapsReady}
          >
            <LocationModeration />
            <MapModeration setMapsReady={setMapsReady} />
            <ContactModeration />
            <LinksModeration />
          </Collapsible>
          <Collapsible
            section={3}
            title={i18n.t("moderation.task.photos")}
            taskType={taskType}
            taskStatus={taskStatus}
            isModerated={isSectionModerated(3)}
          >
            <PhotosModeration />
          </Collapsible>
        </main>
      )}
    </Layout>
  );
};

// Server-side rendering
export const getServerSideProps: GetServerSideProps = async ({ req, resolvedUrl, params, query, locales }) => {
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
    const { taskId } = params;
    const taskResponse = await fetch(`${getOriginServerSide()}/api/moderation/todos/${taskId}/`, {
      headers: { cookie: req.headers.cookie as string },
    });

    if (taskResponse.ok) {
      const taskResult = await (taskResponse.json() as Promise<ModerationTodoSchema>);

      try {
        // taskResult.target.data is the original existing notification, and is available for modified places and change requests
        // taskResult.data is the new or modified notification, and is available for new and modified places
        const { id: targetId, data: targetData } = taskResult.target || { id: 0, data: INITIAL_NOTIFICATION };
        const modifiedTask = !taskResult.data || !taskResult.data.name ? targetData : (taskResult.data as NotificationSchema);

        initialReduxState.moderation = {
          ...initialReduxState.moderation,
          selectedTaskId: targetId,
          selectedTask: targetData,
          modifiedTaskId: taskResult.id,
          modifiedTask,
          moderationExtra: {
            ...initialReduxState.moderation.moderationExtra,
            published: false,
            created_at: taskResult.created_at,
            updated_at: taskResult.updated_at,
            taskType: getTaskType(taskResult.category, taskResult.item_type),
            taskStatus: getTaskStatus(taskResult.status),
            userPlaceName: taskResult.user_place_name,
            userComments: taskResult.user_comments,
            userDetails: taskResult.user_details,
            moderator: {
              fullName: taskResult.moderator ? `${taskResult.moderator.first_name} ${taskResult.moderator.last_name}`.trim() : "",
              email: taskResult.moderator && taskResult.moderator.email ? taskResult.moderator.email : "",
            },
            photosSelected: targetData.images.map((image) => {
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
                preview: image.url,
              };
            }),
            photosModified: modifiedTask.images.map((image) => {
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
                preview: image.url,
              };
            }),
          },
        };

        const { edit } = query;
        if (!edit) {
          // This is the usual case where the moderation status is initialised to 'unknown'
          initialReduxState.moderationStatus = {
            ...initialReduxState.moderationStatus,
            moderationStatus: {
              ...initialReduxState.moderationStatus.moderationStatus,
              photos: modifiedTask.images.map(() => {
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
        } else {
          // In cases where the moderator has opened a change request themselves, make the moderation status 'edited'
          // to save the moderator the step of clicking the button to open the change request for editing
          initialReduxState.moderationStatus = {
            pageStatus: ModerationStatus.Edited,
            moderationStatus: {
              ...INITIAL_MODERATION_STATUS_EDITED,
              photos: modifiedTask.images.map(() => {
                return {
                  url: ModerationStatus.Edited,
                  altText: {
                    fi: ModerationStatus.Edited,
                    sv: ModerationStatus.Edited,
                    en: ModerationStatus.Edited,
                  },
                  permission: ModerationStatus.Edited,
                  source: ModerationStatus.Edited,
                } as PhotoStatus;
              }),
            },
          };
        }
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

export default ModerationTaskDetail;
