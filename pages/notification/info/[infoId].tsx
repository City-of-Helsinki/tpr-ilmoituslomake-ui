import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { RootState } from "../../../state/reducers";
import { initStore } from "../../../state/store";
import { CLEAR_STATE, INITIAL_NOTIFICATION } from "../../../types/constants";
import { NotificationSchema } from "../../../types/notification_schema";
import { getDisplayName } from "../../../utils/helper";
import i18nLoader, { defaultLocale } from "../../../utils/i18n";
import { checkUser, getOriginServerSide, getPreviousInputLanguages, getTags } from "../../../utils/serverside";
import Layout from "../../../components/common/Layout";
import Header from "../../../components/common/Header";
import Preview from "../../../components/notification/Preview";
import InfoFooter from "../../../components/notification/InfoFooter";
import styles from "./[infoId].module.scss";

const Info = (): ReactElement => {
  const i18n = useI18n();
  const router = useRouter();

  const notificationId = useSelector((state: RootState) => state.notification.notificationId);
  const notification = useSelector((state: RootState) => state.notification.notification);
  const { name: placeName } = notification;

  return (
    <Layout>
      <Head>
        <title>{i18n.t("notification.title")}</title>
      </Head>
      <Header />
      {notificationId > 0 && (
        <main id="content" className={styles.content}>
          <h1>{getDisplayName(router.locale || defaultLocale, placeName)}</h1>

          <InfoFooter />
          <Preview full={false} />
          <InfoFooter />
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
    const { infoId } = params;
    const targetResponse = await fetch(`${getOriginServerSide()}/api/notification/get/${infoId}/`, {
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
