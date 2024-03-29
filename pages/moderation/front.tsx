import React, { ReactElement } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
// import Link from "next/link";
import { useI18n } from "next-localization";
// import { Button, IconArrowRight, IconGroup } from "hds-react";
import { initStore } from "../../state/store";
import { CLEAR_STATE } from "../../types/constants";
import i18nLoader from "../../utils/i18n";
import { checkUser, redirectToLogin, redirectToNotAuthorized } from "../../utils/serverside";
import Layout from "../../components/common/Layout";
// import Notice from "../../components/common/Notice";
import ModerationHeader from "../../components/moderation/ModerationHeader";
import Intro from "../../components/moderation/Intro";
import NewTasks from "../../components/moderation/NewTasks";

const ModerationFront = (): ReactElement => {
  const i18n = useI18n();

  return (
    <Layout>
      <Head>
        <title>{i18n.t("moderation.title.front")}</title>
      </Head>
      <ModerationHeader currentPage={1} />
      <main id="content">
        <Intro />
        <NewTasks />

        {/*
        <h2 className="moderation">{i18n.t("moderation.organisationNotice.title")}</h2>
        <Notice
          icon={<IconGroup size="xl" aria-hidden />}
          messageKey="common.todo"
          button={
            <Link href="/moderation/organisation">
              <Button variant="secondary" iconLeft={<IconArrowRight aria-hidden />}>
                {i18n.t("moderation.organisationNotice.manageOrganisation")}
              </Button>
            </Link>
          }
        />

        <h2 className="moderation">{i18n.t("moderation.translationNotice.title")}</h2>
        <Notice
          icon={<IconGroup size="xl" aria-hidden />}
          messageKey="common.todo"
          button={
            <Link href="/moderation/translation">
              <Button variant="secondary" iconLeft={<IconArrowRight aria-hidden />}>
                {i18n.t("moderation.translationNotice.manageTranslation")}
              </Button>
            </Link>
          }
        />
        */}
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
  if (user && user.authenticated && user.is_staff) {
    initialReduxState.general.user = user;
  }

  return {
    props: {
      initialReduxState,
      lngDict,
    },
  };
};

export default ModerationFront;
