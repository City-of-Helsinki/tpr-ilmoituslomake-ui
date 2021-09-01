import React, { ReactElement } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useI18n } from "next-localization";
import { Button, IconPenLine, IconPlusCircle, IconSearch, IconStar, Koros, Link as HdsLink } from "hds-react";
import { initStore } from "../state/store";
import { ACCESSIBILITY_URL, CLEAR_STATE, TERMS_URL } from "../types/constants";
import i18nLoader from "../utils/i18n";
import { checkUser } from "../utils/serverside";
import Layout from "../components/common/Layout";
import Header from "../components/common/Header";
import Notice from "../components/common/Notice";
import styles from "./index.module.scss";

const Main = (): ReactElement => {
  const i18n = useI18n();

  const openTermsOfUse = () => {
    window.open(TERMS_URL, "_blank");
  };

  const openAccessibilityInfo = () => {
    window.open(ACCESSIBILITY_URL, "_blank");
  };

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
          <div>
            <HdsLink
              href="#"
              size="M"
              openInNewTab
              openInNewTabAriaLabel={i18n.t("common.opensInANewTab")}
              external
              openInExternalDomainAriaLabel={i18n.t("common.opensExternal")}
              disableVisitedStyles
              onClick={openTermsOfUse}
            >
              {i18n.t("notification.index.terms")}
            </HdsLink>
          </div>
          <div>
            <HdsLink
              href="#"
              size="M"
              openInNewTab
              openInNewTabAriaLabel={i18n.t("common.opensInANewTab")}
              external
              openInExternalDomainAriaLabel={i18n.t("common.opensExternal")}
              disableVisitedStyles
              onClick={openAccessibilityInfo}
            >
              {i18n.t("notification.index.accessibility")}
            </HdsLink>
          </div>
        </div>

        <h2>{i18n.t("notification.index.notify")}</h2>

        <Notice
          className={styles.checkPlace}
          icon={<IconSearch size="xl" aria-hidden />}
          titleKey="notification.message.checkPlace.title"
          messageKey="notification.message.checkPlace.message"
          button={
            <Link href="/search">
              <Button variant="secondary">{i18n.t("notification.button.checkPlace")}</Button>
            </Link>
          }
        />
        <Notice
          className={styles.modifyOwnPlace}
          icon={<IconStar size="xl" aria-hidden />}
          titleKey="notification.message.modifyOwnPlace.title"
          messageKey="notification.message.modifyOwnPlace.message"
          button={
            <Link href="/search?own=1">
              <Button variant="secondary">{i18n.t("notification.button.modifyOwnPlace")}</Button>
            </Link>
          }
        />
        <Notice
          className={styles.newPlace}
          icon={<IconPlusCircle size="xl" aria-hidden />}
          titleKey="notification.message.notifyNewPlace.title"
          messageKey="notification.message.notifyNewPlace.message"
          button={
            <Link href="/notification">
              <Button variant="secondary">{i18n.t("notification.button.notifyNewPlace")}</Button>
            </Link>
          }
        />
        <Notice
          className={styles.giveTip}
          icon={<IconPenLine size="xl" aria-hidden />}
          titleKey="notification.message.giveTip.title"
          messageKey="notification.message.giveTip.message"
          button={
            <Link href="/tip">
              <Button variant="secondary">{i18n.t("notification.button.giveTip")}</Button>
            </Link>
          }
        />
      </main>
    </Layout>
  );
};

// Server-side rendering
export const getServerSideProps: GetServerSideProps = async ({ req, locales }) => {
  const lngDict = await i18nLoader(locales);

  const reduxStore = initStore();
  reduxStore.dispatch({ type: CLEAR_STATE });
  const initialReduxState = reduxStore.getState();

  const user = await checkUser(req);
  if (!user) {
    // Invalid user but login is not required
  }
  if (user && user.authenticated) {
    initialReduxState.general.user = user;
  }

  return {
    props: {
      initialReduxState,
      lngDict,
    },
  };
};

export default Main;
