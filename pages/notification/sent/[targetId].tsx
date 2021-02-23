import React, { ReactElement, useState } from "react";
import { useSelector } from "react-redux";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, IconCheckCircleFill, IconInfoCircle, IconLinkExternal, IconPhotoPlus, Koros } from "hds-react";
import { Dialog } from "@material-ui/core";
import { RootState } from "../../../state/reducers";
import { initStore } from "../../../state/store";
import { CLEAR_STATE, INITIAL_NOTIFICATION } from "../../../types/constants";
import { NotificationSchema } from "../../../types/notification_schema";
import i18nLoader, { defaultLocale } from "../../../utils/i18n";
import { checkUser, getOriginServerSide, getPreviousInputLanguages, getTags } from "../../../utils/serverside";
import { getDisplayName } from "../../../utils/helper";
import Layout from "../../../components/common/Layout";
import Header from "../../../components/common/Header";
import Notice from "../../../components/common/Notice";
import Preview from "../../../components/notification/Preview";
import InfoFooter from "../../../components/notification/InfoFooter";
import styles from "./[targetId].module.scss";

const NotificationSent = (): ReactElement => {
  const i18n = useI18n();
  const router = useRouter();

  const notificationId = useSelector((state: RootState) => state.notification.notificationId);
  const notification = useSelector((state: RootState) => state.notification.notification);
  const { name: placeName } = notification;

  // NOTE: temporarily set to false until external opening times application is ready
  const [modalOpen, setModalOpen] = useState(false);

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <Layout>
      <Head>
        <title>{i18n.t("notification.title")}</title>
      </Head>
      <Header />
      {notificationId > 0 && (
        <main id="content" className={styles.content}>
          <div className={`gridLayoutContainer ${styles.header}`}>
            <h1>{getDisplayName(router.locale || defaultLocale, placeName)}</h1>
            <div className={styles.gridButton}>
              <Link href="/notification">
                <Button variant="secondary">{i18n.t("notification.button.notifyNewPlace")}</Button>
              </Link>
            </div>
          </div>

          <Notice
            className={styles.sent}
            icon={<IconCheckCircleFill size="xl" />}
            titleKey="notification.message.saveSucceeded.title"
            messageKey="notification.message.saveSucceeded.message"
          />
          {/* NOTE: temporarily removed until external opening times application is ready
          <Notice
            className={styles.opening}
            icon={<IconClockPlus size="xl" />}
            titleKey="notification.message.completeOpeningTimes.title"
            messageKey="notification.message.completeOpeningTimes.message"
            button={
              <Button variant="secondary" iconRight={<IconLinkExternal />}>
                {i18n.t("notification.button.notifyOpeningTimes")}
                <span className="screenReaderOnly"> {i18n.t("common.opensInANewTab")}</span>
              </Button>
            }
          />
          */}
          <Notice
            className={styles.photos}
            icon={<IconPhotoPlus size="xl" />}
            titleKey="notification.message.completePhotos.title"
            messageKey="notification.message.completePhotos.message"
            button={
              <Link href={`/notification/${notificationId}`}>
                <Button variant="secondary">{i18n.t("notification.button.modifyInformation")}</Button>
              </Link>
            }
          />

          <InfoFooter />
          <Preview />
          <InfoFooter />

          <Dialog open={modalOpen} onClose={closeModal} aria-labelledby="modal-dialog-title" aria-describedby="modal-dialog-description">
            <div className={styles.dialog}>
              <h1 id="modal-dialog-title">{i18n.t("notification.message.sentModal.title")}</h1>
              <div id="modal-dialog-description" className={styles.message}>
                {i18n.t("notification.message.sentModal.message")}
              </div>
              <div>
                <Button iconRight={<IconLinkExternal />}>
                  {i18n.t("notification.button.continueToOpeningTimes")}
                  <span className="screenReaderOnly"> {i18n.t("common.opensInANewTab")}</span>
                </Button>
              </div>
              <div>
                <Button variant="supplementary" iconRight={<IconInfoCircle />} onClick={closeModal}>
                  {i18n.t("notification.button.noOpeningTimes")}
                </Button>
              </div>
              <div>
                <Button variant="supplementary" iconRight={<IconInfoCircle />} onClick={closeModal}>
                  {i18n.t("notification.button.continueLater")}
                </Button>
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
export const getServerSideProps: GetServerSideProps = async ({ req, params, locales }) => {
  const lngDict = await i18nLoader(locales);

  // Reset the notification details in the state
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
            inputLanguages: getPreviousInputLanguages(defaultLocale, targetResult.data.name),
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
      } catch (err) {
        console.log("ERROR", err);
      }
    }
  }

  return {
    props: {
      initialReduxState,
      lngDict,
    },
  };
};

export default NotificationSent;
