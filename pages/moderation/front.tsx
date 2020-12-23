import React, { ReactElement } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useI18n } from "next-localization";
import { Button, IconArrowRight, IconGroup } from "hds-react";
import i18nLoader from "../../utils/i18n";
import { initStore } from "../../state/store";
import Layout from "../../components/common/Layout";
import Notice from "../../components/common/Notice";
import ModerationHeader from "../../components/moderation/ModerationHeader";
import Intro from "../../components/moderation/Intro";
import NewTasks from "../../components/moderation/NewTasks";
import OrganisationNotice from "../../components/moderation/OrganisationNotice";
import TranslationNotice from "../../components/moderation/TranslationNotice";

const ModerationFront = (): ReactElement => {
  const i18n = useI18n();

  return (
    <Layout>
      <Head>
        <title>{i18n.t("moderation.title")}</title>
      </Head>
      <ModerationHeader currentPage={1} />
      <div id="content">
        <Intro />
        <NewTasks />

        <h3>{i18n.t("moderation.organisationNotice.title")}</h3>
        <Notice
          icon={<IconGroup size="xl" />}
          messageKey="general.todo"
          button={
            <Link href="/moderation/translation">
              <Button variant="secondary" iconLeft={<IconArrowRight />}>
                {i18n.t("moderation.translationNotice.manageTranslation")}
              </Button>
            </Link>
          }
        />

        <h3>{i18n.t("moderation.translationNotice.title")}</h3>
        <Notice
          icon={<IconGroup size="xl" />}
          messageKey="general.todo"
          button={
            <Link href="/moderation/organisation">
              <Button variant="secondary" iconLeft={<IconArrowRight />}>
                {i18n.t("moderation.organisationNotice.manageOrganisation")}
              </Button>
            </Link>
          }
        />
      </div>
    </Layout>
  );
};

// Server-side rendering
export const getServerSideProps: GetServerSideProps = async ({ locales }) => {
  const lngDict = await i18nLoader(locales);

  const reduxStore = initStore();
  const initialReduxState = reduxStore.getState();

  return {
    props: {
      initialReduxState,
      lngDict,
    },
  };
};

export default ModerationFront;
