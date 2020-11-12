import React, { ReactElement } from "react";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useI18n } from "next-localization";
import i18nLoader from "../../utils/i18n";
import Layout from "../../components/Layout";

import { Notification as HdsNotification } from "hds-react";

import ChangeHeader as Header from "../../components/changerequest/ChangeHeader";

import ChangeDescription from "../../components/changerequest/ChangeDescription";
import ChangeType from "../../components/changerequest/ChangeType";

const ChangeRequest = (): ReactElement => {
  const i18n = useI18n();

  return (
    <Layout>
      <Head>
        <title>{i18n.t("changerequest.title")}</title>
      </Head>
      <Header />
      <div>
        <h1>{`${i18n.t("notification.main.basic")}`}</h1>
        <HdsNotification size="small" className="formNotification">
        {i18n.t("notification.mandatory")}
        </HdsNotification>
        <ChangeType />
        <ChangeDescription />
        <ChangeDescription />
        {/* <PlaceType /> 
        <Tags />
        <Notifier />*/}
      </div>
    </Layout>
  );
};

// Static Generation
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const lngDict = await i18nLoader(locale);

  return {
    props: {
      lngDict,
    },
  };
};

export default ChangeRequest;
