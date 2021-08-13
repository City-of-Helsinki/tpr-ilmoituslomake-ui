import React, { ReactElement, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useI18n } from "next-localization";
import { RootState } from "../../../../state/reducers";
import { initStore } from "../../../../state/store";
import { CLEAR_STATE, INITIAL_NOTIFICATION, TaskStatus, TaskType } from "../../../../types/constants";
import { ModerationPlaceResult, ModerationTranslationRequest, ModerationTranslationRequestResult } from "../../../../types/general";
import { getTaskStatus, getTaskType } from "../../../../utils/conversion";
import i18nLoader from "../../../../utils/i18n";
import { checkUser, getOriginServerSide, redirectToLogin, redirectToNotAuthorized } from "../../../../utils/serverside";
import Layout from "../../../../components/common/Layout";
import ModerationHeader from "../../../../components/moderation/ModerationHeader";
import RequestHeaderButtons from "../../../../components/moderation/translation/RequestHeaderButtons";
import RequestStatus from "../../../../components/moderation/translation/RequestStatus";
import RequestPlaces from "../../../../components/moderation/translation/RequestPlaces";
import RequestDetail from "../../../../components/moderation/translation/RequestDetail";
import NotificationNotice from "../../../../components/common/NotificationNotice";
import ValidationSummary from "../../../../components/common/ValidationSummary";

const ModerationTranslation = (): ReactElement => {
  const i18n = useI18n();

  const pageValid = useSelector((state: RootState) => state.moderationTranslation.requestPageValid);
  const ref = useRef<HTMLHeadingElement>(null);

  const requestDetail = useSelector((state: RootState) => state.moderationTranslation.requestDetail);
  const { requestId, request, selectedPlaces } = requestDetail;

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView();
    }
  }, [pageValid]);

  return (
    <Layout>
      <Head>
        <title>{i18n.t("moderation.title")}</title>
      </Head>
      <ModerationHeader currentPage={4} />
      <div>
        <h1 ref={ref} className="moderation">
          {requestId > 0
            ? `${request} ${i18n.t("moderation.translation.request.title")} (${selectedPlaces.length})`
            : i18n.t("moderation.translation.request.titleNew")}
        </h1>
      </div>
      <main id="content">
        <NotificationNotice messageKey="moderation.mandatory" />
        {!pageValid && <ValidationSummary prefix="moderation" />}

        <div>
          {requestId > 0 && <RequestStatus />}
          <RequestPlaces />
          <RequestDetail />
          <RequestHeaderButtons />
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

  // Try to fetch the request details for the specified id
  if (params) {
    const { requestId } = params;
    // const requestResponse = await fetch(`${getOriginServerSide()}/api/moderation/translation/request/${requestId}/`, {
    const requestResponse = await fetch(`http://localhost/mockapi/moderation/translation/request/${requestId}/`, {
      headers: { cookie: req.headers.cookie as string },
    });

    if (requestResponse.ok) {
      const requestResult = await (requestResponse.json() as Promise<ModerationTranslationRequestResult>);

      try {
        const { tasks } = requestResult;
        const selectedPlaces = tasks.map((task) => task.target);

        initialReduxState.moderationTranslation = {
          ...initialReduxState.moderationTranslation,
          requestDetail: {
            requestId: requestResult.id,
            request: requestResult.request,
            selectedPlaces,
            language: requestResult.language,
            message: requestResult.message,
            translator: requestResult.translator,
            taskType: getTaskType(requestResult.category, requestResult.item_type),
            taskStatus: getTaskStatus(requestResult.status),
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

      const selectedPlaces = placeResponses.reduce((acc: ModerationTranslationRequest["selectedPlaces"], placeResponse) => {
        if (placeResponse) {
          return [...acc, { id: Number(placeResponse.id), name: placeResponse.data.name }];
        }
        return acc;
      }, []);

      if (selectedPlaces.length > 0) {
        initialReduxState.moderationTranslation = {
          ...initialReduxState.moderationTranslation,
          requestDetail: {
            ...initialReduxState.moderationTranslation.requestDetail,
            selectedPlaces,
            language: {
              from: "en",
              to: "zh",
            },
            taskType: TaskType.Translation,
            taskStatus: TaskStatus.Open,
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

export default ModerationTranslation;
