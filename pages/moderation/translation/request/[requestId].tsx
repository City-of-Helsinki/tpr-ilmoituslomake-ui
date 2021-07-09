import React, { ReactElement } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useI18n } from "next-localization";
import { initStore } from "../../../../state/store";
import { CLEAR_STATE } from "../../../../types/constants";
import { ModerationTranslationRequestResult } from "../../../../types/general";
import i18nLoader from "../../../../utils/i18n";
import { checkUser, redirectToLogin, redirectToNotAuthorized } from "../../../../utils/serverside";
import Layout from "../../../../components/common/Layout";
import ModerationHeader from "../../../../components/moderation/ModerationHeader";
import RequestPlaces from "../../../../components/moderation/translation/RequestPlaces";
import RequestDetail from "../../../../components/moderation/translation/RequestDetail";

const ModerationTranslation = (): ReactElement => {
  const i18n = useI18n();

  return (
    <Layout>
      <Head>
        <title>{i18n.t("moderation.title")}</title>
      </Head>
      <ModerationHeader currentPage={4} />
      <main id="content">
        <RequestPlaces />
        <RequestDetail />
      </main>
    </Layout>
  );
};

// Server-side rendering
export const getServerSideProps: GetServerSideProps = async ({ req, resolvedUrl, params, locales }) => {
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
        const { id: requestIdNum, request, tasks, language, message, translator } = requestResult;
        const selectedPlaces = tasks.map((task) => task.target);

        initialReduxState.moderationTranslation = {
          ...initialReduxState.moderationTranslation,
          requestDetail: {
            requestId: requestIdNum,
            request,
            selectedPlaces,
            language,
            message,
            translator,
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

export default ModerationTranslation;
