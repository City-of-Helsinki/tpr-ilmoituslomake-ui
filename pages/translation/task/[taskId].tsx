import React, { ReactElement, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useI18n } from "next-localization";
import moment from "moment";
import { initStore } from "../../../state/store";
import { RootState } from "../../../state/reducers";
import { CLEAR_STATE, DATETIME_FORMAT, INITIAL_NOTIFICATION, INITIAL_TRANSLATION, TranslationStatus } from "../../../types/constants";
import { PhotoSchema, TranslationTodoSchema } from "../../../types/general";
import { PhotoTranslationStatus } from "../../../types/translation_status";
import { getTaskStatus, getTaskType } from "../../../utils/conversion";
import i18nLoader from "../../../utils/i18n";
import { checkUser, redirectToLogin, redirectToNotAuthorized } from "../../../utils/serverside";
import saveTranslation from "../../../utils/translation";
import Layout from "../../../components/common/Layout";
import Header from "../../../components/common/Header";
import Collapsible from "../../../components/translation/Collapsible";
import TaskHeader from "../../../components/translation/TaskHeader";
import TaskHeaderButtons from "../../../components/translation/TaskHeaderButtons";
import DescriptionTranslation from "../../../components/translation/DescriptionTranslation";
import PhotosTranslation from "../../../components/translation/PhotosTranslation";

const TranslationTask = (): ReactElement => {
  const i18n = useI18n();

  const translatedTaskId = useSelector((state: RootState) => state.translation.translatedTaskId);
  const translationStatus = useSelector((state: RootState) => state.translationStatus.translationStatus);
  const translationExtra = useSelector((state: RootState) => state.translation.translationExtra);
  const {
    photosTranslated,
    translationTask: { taskStatus },
  } = translationExtra;

  const pageValid = useSelector((state: RootState) => state.translation.taskPageValid);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView();
    }
  }, [pageValid]);

  const isTranslated = (statusToCheck: TranslationStatus) => {
    return statusToCheck !== TranslationStatus.Edited;
  };

  const isBasicSectionTranslated = () => {
    const option = "lang";

    // Basic
    const translated = [
      isTranslated(translationStatus.name[option]),
      isTranslated(translationStatus.description.short[option]),
      isTranslated(translationStatus.description.long[option]),
    ];

    return translated.every((tra) => tra);
  };

  const isPhotoSectionTranslated = (index: number) => {
    const option = "lang";

    // Photos
    const photoTranslated = [isTranslated(translationStatus.photos[index].altText[option]), isTranslated(translationStatus.photos[index].source)];

    return photoTranslated.every((tra) => tra);
  };

  return (
    <Layout>
      <Head>
        <title>{i18n.t("translation.title")}</title>
      </Head>
      <Header includeLanguageSelector={false} homePagePath="/translation/request" />
      {translatedTaskId > 0 && (
        <main id="content">
          <div ref={ref}>
            <TaskHeader prefix="translation" backHref="/translation/request" saveTranslation={saveTranslation} />
          </div>
          <h2 className="translation">{i18n.t("translation.task.title")}</h2>

          <Collapsible
            prefix="translation"
            section={1}
            title={i18n.t("translation.task.basic")}
            taskStatus={taskStatus}
            isTranslated={isBasicSectionTranslated()}
          >
            <DescriptionTranslation prefix="translation" />
          </Collapsible>

          {photosTranslated.map((translatedImage, index) => {
            const key = `photo_${index}`;

            return (
              <Collapsible
                prefix="translation"
                key={key}
                section={index + 2}
                title={`${i18n.t("translation.task.photo")} ${index + 1}`}
                taskStatus={taskStatus}
                isTranslated={isPhotoSectionTranslated(index)}
              >
                <PhotosTranslation prefix="translation" index={index} />
              </Collapsible>
            );
          })}

          <TaskHeaderButtons prefix="translation" backHref="/translation/request" saveTranslation={saveTranslation} />
        </main>
      )}
    </Layout>
  );
};

// Server-side rendering
export const getServerSideProps: GetServerSideProps = async ({ req, resolvedUrl, params, locales }) => {
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

  // Try to fetch the task details for the specified id
  if (params) {
    const { taskId } = params;
    // const taskResponse = await fetch(`${getOriginServerSide()}/api/translation/todos/${taskId}/`, {
    const taskResponse = await fetch(`http://localhost/mockapi/translation/todos/${taskId}/`, {
      headers: { cookie: req.headers.cookie as string },
    });

    if (taskResponse.ok) {
      const taskResult = await (taskResponse.json() as Promise<TranslationTodoSchema>);

      try {
        // taskResult.target.data is the original published notification to be translated
        // taskResult.data is the translated notification
        const { id: targetId, data: targetData } = taskResult.target || { id: 0, data: INITIAL_NOTIFICATION };
        const translatedTask = !taskResult.data || !taskResult.data.name ? INITIAL_TRANSLATION : taskResult.data;

        initialReduxState.translation = {
          ...initialReduxState.translation,
          selectedTaskId: targetId,
          selectedTask: targetData,
          translatedTaskId: taskResult.id,
          translatedTask,
          translationExtra: {
            ...initialReduxState.translation.translationExtra,
            translationRequest: {
              requestId: taskResult.requestId,
              request: taskResult.request,
              formattedRequest: moment(taskResult.request).format(DATETIME_FORMAT),
              language: taskResult.language,
              message: taskResult.message,
              translator: {
                name: taskResult.translator && taskResult.translator.name ? taskResult.translator.name : "",
                email: taskResult.translator && taskResult.translator.email ? taskResult.translator.email : "",
              },
              moderator: {
                fullName: taskResult.moderator ? `${taskResult.moderator.first_name} ${taskResult.moderator.last_name}`.trim() : "",
                email: taskResult.moderator && taskResult.moderator.email ? taskResult.moderator.email : "",
              },
            },
            translationTask: {
              created_at: taskResult.created_at,
              updated_at: taskResult.updated_at,
              taskType: getTaskType(taskResult.category, taskResult.item_type),
              taskStatus: getTaskStatus(taskResult.status),
            },
            photosSelected: targetData.images.map((photo) => {
              const image = photo || ({ alt_text: {} } as PhotoSchema);

              return {
                uuid: image.uuid ?? "",
                sourceType: image.source_type ?? "",
                url: image.url ?? "",
                altText: {
                  fi: image.alt_text.fi ?? "",
                  sv: image.alt_text.sv ?? "",
                  en: image.alt_text.en ?? "",
                },
                permission: image.permission ?? "",
                source: image.source ?? "",
                base64: "",
                preview: image.url ?? "",
              };
            }),
            photosTranslated: translatedTask.images.map((photo) => {
              const image = photo || ({ alt_text: {} } as PhotoSchema);

              return {
                uuid: image.uuid ?? "",
                altText: {
                  lang: image.alt_text.lang ?? "",
                },
                source: image.source ?? "",
              };
            }),
          },
          taskValidation: {
            name: { valid: true },
            descriptionShort: { valid: true },
            descriptionLong: { valid: true },
            photos: translatedTask.images.map(() => {
              return {
                altText: { valid: true },
                source: { valid: true },
              };
            }),
          },
        };

        initialReduxState.translationStatus = {
          ...initialReduxState.translationStatus,
          translationStatus: {
            ...initialReduxState.translationStatus.translationStatus,
            photos: translatedTask.images.map(() => {
              return {
                altText: {
                  lang: TranslationStatus.Unknown,
                },
                source: TranslationStatus.Unknown,
              } as PhotoTranslationStatus;
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

export default TranslationTask;
