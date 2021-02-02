import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useI18n } from "next-localization";
import { RootState } from "../../../state/reducers";
import { initStore } from "../../../state/store";
import { CLEAR_STATE, INITIAL_NOTIFICATION } from "../../../types/constants";
import { NotificationSchema } from "../../../types/notification_schema";
import i18nLoader from "../../../utils/i18n";
import { getOrigin } from "../../../utils/request";
import { checkUser, getTags } from "../../../utils/serverside";
import Layout from "../../../components/common/Layout";
import Header from "../../../components/common/Header";
import Preview from "../../../components/notification/Preview";
import InfoFooter from "../../../components/notification/InfoFooter";
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
export const getServerSideProps: GetServerSideProps = async ({ req, res, resolvedUrl, params, locales }) => {
  const lngDict = await i18nLoader(locales);

  // Reset the notification details in the state
  const reduxStore = initStore();
  reduxStore.dispatch({ type: CLEAR_STATE });
  const initialReduxState = reduxStore.getState();

  const user = await checkUser(req, res, resolvedUrl, false);
  if (user) {
    initialReduxState.general.user = user;
  }

  initialReduxState.notification.notificationExtra.tagOptions = await getTags(req);

  // Try to fetch the notification details for the specified id
  if (params) {
    const { infoId } = params;
    const targetResponse = await fetch(`${getOrigin(req)}/api/notification/get/${infoId}/`, { headers: { cookie: req.headers.cookie as string } });

    if (targetResponse.ok) {
      const targetResult = await (targetResponse.json() as Promise<{ id: number; data: NotificationSchema }>);

      try {
        // Merge the notification details from the backend, but remove the previous notifier details if present
        // TODO - handle image base64 when implemented in backend
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
