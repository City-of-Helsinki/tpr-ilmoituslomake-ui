import React, { ReactElement, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, IconCheckCircleFill } from "hds-react";
import { RootState } from "../../state/reducers";
import { initStore } from "../../state/store";
import { NotifierType, CLEAR_STATE, INITIAL_NOTIFICATION, SENT_INFO_PAGE } from "../../types/constants";
import { NotificationSchema } from "../../types/notification_schema";
import { PhotoValidation } from "../../types/notification_validation";
import { getDisplayName } from "../../utils/helper";
import i18nLoader, { defaultLocale } from "../../utils/i18n";
import { checkUser, redirectToLogin, getOriginServerSide, getPreviousInputLanguages, getTags } from "../../utils/serverside";
import Layout from "../../components/common/Layout";
import Header from "../../components/common/Header";
import Notice from "../../components/common/Notice";
import InfoFooter from "../../components/notification/InfoFooter";
import NotificationHeader from "../../components/notification/NotificationHeader";
import NotificationFooterNav from "../../components/notification/NotificationFooterNav";
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
  const router = useRouter();

  const currentPage = useSelector((state: RootState) => state.notification.page);
  const notification = useSelector((state: RootState) => state.notification.notification);
  const { name: placeName } = notification;
  const pageValid = useSelector((state: RootState) => state.notificationValidation.pageValid);
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView();
      ref.current.focus();
    }
  });

  return (
    <Layout>
      <Head>
        <title>{i18n.t("notification.title")}</title>
      </Head>
      {currentPage < SENT_INFO_PAGE && <NotificationHeader headerRef={ref} />}
      {currentPage === SENT_INFO_PAGE && <Header />}

      {currentPage === 1 && (
        <main id="content" className={`narrowSection ${styles.content}`}>
          <h2 tabIndex={-1}>{`${currentPage} ${i18n.t("notification.main.basic")}`}</h2>
          <NotificationNotice messageKey="notification.mandatory" />
          {!pageValid && <ValidationSummary />}
          <Description />
          <Tags />
          <Notifier />
          <NotificationFooterNav />
        </main>
      )}
      {currentPage === 2 && (
        <main id="content" className={`narrowSection ${styles.content}`}>
          <h2 tabIndex={-1}>{`${currentPage} ${i18n.t("notification.main.contact")}`}</h2>
          <NotificationNotice messageKey="notification.mandatory" />
          {!pageValid && <ValidationSummary />}
          <Location />
          <Map />
          <Contact />
          <Links />
          <NotificationFooterNav />
        </main>
      )}
      {currentPage === 3 && (
        <main id="content" className={`narrowSection ${styles.content}`}>
          <h2 tabIndex={-1}>{`${currentPage} ${i18n.t("notification.main.photos")}`}</h2>
          <NotificationNotice messageKey="notification.photos.notice" />
          {!pageValid && <ValidationSummary />}
          <Photos />
          <NotificationFooterNav />
        </main>
      )}
      {currentPage === 4 && (
        <main id="content" className={`narrowSection ${styles.content}`}>
          <h2 tabIndex={-1}>{`${currentPage} ${i18n.t("notification.main.send")}`}</h2>
          <NotificationNotice messageKey="notification.comments.notice" />
          {/* NOTE: temporarily removed until external opening times application is ready
          <Opening />
          */}
          <Comments />
          <Terms />
          <h3>{i18n.t("notification.preview.title")}</h3>
          <NotificationFooterNav />
          <Preview includeNotifier />
          <NotificationFooterNav />
        </main>
      )}

      {currentPage === SENT_INFO_PAGE && (
        <main id="content" className={styles.content}>
          <div className={styles.sentHeader}>
            <h1 tabIndex={-1}>{getDisplayName(router.locale || defaultLocale, placeName)}</h1>
            <div className={styles.flexButton}>
              <Link href="/notification">
                <Button variant="secondary">{i18n.t("notification.button.notifyNewPlace")}</Button>
              </Link>
            </div>
          </div>

          <Notice
            className={styles.sent}
            icon={<IconCheckCircleFill size="xl" aria-hidden />}
            titleKey="notification.message.saveSucceeded.title"
            messageKey="notification.message.saveSucceeded.message"
            focusOnTitle
          />

          <InfoFooter isEditingAllowed={false} />
          <Preview titleKey="notification.preview.title" />
          <InfoFooter isEditingAllowed={false} />
        </main>
      )}
    </Layout>
  );
};

// Server-side rendering
export const getServerSideProps: GetServerSideProps = async ({ req, resolvedUrl, params, locale, locales }) => {
  const lngDict = await i18nLoader(locales);

  // Reset the notification details in the state
  const reduxStore = initStore();
  reduxStore.dispatch({ type: CLEAR_STATE });
  const initialReduxState = reduxStore.getState();

  const user = await checkUser(req);
  if (!user) {
    // Invalid user but login is required, so redirect to login
    return redirectToLogin(resolvedUrl);
  }
  if (user && user.authenticated) {
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
      const targetResult = await (targetResponse.json() as Promise<{ id: number; is_notifier: boolean; data: NotificationSchema }>);

      try {
        // Merge the notification details from the backend
        // If the current user matches the notifier and they are the representative of the place, also merge the notifier details
        // In all other cases, remove the previous notifier details
        const { notifier, images, ...dataToUse } = targetResult.data;

        initialReduxState.notification = {
          ...initialReduxState.notification,
          notificationId: targetResult.id,
          notification: {
            ...initialReduxState.notification.notification,
            ...dataToUse,
            notifier:
              targetResult.is_notifier && notifier && notifier.notifier_type === NotifierType.Representative
                ? { ...INITIAL_NOTIFICATION.notifier, ...notifier }
                : INITIAL_NOTIFICATION.notifier,
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
                preview: image.url,
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
                base64: { valid: true },
              } as PhotoValidation;
            }),
          },
        };
      } catch (err) {
        console.log("ERROR", err);
      }
    }
  }

  // For an existing place, if the current user matches the notifier and they are the representative of the place,
  // the notifier_type value is set above to 'representative', and in this case only, leave the notifier details as defined above
  // In all other cases, replace the notifier details with the login user details if available
  if (initialReduxState.notification.notification.notifier.notifier_type !== NotifierType.Representative) {
    initialReduxState.notification.notification = {
      ...initialReduxState.notification.notification,
      notifier: {
        ...INITIAL_NOTIFICATION.notifier,
        full_name: user ? `${user.first_name} ${user.last_name}`.trim() : "",
        email: user ? user.email : "",
      },
    };
  }

  return {
    props: {
      initialReduxState,
      lngDict,
    },
  };
};

export default NotificationDetail;
