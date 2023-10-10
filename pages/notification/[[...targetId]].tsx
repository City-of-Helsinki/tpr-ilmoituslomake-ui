import React, { ReactElement, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useI18n } from "next-localization";
import { IconCheckCircleFill, IconClockPlus, Koros, Link as HdsLink } from "hds-react";
import { Dialog } from "@material-ui/core";
import { RootState } from "../../state/reducers";
import { initStore } from "../../state/store";
import { NotifierType, CLEAR_STATE, SENT_INFO_PAGE, Toast } from "../../types/constants";
import { INITIAL_NOTIFICATION, INITIAL_NOTIFICATION_EXTRA } from "../../types/initial";
import { NotificationSchema } from "../../types/notification_schema";
import { PhotoValidation, SocialMediaValidation } from "../../types/notification_validation";
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
import NotificationNotice from "../../components/common/NotificationNotice";
import Notifier from "../../components/notification/Notifier";
import Opening from "../../components/notification/Opening";
import OpeningTimesButtonNotification from "../../components/notification/OpeningTimesButtonNotification";
import OpeningTimesInfo from "../../components/notification/OpeningTimesInfo";
import Photos from "../../components/notification/Photos";
import Preview from "../../components/notification/Preview";
import SentInfoHeader from "../../components/notification/SentInfoHeader";
import SocialMedia from "../../components/notification/SocialMedia";
import Tags from "../../components/notification/Tags";
import Terms from "../../components/notification/Terms";
import ToastNotification from "../../components/common/ToastNotification";
import ValidationSummary from "../../components/common/ValidationSummary";
import styles from "./[[...targetId]].module.scss";

const NotificationDetail = (): ReactElement => {
  const i18n = useI18n();

  const currentPage = useSelector((state: RootState) => state.notification.page);
  const pageValid = useSelector((state: RootState) => state.notificationValidation.pageValid);
  const validationSummary = useSelector((state: RootState) => state.notificationValidation.validationSummary);
  const ref = useRef<HTMLHeadingElement>(null);

  const [toast, setToast] = useState<Toast>();
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    if (ref.current) {
      window.scrollTo(0, 0);
      ref.current.scrollIntoView();
      ref.current.focus();
    }
  });

  return (
    <Layout>
      <Head>
        <title>{i18n.t("notification.title.form")}</title>
      </Head>
      {currentPage < SENT_INFO_PAGE && <NotificationHeader headerRef={ref} />}
      {currentPage === SENT_INFO_PAGE && <Header />}

      {currentPage === 1 && (
        <main id="content" className={`narrowSection ${styles.content}`}>
          <h2 tabIndex={-1}>{`${currentPage} ${i18n.t("notification.main.basic")}`}</h2>
          {toast && <ToastNotification prefix="notification" toast={toast} setToast={setToast} />}
          <NotificationNotice messageKey="notification.mandatory" />
          {!pageValid && <ValidationSummary prefix="notification" pageValid={pageValid} validationSummary={validationSummary} />}
          <Description />
          <Tags />
          <Notifier />
          <NotificationFooterNav setToast={setToast} />
        </main>
      )}
      {currentPage === 2 && (
        <main id="content" className={`narrowSection ${styles.content}`}>
          <h2 tabIndex={-1}>{`${currentPage} ${i18n.t("notification.main.contact")}`}</h2>
          {toast && <ToastNotification prefix="notification" toast={toast} setToast={setToast} />}
          <NotificationNotice messageKey="notification.mandatory" />
          {!pageValid && <ValidationSummary prefix="notification" pageValid={pageValid} validationSummary={validationSummary} />}
          <Location />
          <Map />
          <Contact />
          <Links />
          <SocialMedia />
          <NotificationFooterNav setToast={setToast} />
        </main>
      )}
      {currentPage === 3 && (
        <main id="content" className={`narrowSection ${styles.content}`}>
          <h2 tabIndex={-1}>{`${currentPage} ${i18n.t("notification.main.photos")}`}</h2>
          {toast && <ToastNotification prefix="notification" toast={toast} setToast={setToast} />}
          <NotificationNotice messageKey="notification.photos.notice" />
          {!pageValid && <ValidationSummary prefix="notification" pageValid={pageValid} validationSummary={validationSummary} />}
          <Photos />
          <NotificationFooterNav setToast={setToast} />
        </main>
      )}
      {currentPage === 4 && (
        <main id="content" className={`narrowSection ${styles.content}`}>
          <h2 tabIndex={-1}>{`${currentPage} ${i18n.t("notification.main.send")}`}</h2>
          {toast && <ToastNotification prefix="notification" toast={toast} setToast={setToast} />}
          <NotificationNotice messageKey="notification.comments.notice" />
          <Opening />
          <Comments />
          <Terms />
          <h3>{i18n.t("notification.preview.title")}</h3>
          <NotificationFooterNav setToast={setToast} />
          <Preview includeNotifier />
          <NotificationFooterNav setToast={setToast} />
        </main>
      )}

      {currentPage === SENT_INFO_PAGE && (
        <main id="content" className={styles.content}>
          <SentInfoHeader />

          <Notice
            className={styles.sent}
            icon={<IconCheckCircleFill size="xl" aria-hidden />}
            titleKey="notification.message.saveSucceeded.title"
            messageKey="notification.message.saveSucceeded.message"
            focusOnTitle
          />
          <Notice
            className={styles.opening}
            icon={<IconClockPlus size="xl" aria-hidden />}
            titleKey="notification.message.completeOpeningTimes.title"
            messageKey="notification.message.completeOpeningTimes.message"
            button={<OpeningTimesButtonNotification buttonTextKey="notification.button.notifyOpeningTimes" buttonVariant="secondary" />}
          />

          <InfoFooter isEditingAllowed={false} />
          <OpeningTimesInfo openModal={openModal} />
          <Preview titleKey="notification.preview.title" />
          <InfoFooter isEditingAllowed={false} />

          <Dialog open={modalOpen} onClose={closeModal} aria-labelledby="modal-dialog-title" aria-describedby="modal-dialog-description">
            <div className={styles.dialog}>
              <h1 id="modal-dialog-title">{i18n.t("notification.message.sentModal.title")}</h1>
              <div id="modal-dialog-description" className={styles.message}>
                {i18n.t("notification.message.sentModal.message")}
              </div>
              <div>
                <OpeningTimesButtonNotification
                  buttonTextKey="notification.button.continueToOpeningTimes"
                  buttonVariant="primary"
                  closeModal={closeModal}
                />
              </div>
              <div className={styles.link}>
                <HdsLink href="#" size="M" disableVisitedStyles onClick={closeModal}>
                  {i18n.t("notification.button.noOpeningTimes")}
                </HdsLink>
              </div>
              <div className={styles.link}>
                <HdsLink href="#" size="M" disableVisitedStyles onClick={closeModal}>
                  {i18n.t("notification.button.continueLater")}
                </HdsLink>
              </div>
            </div>
            <Koros className={styles.wave} type="storm" />
          </Dialog>
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
      const targetResult = await (targetResponse.json() as Promise<{ id: number; is_notifier: boolean; data: NotificationSchema; hauki_id: number }>);

      try {
        // Merge the notification details from the backend
        // If the current user matches the notifier and they are the representative of the place, also merge the notifier details
        // In all other cases, remove the previous notifier details
        const { notifier, extra_keywords, images, ...dataToUse } = targetResult.data;

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
            extra_keywords,
          },
          notificationExtra: {
            ...initialReduxState.notification.notificationExtra,
            inputLanguages: getPreviousInputLanguages(locale || defaultLocale, targetResult.data.name),
            extraKeywordsText: {
              fi: extra_keywords.fi.join(", "),
              sv: extra_keywords.sv.join(", "),
              en: extra_keywords.en.join(", "),
            },
            addressOriginal: dataToUse.address || INITIAL_NOTIFICATION_EXTRA.addressOriginal,
            photos: images.map((image) => {
              return {
                uuid: image.uuid ?? "",
                sourceType: image.source_type,
                url: image.url,
                altText: {
                  fi: image.alt_text.fi ?? "",
                  sv: image.alt_text.sv ?? "",
                  en: image.alt_text.en ?? "",
                },
                permission: image.permission,
                source: image.source,
                mediaId: image.media_id ?? "",
                base64: "",
                preview: image.url,
              };
            }),
            openingTimesId: targetResult.hauki_id,
            openingTimesNotificationId: targetResult.id,
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
            social_media: dataToUse.social_media
              ? dataToUse.social_media.map(() => {
                  return {
                    title: { valid: true },
                    link: { valid: true },
                  } as SocialMediaValidation;
                })
              : [],
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
