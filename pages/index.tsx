import React, { ReactElement } from "react";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useI18n } from "next-localization";
import { Button, IconAngleRight, IconEye, IconLocation, IconPenLine, IconStar, Koros } from "hds-react";
import i18nLoader from "../utils/i18n";
import Layout from "../components/common/Layout";
import Header from "../components/common/Header";
import Notice from "../components/common/Notice";
import styles from "./index.module.scss";

const Main = (): ReactElement => {
  const i18n = useI18n();

  return (
    <Layout>
      <Head>
        <title>{i18n.t("notification.title")}</title>
      </Head>
      <Header />
      <main id="content" className={styles.content}>
        <div className={styles.korosTextBox}>
          <h1>{i18n.t("notification.index.title")}</h1>
        </div>
        <Koros className={styles.koros} type="basic" flipHorizontal />

        <div className={styles.infoTextBox}>{i18n.t("notification.index.message")}</div>
        <div className={styles.infoLinkContainer}>
          <Button variant="supplementary" size="small" iconRight={<IconAngleRight />}>
            {i18n.t("notification.index.terms")}
          </Button>
          <Button variant="supplementary" size="small" iconRight={<IconAngleRight />}>
            {i18n.t("notification.index.accessibility")}
          </Button>
        </div>

        <h2>{i18n.t("notification.index.notify")}</h2>

        <Notice
          className={styles.newPlace}
          icon={<IconLocation size="xl" />}
          titleKey="notification.message.notifyNewPlace.title"
          messageKey="notification.message.notifyNewPlace.message"
          button={
            <Link href="/notification">
              <Button variant="secondary">{i18n.t("notification.button.notifyNewPlace")}</Button>
            </Link>
          }
        />
        <Notice
          icon={<IconPenLine size="xl" />}
          titleKey="notification.message.giveTip.title"
          messageKey="notification.message.giveTip.message"
          button={
            <Link href="/tip">
              <Button variant="secondary">{i18n.t("notification.button.giveTip")}</Button>
            </Link>
          }
        />
        <Notice
          className={styles.checkPlace}
          icon={<IconEye size="xl" />}
          titleKey="notification.message.checkPlace.title"
          messageKey="notification.message.checkPlace.message"
          button={
            <Link href="/search">
              <Button variant="secondary">{i18n.t("notification.button.checkPlace")}</Button>
            </Link>
          }
        />
        <Notice
          icon={<IconStar size="xl" />}
          titleKey="notification.message.modifyOwnPlace.title"
          messageKey="notification.message.modifyOwnPlace.message"
          button={
            <Link href="/search">
              <Button variant="secondary">{i18n.t("notification.button.modifyOwnPlace")}</Button>
            </Link>
          }
        />
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

export default Main;
