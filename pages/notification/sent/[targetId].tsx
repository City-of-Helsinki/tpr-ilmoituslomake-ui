import React, { ReactElement, useState } from "react";
import { useSelector } from "react-redux";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useI18n } from "next-localization";
import { Button, IconCheckCircleFill, IconClockPlus, IconInfoCircle, IconLinkExternal, IconPhotoPlus, Koros } from "hds-react";
import { Dialog } from "@material-ui/core";
import i18nLoader from "../../../utils/i18n";
import { RootState } from "../../../state/reducers";
import { initStore } from "../../../state/store";
import Layout from "../../../components/common/Layout";
import Header from "../../../components/common/Header";
import Notice from "../../../components/common/Notice";
import Preview from "../../../components/notification/Preview";
import InfoFooter from "../../../components/notification/InfoFooter";
import { INITIAL_NOTIFICATION, INITIAL_NOTIFICATION_EXTRA } from "../../../types/constants";
import { NotificationSchema } from "../../../types/notification_schema";
import { getOrigin } from "../../../utils/request";
import styles from "./[targetId].module.scss";

const NotificationSent = (): ReactElement => {
  const i18n = useI18n();

  const notificationId = useSelector((state: RootState) => state.notification.notificationId);
  const notificationName = useSelector((state: RootState) => state.notification.notificationName);

  const [modalOpen, setModalOpen] = useState(true);

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <Layout>
      <Head>
        <title>{i18n.t("notification.title")}</title>
      </Head>
      <Header />
      <main id="content" className={styles.content}>
        <div className={`gridLayoutContainer ${styles.header}`}>
          <h1>{notificationName}</h1>
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
        <Notice
          className={styles.opening}
          icon={<IconClockPlus size="xl" />}
          titleKey="notification.message.completeOpeningTimes.title"
          messageKey="notification.message.completeOpeningTimes.message"
          button={
            <Button variant="secondary" iconRight={<IconLinkExternal />}>
              {i18n.t("notification.button.notifyOpeningTimes")}
            </Button>
          }
        />
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
              <Button iconRight={<IconLinkExternal />}>{i18n.t("notification.button.continueToOpeningTimes")}</Button>
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
    </Layout>
  );
};

// Server-side rendering
export const getServerSideProps: GetServerSideProps = async ({ req, params, locales }) => {
  const lngDict = await i18nLoader(locales);

  const reduxStore = initStore();
  const initialReduxState = reduxStore.getState();

  // Reset the notification details in the state
  initialReduxState.notification.notificationId = 0;
  initialReduxState.notification.notificationName = "";
  initialReduxState.notification.notification = { ...INITIAL_NOTIFICATION, location: [0, 0] };
  initialReduxState.notification.notificationExtra = INITIAL_NOTIFICATION_EXTRA;

  // Try to fetch the notification details for the specified id
  if (params) {
    const { targetId } = params;
    const targetResponse = await fetch(`${getOrigin(req)}/api/notification/get/${targetId}/`, { headers: { cookie: req.headers.cookie as string } });

    if (targetResponse.ok) {
      const targetResult = await (targetResponse.json() as Promise<{ id: number; data: NotificationSchema }>);

      try {
        // Merge the notification details from the backend
        // TODO - remove previous notifier details? Or check if current user is the same as notifier?
        // TODO - handle image base64 when implemented in backend
        const { images, ...dataToUse } = targetResult.data;

        initialReduxState.notification = {
          ...initialReduxState.notification,
          notificationId: targetResult.id,
          notificationName: targetResult.data.name.fi || targetResult.data.name.sv || targetResult.data.name.en,
          notification: {
            ...initialReduxState.notification.notification,
            ...dataToUse,
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
