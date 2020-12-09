import React, { ReactElement, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useI18n } from "next-localization";
import absoluteUrl from "next-absolute-url";
import i18nLoader, { defaultLocale } from "../../utils/i18n";
import { RootState } from "../../state/reducers";
import { initStore } from "../../state/store";
import Layout from "../../components/common/Layout";
import NotificationHeader from "../../components/notification/NotificationHeader";
import NotificationFooter from "../../components/notification/NotificationFooter";
import Comments from "../../components/notification/Comments";
import Contact from "../../components/notification/Contact";
import Description from "../../components/notification/Description";
import Links from "../../components/notification/Links";
import Location from "../../components/notification/Location";
import Map from "../../components/notification/Map";
import Notice from "../../components/notification/Notice";
import Notifier from "../../components/notification/Notifier";
import Opening from "../../components/notification/Opening";
import Payment from "../../components/notification/Payment";
import Photos from "../../components/notification/Photos";
import Preview from "../../components/notification/Preview";
import Prices from "../../components/notification/Prices";
import Tags from "../../components/notification/Tags";
import Terms from "../../components/notification/Terms";
import ValidationSummary from "../../components/notification/ValidationSummary";
import { TagOption } from "../../types/general";
import styles from "./notification.module.scss";

const Notification = (): ReactElement => {
  const i18n = useI18n();

  const currentPage = useSelector((state: RootState) => state.notification.page);
  const pageValid = useSelector((state: RootState) => state.notificationValidation.pageValid);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView();
    }
  });

  return (
    <Layout>
      <Head>
        <title>{i18n.t("notification.title")}</title>
      </Head>
      <NotificationHeader />
      {currentPage === 1 && (
        <div id="content" className={styles.content} ref={ref}>
          <h2>{`${currentPage} ${i18n.t("notification.main.basic")}`}</h2>
          <Notice messageKey="notification.mandatory" />
          {!pageValid && <ValidationSummary />}
          <Description />
          <Tags />
          <Notifier />
        </div>
      )}
      {currentPage === 2 && (
        <div id="content" className={styles.content} ref={ref}>
          <h2>{`${currentPage} ${i18n.t("notification.main.contact")}`}</h2>
          <Notice messageKey="notification.mandatory" />
          {!pageValid && <ValidationSummary />}
          <Location />
          <Map />
          <Contact />
          <Links />
        </div>
      )}
      {currentPage === 3 && (
        <div id="content" className={styles.content} ref={ref}>
          <h2>{`${currentPage} ${i18n.t("notification.main.photos")}`}</h2>
          <Notice messageKey="notification.photos.notice" />
          {!pageValid && <ValidationSummary />}
          <Photos />
        </div>
      )}
      {currentPage === 4 && (
        <div id="content" className={styles.content} ref={ref}>
          <h2>{`${currentPage} ${i18n.t("notification.main.send")}`}</h2>
          <Notice messageKey="notification.comments.notice" />
          <Opening />
          <Comments />
          <Terms />
          <NotificationFooter />
          <Preview />
        </div>
      )}
      <NotificationFooter />
    </Layout>
  );
};

// Server-side rendering
export const getServerSideProps: GetServerSideProps = async ({ req, locale }) => {
  const lngDict = await i18nLoader(locale);

  const reduxStore = initStore();
  const initialReduxState = reduxStore.getState();
  initialReduxState.notification.notificationExtra.inputLanguages = [locale || defaultLocale];

  // Note: this currently fetches all tags which may cause performance issues
  const { origin } = absoluteUrl(req);
  const tagResponse = await fetch(`${origin}/api/ontologywords/?format=json&search=`);
  if (tagResponse.ok) {
    const tagResult = await tagResponse.json();
    if (tagResult && tagResult.length > 0) {
      const tagOptions = tagResult.map((tag: TagOption) => ({ id: tag.id, ontologyword: tag.ontologyword }));
      initialReduxState.notification.notificationExtra.tagOptions = tagOptions;
    }
  }

  return {
    props: {
      initialReduxState,
      lngDict,
    },
  };
};

export default Notification;
