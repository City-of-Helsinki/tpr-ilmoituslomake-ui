import React, { ReactElement } from "react";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useI18n } from "next-localization";
import i18nLoader from "../../utils/i18n";
import Layout from "../../components/Layout";

const Moderation = (): ReactElement => {
  const i18n = useI18n();

  return (
    <Layout>
      <Head>
        <title>{i18n.t("moderation.title")}</title>
      </Head>
      <div>
        <span>{i18n.t("moderation.title")}</span>
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

export default Moderation;
