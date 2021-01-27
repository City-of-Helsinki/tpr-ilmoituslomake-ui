import React, { ReactElement } from "react";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useI18n } from "next-localization";
import { Button, IconCheckCircleFill } from "hds-react";
import i18nLoader from "../../utils/i18n";
import Layout from "../../components/common/Layout";
import Header from "../../components/common/Header";
import Notice from "../../components/common/Notice";
import styles from "./sent.module.scss";

const TipSent = (): ReactElement => {
  const i18n = useI18n();

  return (
    <Layout>
      <Head>
        <title>{i18n.t("notification.title")}</title>
      </Head>
      <Header />
      <main id="content" className={styles.content}>
        <Notice
          className={styles.sent}
          icon={<IconCheckCircleFill size="xl" />}
          titleKey="notification.message.saveSucceeded.title"
          messageKey="notification.message.saveSucceeded.message"
        />

        <div className={styles.footer}>
          <div className="flexSpace" />
          <Link href="/">
            <Button variant="secondary">{i18n.t("notification.button.return")}</Button>
          </Link>
        </div>
      </main>
    </Layout>
  );
};

// Static Generation
export const getStaticProps: GetStaticProps = async ({ locales }) => {
  const lngDict = await i18nLoader(locales);

  return {
    props: {
      lngDict,
    },
  };
};

export default TipSent;
