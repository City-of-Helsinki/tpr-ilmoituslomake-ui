import React, { ReactElement } from "react";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useI18n } from "next-localization";
import i18nLoader from "../utils/i18n";
import Layout from "../components/Layout";

import Header from "../components/common/Header";

const Main = (): ReactElement => {
  const i18n = useI18n();

  return (
    <Layout>
      <Head>
        <title>TITLE</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div>HOME</div>
      <div>
        <Link href="/forms/notification">{i18n.t("notification.title")}</Link>
      </div>
      <div>
        <Link href="/forms/moderation">{i18n.t("moderation.title")}</Link>
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

export default Main;
