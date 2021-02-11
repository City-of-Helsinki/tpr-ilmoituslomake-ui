import React, { ReactElement, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useI18n } from "next-localization";
import { RootState } from "../../state/reducers";
import { initStore } from "../../state/store";
import { CLEAR_STATE, INITIAL_NOTIFICATION } from "../../types/constants";
import { NotificationSchema } from "../../types/notification_schema";
import { PhotoValidation } from "../../types/notification_validation";
import i18nLoader, { defaultLocale } from "../../utils/i18n";
import { checkUser, getOriginServerSide, getPreviousInputLanguages, getTags } from "../../utils/serverside";
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
// import Opening from "../../components/notification/Opening";
import Photos from "../../components/notification/Photos";
import Preview from "../../components/notification/Preview";
import Tags from "../../components/notification/Tags";
import Terms from "../../components/notification/Terms";
import ValidationSummary from "../../components/notification/ValidationSummary";
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
        <main id="content" className={styles.content} ref={ref}>
          <h2>{`${currentPage} ${i18n.t("notification.main.basic")}`}</h2>
          <NotificationNotice messageKey="notification.mandatory" />
          {!pageValid && <ValidationSummary />}
          <Description />
          <Tags />
          <Notifier />
        </main>
      )}
      {currentPage === 2 && (
        <main id="content" className={styles.content} ref={ref}>
          <h2>{`${currentPage} ${i18n.t("notification.main.contact")}`}</h2>
          <NotificationNotice messageKey="notification.mandatory" />
          {!pageValid && <ValidationSummary />}
          <Location />
          <Map />
          <Contact />
          <Links />
        </main>
      )}
      {currentPage === 3 && (
        <main id="content" className={styles.content} ref={ref}>
          <h2>{`${currentPage} ${i18n.t("notification.main.photos")}`}</h2>
          <NotificationNotice messageKey="notification.photos.notice" />
          {!pageValid && <ValidationSummary />}
          <Photos />
        </main>
      )}
      {currentPage === 4 && (
        <main id="content" className={styles.content} ref={ref}>
          <h2>{`${currentPage} ${i18n.t("notification.main.send")}`}</h2>
          <NotificationNotice messageKey="notification.comments.notice" />
          {/* NOTE: temporarily removed until external opening times application is ready
          <Opening />
          */}
          <Comments />
          <Terms />
          <NotificationFooter />
          <Preview includeNotifier />
        </main>
      )}
      <NotificationFooter />
    </Layout>
  );
};

// Server-side rendering
export const getServerSideProps: GetServerSideProps = async ({ req, res, resolvedUrl, params, locale, locales }) => {
  const lngDict = await i18nLoader(locales);

  // Reset the notification details in the state
  const reduxStore = initStore();
  reduxStore.dispatch({ type: CLEAR_STATE });
  const initialReduxState = reduxStore.getState();

  const user = await checkUser(req, res, resolvedUrl, false);
  if (user) {
    initialReduxState.general.user = user;
  }

  // Note: the previously selected input languages are determined after fetching the data below
  initialReduxState.notification.notificationExtra.inputLanguages = [locale || defaultLocale];
  initialReduxState.notification.notificationExtra.tagOptions = await getTags();

  // Try to fetch the notification details for the specified id
  if (params) {
    const { targetId } = params;
    const targetResponse = await fetch(`${getOriginServerSide()}/api/notification/get/${targetId}/`, {
      headers: { cookie: req.headers.cookie as string },
    });

    if (targetResponse.ok) {
      const targetResult = await (targetResponse.json() as Promise<{ id: number; data: NotificationSchema }>);

      try {
        // Merge the notification details from the backend, but remove the previous notifier details if present
        // TODO - handle image base64 when implemented in backend
        const { notifier, images, ...dataToUse } = targetResult.data;

        initialReduxState.notification = {
          ...initialReduxState.notification,
          notificationId: targetResult.id,
          notification: {
            ...initialReduxState.notification.notification,
            ...dataToUse,
            notifier: INITIAL_NOTIFICATION.notifier,
          },
          notificationExtra: {
            ...initialReduxState.notification.notificationExtra,
            inputLanguages: getPreviousInputLanguages(locale || defaultLocale, targetResult.data.name),
            photos: images.map((image) => {
              return {
                uuid: image.uuid ?? "",
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

  // Replace the notifier details with the login user details if available
  initialReduxState.notification.notification = {
    ...initialReduxState.notification.notification,
    notifier: {
      ...INITIAL_NOTIFICATION.notifier,
      full_name: user ? `${user.first_name} ${user.last_name}`.trim() : "",
      email: user ? user.email : "",
    },
  };

  return {
    props: {
      initialReduxState,
      lngDict,
    },
  };
};

export default NotificationDetail;
