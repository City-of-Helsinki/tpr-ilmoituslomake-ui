import React, { ReactElement, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useI18n } from "next-localization";
import moment from "moment";
import { initStore } from "../../../state/store";
import { RootState } from "../../../state/reducers";
import { CLEAR_STATE, DATETIME_FORMAT, Toast } from "../../../types/constants";
import { PhotoSchema, PhotoTranslation, TranslationTodoSchema } from "../../../types/general";
import { INITIAL_NOTIFICATION, INITIAL_TRANSLATION } from "../../../types/initial";
import { getTaskStatus, getTaskType } from "../../../utils/conversion";
import i18nLoader from "../../../utils/i18n";
import { checkUser, getOriginServerSide, redirectToEnglish, redirectToLogin, redirectToNotAuthorized } from "../../../utils/serverside";
import saveTranslation from "../../../utils/translation";
import { validateTranslationTaskDetails, validateTranslationTaskPhoto } from "../../../utils/translationValidation";
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
  const selectedTask = useSelector((state: RootState) => state.translation.selectedTask);
  const translatedTask = useSelector((state: RootState) => state.translation.translatedTask);
  const translationExtra = useSelector((state: RootState) => state.translation.translationExtra);
  const {
    photosTranslated,
    translationTask: { taskStatus },
  } = translationExtra;

  const pageValid = useSelector((state: RootState) => state.translation.taskPageValid);
  const ref = useRef<HTMLDivElement>(null);

  const [toast, setToast] = useState<Toast>();

  useEffect(() => {
    if (ref.current) {
      window.scrollTo(0, 0);
      ref.current.scrollIntoView();
    }
  }, [pageValid]);

  const isBasicSectionTranslated = () => {
    return validateTranslationTaskDetails("translation", selectedTask, translatedTask, translationExtra);
  };

  const isPhotoSectionTranslated = (index: number) => {
    return validateTranslationTaskPhoto("translation", index, translationExtra);
  };

  return (
    <Layout>
      <Head>
        <title>{i18n.t("translation.title.task")}</title>
      </Head>
      <Header includeLanguageSelector={false} homePagePath="/translation/request" />
      {translatedTaskId > 0 && (
        <main id="content">
          <div ref={ref}>
            <TaskHeader
              prefix="translation"
              backHref="/translation/request"
              isModeration={false}
              saveTranslation={saveTranslation}
              toast={toast}
              setToast={setToast}
            />
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

          <TaskHeaderButtons
            prefix="translation"
            backHref="/translation/request"
            isModeration={false}
            saveTranslation={saveTranslation}
            setToast={setToast}
          />
        </main>
      )}
    </Layout>
  );
};

// Server-side rendering
export const getServerSideProps: GetServerSideProps = async ({ req, resolvedUrl, params, locale, locales }) => {
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

  // Force the translation app to use English
  if (locale !== "en") {
    return redirectToEnglish(resolvedUrl);
  }

  // Try to fetch the task details for the specified id
  if (params) {
    const { taskId } = params;
    const taskResponse = await fetch(`${getOriginServerSide()}/api/translation/todos/${taskId}/`, {
      headers: { cookie: req.headers.cookie as string },
    });

    if (taskResponse.ok) {
      const taskResult = await (taskResponse.json() as Promise<TranslationTodoSchema>);

      try {
        // taskResult.target.data is the original published notification to be translated
        // taskResult.data is the translated notification
        const { id: targetId, data: targetData } = taskResult.target || { id: 0, data: INITIAL_NOTIFICATION };
        const translatedTask = !taskResult.data || !taskResult.data.name ? INITIAL_TRANSLATION : taskResult.data;
        const language = taskResult.language ? taskResult.language.to : "";

        initialReduxState.translation = {
          ...initialReduxState.translation,
          selectedTaskId: targetId,
          selectedTask: targetData,
          translatedTaskId: taskResult.id,
          translatedTask: { ...translatedTask, language },
          translationExtra: {
            ...initialReduxState.translation.translationExtra,
            translationRequest: {
              requestId: taskResult.requestId,
              request: taskResult.request,
              formattedRequest: moment(taskResult.request).format(DATETIME_FORMAT),
              language: taskResult.language,
              message: taskResult.message,
              translator: {
                fullName: taskResult.translator ? `${taskResult.translator.first_name} ${taskResult.translator.last_name}`.trim() : "",
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
                mediaId: image.media_id ?? "",
                base64: "",
                preview: image.url ?? "",
              };
            }),
            photosTranslated: targetData.images.map((photo) => {
              const translatedImage = translatedTask.images.find((i) => i.uuid === photo.uuid);
              const image = translatedImage || ({ alt_text: {} } as PhotoSchema);

              return {
                uuid: photo.uuid ?? "",
                altText: {
                  lang: image.alt_text.lang ?? "",
                },
                source: image.source ?? "",
              } as PhotoTranslation;
            }),
          },
          taskValidation: {
            name: { valid: true },
            descriptionShort: { valid: true },
            descriptionLong: { valid: true },
            photos: targetData.images.map(() => {
              return {
                altText: { valid: true },
                source: { valid: true },
              };
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
