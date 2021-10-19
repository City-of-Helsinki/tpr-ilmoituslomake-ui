import React, { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useI18n } from "next-localization";
import moment from "moment";
import { RootState } from "../../../../state/reducers";
import { initStore } from "../../../../state/store";
import { CLEAR_STATE, DATETIME_FORMAT, TaskStatus, TaskType, Toast, TRANSLATION_OPTIONS } from "../../../../types/constants";
import { ModerationPlaceResult, ModerationTranslationRequestResult, ModerationTranslationRequestResultTask, User } from "../../../../types/general";
import { INITIAL_NOTIFICATION } from "../../../../types/initial";
import { getTaskStatus, getTaskType } from "../../../../utils/conversion";
import i18nLoader from "../../../../utils/i18n";
import { checkUser, getOriginServerSide, redirectToLogin, redirectToNotAuthorized } from "../../../../utils/serverside";
import Layout from "../../../../components/common/Layout";
import ModerationHeader from "../../../../components/moderation/ModerationHeader";
import RequestButtons from "../../../../components/translation/moderation/RequestButtons";
import RequestStatus from "../../../../components/translation/moderation/RequestStatus";
import RequestPlaces from "../../../../components/translation/moderation/RequestPlaces";
import RequestDetail from "../../../../components/translation/moderation/RequestDetail";
import NotificationNotice from "../../../../components/common/NotificationNotice";
import ToastNotification from "../../../../components/common/ToastNotification";
import ValidationSummary from "../../../../components/common/ValidationSummary";

const ModerationTranslationRequestDetail = (): ReactElement => {
  const i18n = useI18n();

  const pageValid = useSelector((state: RootState) => state.moderationTranslation.requestPageValid);
  const ref = useRef<HTMLHeadingElement>(null);

  const requestDetail = useSelector((state: RootState) => state.moderationTranslation.requestDetail);
  const { id: requestId, request, tasks: requestTasks } = requestDetail;
  const formattedRequest = moment(request).format(DATETIME_FORMAT);

  const [toast, setToast] = useState<Toast>();

  useEffect(() => {
    if (ref.current) {
      window.scrollTo(0, 0);
      ref.current.scrollIntoView();
    }
  }, [pageValid]);

  const taskCounts = useCallback((tasks: ModerationTranslationRequestResultTask[]) => {
    return tasks.reduce(
      (acc: { [key: string]: number }, task) => {
        acc[task.taskStatus] += 1;
        return acc;
      },
      { [TaskStatus.Open]: 0, [TaskStatus.InProgress]: 0, [TaskStatus.Closed]: 0 }
    );
  }, []);

  const requestStatus = useCallback(
    (tasks: ModerationTranslationRequestResultTask[]) => {
      const counts = taskCounts(tasks);
      if (counts[TaskStatus.Open] === tasks.length) {
        // All the tasks are open, so the request is open
        return TaskStatus.Open;
      }
      if (counts[TaskStatus.Closed] === tasks.length) {
        // All the tasks are closed, so the request is closed
        return TaskStatus.Closed;
      }
      // There is a mixed status, so the request is in progress
      return TaskStatus.InProgress;
    },
    [taskCounts]
  );

  return (
    <Layout>
      <Head>
        <title>{i18n.t("moderation.title.translationRequest")}</title>
      </Head>
      <ModerationHeader currentPage={4} />
      <div>
        <h1 ref={ref} className="moderation">
          {requestId > 0
            ? `${formattedRequest} ${i18n.t("moderation.translation.request.title")} (${requestTasks.length})`
            : i18n.t("moderation.translation.request.titleNew")}
        </h1>
      </div>
      <main id="content">
        {toast && <ToastNotification prefix="moderation" toast={toast} setToast={setToast} />}
        <NotificationNotice messageKey="moderation.mandatory" />
        {!pageValid && <ValidationSummary prefix="moderation" pageValid={pageValid} />}

        <div>
          {requestId > 0 && <RequestStatus taskCounts={taskCounts} requestStatus={requestStatus} />}
          <RequestPlaces />
          <RequestDetail requestStatus={requestStatus} />
          <RequestButtons requestStatus={requestStatus} setToast={setToast} />
        </div>
      </main>
    </Layout>
  );
};

// Server-side rendering
export const getServerSideProps: GetServerSideProps = async ({ req, resolvedUrl, params, query, locales }) => {
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

  // Initialise the task type for use by the translation request buttons
  initialReduxState.moderationTranslation.requestDetail.taskType = TaskType.Translation;

  const translatorsResponse = await fetch(`${getOriginServerSide()}/api/moderation/translation/translators/`, {
    headers: { cookie: req.headers.cookie as string },
  });

  // Fetch the translator users for use in the request dropdown
  if (translatorsResponse.ok) {
    const translatorsResult = await (translatorsResponse.json() as Promise<{ results: User[] }>);

    try {
      initialReduxState.moderationTranslation = {
        ...initialReduxState.moderationTranslation,
        translators: translatorsResult.results,
      };
    } catch (err) {
      console.log("ERROR", err);
    }
  }

  // Try to fetch the request details for the specified id
  if (params) {
    const { requestId } = params;
    const requestResponse = await fetch(`${getOriginServerSide()}/api/moderation/translation/request/${requestId}/`, {
      headers: { cookie: req.headers.cookie as string },
    });

    if (requestResponse.ok) {
      const requestResult = await (requestResponse.json() as Promise<ModerationTranslationRequestResult>);

      try {
        const { tasks } = requestResult;
        const requestTasks = tasks.map((task) => {
          return { ...task, taskStatus: getTaskStatus(task.status) };
        });

        initialReduxState.moderationTranslation = {
          ...initialReduxState.moderationTranslation,
          requestDetail: {
            id: requestResult.id,
            request: requestResult.request,
            tasks: requestTasks,
            language: requestResult.language,
            message: requestResult.message,
            translator: requestResult.translator ? requestResult.translator.uuid : "",
            taskType: getTaskType(requestResult.category, requestResult.item_type),
          },
        };
      } catch (err) {
        console.log("ERROR", err);
      }
    }
  }

  // Try to fetch the place details for the specified ids
  if (query) {
    const { ids } = query;

    if (ids && ids.length > 0) {
      const selectedPlaceIds = Array.isArray(ids) ? ids : ids.split(",");

      const placeResponses = await Promise.all(
        selectedPlaceIds.map(async (selectedPlaceId) => {
          const placeResponse = await fetch(`${getOriginServerSide()}/api/moderation/get/${selectedPlaceId}/`, {
            headers: { cookie: req.headers.cookie as string },
          });

          if (placeResponse.ok) {
            const placeResult = await (placeResponse.json() as Promise<ModerationPlaceResult>);

            try {
              const { data: placeData } = placeResult || { data: INITIAL_NOTIFICATION };

              return { id: selectedPlaceId, data: placeData };
            } catch (err) {
              console.log("ERROR", err);
            }
          }

          return null;
        })
      );

      const requestTasks = placeResponses.reduce((acc: ModerationTranslationRequestResultTask[], placeResponse) => {
        if (placeResponse) {
          return [
            ...acc,
            { id: 0, target: { id: Number(placeResponse.id), name: placeResponse.data.name }, status: TaskStatus.Open, taskStatus: TaskStatus.Open },
          ];
        }
        return acc;
      }, []);

      if (requestTasks.length > 0) {
        initialReduxState.moderationTranslation = {
          ...initialReduxState.moderationTranslation,
          requestDetail: {
            ...initialReduxState.moderationTranslation.requestDetail,
            tasks: requestTasks,
            translator:
              initialReduxState.moderationTranslation.translators.length > 0 ? initialReduxState.moderationTranslation.translators[0].uuid : "",
            language: {
              from: TRANSLATION_OPTIONS[0].from,
              to: TRANSLATION_OPTIONS[0].to,
            },
            taskType: TaskType.Translation,
          },
        };
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

export default ModerationTranslationRequestDetail;
