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
import NotificationNotice from "../../components/notification/NotificationNotice";
import Notifier from "../../components/notification/Notifier";
import Opening from "../../components/notification/Opening";
import Photos from "../../components/notification/Photos";
import Preview from "../../components/notification/Preview";
import Tags from "../../components/notification/Tags";
import Terms from "../../components/notification/Terms";
import ValidationSummary from "../../components/notification/ValidationSummary";
import { INITIAL_NOTIFICATION, INITIAL_NOTIFICATION_EXTRA } from "../../types/constants";
import { TagOption } from "../../types/general";
import { NotificationSchema } from "../../types/notification_schema";
import { PhotoValidation } from "../../types/notification_validation";
import styles from "./[[...targetId]].module.scss";

const NotificationDetail = (): ReactElement => {
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
          <NotificationNotice messageKey="notification.mandatory" />
          {!pageValid && <ValidationSummary />}
          <Description />
          <Tags />
          <Notifier />
        </div>
      )}
      {currentPage === 2 && (
        <div id="content" className={styles.content} ref={ref}>
          <h2>{`${currentPage} ${i18n.t("notification.main.contact")}`}</h2>
          <NotificationNotice messageKey="notification.mandatory" />
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
          <NotificationNotice messageKey="notification.photos.notice" />
          {!pageValid && <ValidationSummary />}
          <Photos />
        </div>
      )}
      {currentPage === 4 && (
        <div id="content" className={styles.content} ref={ref}>
          <h2>{`${currentPage} ${i18n.t("notification.main.send")}`}</h2>
          <NotificationNotice messageKey="notification.comments.notice" />
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
export const getServerSideProps: GetServerSideProps = async ({ req, params, locale, locales }) => {
  const lngDict = await i18nLoader(locales);

  const reduxStore = initStore();
  const initialReduxState = reduxStore.getState();
  initialReduxState.notification.notificationExtra.inputLanguages = [locale || defaultLocale];
  const { origin } = absoluteUrl(req);

  // Reset the notification details in the state
  initialReduxState.notification.notificationId = 0;
  initialReduxState.notification.notificationName = "";
  initialReduxState.notification.notification = { ...INITIAL_NOTIFICATION, location: [0, 0] };
  initialReduxState.notification.notificationExtra = INITIAL_NOTIFICATION_EXTRA;

  // Try to fetch the notification details for the specified id
  if (params) {
    const { targetId } = params;
    const targetResponse = await fetch(`${origin}/api/notification/get/${targetId}/`, { headers: { cookie: req.headers.cookie as string } });

    if (targetResponse.ok) {
      const targetResult = await (targetResponse.json() as Promise<{ id: number; data: NotificationSchema }>);

      try {
        // Merge the notification details from the backend, but remove the previous notifier details
        // TODO - handle image base64 when implemented in backend
        // TODO - handle inputLanguages here?
        const { notifier, images, ...dataToUse } = targetResult.data;

        initialReduxState.notification = {
          ...initialReduxState.notification,
          notificationId: targetResult.id,
          notificationName: targetResult.data.name.fi || targetResult.data.name.sv || targetResult.data.name.en,
          notification: {
            ...initialReduxState.notification.notification,
            ...dataToUse,
            notifier: INITIAL_NOTIFICATION.notifier,
          },
          notificationExtra: {
            ...initialReduxState.notification.notificationExtra,
            photos: images.map((image) => {
              return {
                sourceType: image.source_type,
                url: image.url,
                altText: {
                  fi: image.alt_text.fi,
                  sv: image.alt_text.sv,
                  en: image.alt_text.en,
                },
                permission: image.permission,
                source: image.source,
                base64: "",
                preview: "",
              };
            }),
          },
        };

        initialReduxState.notificationValidation = {
          ...initialReduxState.notificationValidation,
          notificationValidation: {
            ...initialReduxState.notificationValidation.notificationValidation,
            photos: images.map(() => {
              return {
                url: { valid: true },
                altText: {
                  fi: { valid: true },
                  sv: { valid: true },
                  en: { valid: true },
                },
                permission: { valid: true },
                source: { valid: true },
              } as PhotoValidation;
            }),
          },
        };
      } catch (err) {
        console.log("ERROR", err);
      }
    }
  }

  // Note: this currently fetches all tags which may cause performance issues
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

export default NotificationDetail;
