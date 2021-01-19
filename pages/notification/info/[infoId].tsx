import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useI18n } from "next-localization";
import i18nLoader from "../../../utils/i18n";
import { RootState } from "../../../state/reducers";
import { initStore } from "../../../state/store";
import Layout from "../../../components/common/Layout";
import Header from "../../../components/common/Header";
import Preview from "../../../components/notification/Preview";
import InfoFooter from "../../../components/notification/InfoFooter";
import { INITIAL_NOTIFICATION, INITIAL_NOTIFICATION_EXTRA } from "../../../types/constants";
import { NotificationSchema } from "../../../types/notification_schema";
import { getOrigin } from "../../../utils/request";
import styles from "./[infoId].module.scss";

const Info = (): ReactElement => {
  const i18n = useI18n();

  const notificationName = useSelector((state: RootState) => state.notification.notificationName);

  return (
    <Layout>
      <Head>
        <title>{i18n.t("notification.title")}</title>
      </Head>
      <Header />
      <main id="content" className={styles.content}>
        <h1>{notificationName}</h1>

        <InfoFooter />
        <Preview full={false} />
        <InfoFooter />
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
    const { infoId } = params;
    const targetResponse = await fetch(`${getOrigin(req)}/api/notification/get/${infoId}/`, { headers: { cookie: req.headers.cookie as string } });

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

export default Info;