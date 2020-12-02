import React, { ReactElement } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useI18n } from "next-localization";
import i18nLoader from "../../utils/i18n";
import { initStore } from "../../state/store";
import Layout from "../../components/common/Layout";
import ModerationHeader from "../../components/moderation/ModerationHeader";
import Collapsible from "../../components/moderation/Collapsible";
import DescriptionModeration from "../../components/moderation/DescriptionModeration";
import TaskSearch from "../../components/moderation/TaskSearch";
import TaskResults from "../../components/moderation/TaskResults";

const ModerationTask = (): ReactElement => {
  const i18n = useI18n();

  return (
    <Layout>
      <Head>
        <title>{i18n.t("moderation.title")}</title>
      </Head>
      <ModerationHeader currentPage={3} />
      <div id="content">
        <TaskSearch />
        <TaskResults />

        <h3>{i18n.t("moderation.task.title")}</h3>
        <Collapsible section={1} title={i18n.t("moderation.task.basic")}>
          <DescriptionModeration />
        </Collapsible>
        <Collapsible section={2} title={i18n.t("moderation.task.contact")}>
          TODO
        </Collapsible>
        <Collapsible section={3} title={i18n.t("moderation.task.photos")}>
          TODO
        </Collapsible>
      </div>
    </Layout>
  );
};

// Server-side rendering
export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const lngDict = await i18nLoader(locale);

  const reduxStore = initStore();
  const initialReduxState = reduxStore.getState();

  return {
    props: {
      initialReduxState,
      lngDict,
    },
  };
};

export default ModerationTask;
