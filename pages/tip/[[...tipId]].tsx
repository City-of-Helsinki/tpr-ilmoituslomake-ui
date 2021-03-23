import React, { ReactElement, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useI18n } from "next-localization";
import { RootState } from "../../state/reducers";
import { initStore } from "../../state/store";
import { CLEAR_STATE } from "../../types/constants";
import { NotificationSchema } from "../../types/notification_schema";
import i18nLoader from "../../utils/i18n";
import { checkUser, getOriginServerSide } from "../../utils/serverside";
import Layout from "../../components/common/Layout";
import Header from "../../components/common/Header";
import NotificationNotice from "../../components/notification/NotificationNotice";
import TipSearch from "../../components/notification/TipSearch";
import TipDetails from "../../components/notification/TipDetails";
import TipFooter from "../../components/notification/TipFooter";
import ValidationSummary from "../../components/notification/ValidationSummary";
import styles from "./[[...tipId]].module.scss";

// Note: The tip type selector has an attribute that uses a media query which does not work when server-side rendering
const DynamicTipType = dynamic(() => import("../../components/notification/TipType"), { ssr: false });

const Tip = (): ReactElement => {
  const i18n = useI18n();

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
      <Header />
      <div className={styles.header}>
        <h1>{i18n.t("notification.tip.title")}</h1>
      </div>
      <main id="content" className={`narrowSection ${styles.content}`} ref={ref}>
        <NotificationNotice messageKey="notification.mandatory" />
        {!pageValid && <ValidationSummary />}
        <DynamicTipType />
        <TipSearch />
        <TipDetails />
        <TipFooter />
      </main>
    </Layout>
  );
};

// Server-side rendering
export const getServerSideProps: GetServerSideProps = async ({ req, params, locale, locales }) => {
  const lngDict = await i18nLoader(locales);

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

  // Try to fetch the notification details for the specified id
  if (params) {
    const { tipId } = params;

    if (tipId) {
      const targetResponse = await fetch(`${getOriginServerSide()}/api/notification/get/${tipId}/`, {
        headers: { cookie: req.headers.cookie as string },
      });

      if (targetResponse.ok) {
        const targetResult = await (targetResponse.json() as Promise<{ id: number; data: NotificationSchema }>);

        try {
          // The notification exists in the backend, so set the tip target id in the state
          // This will be used to pre-select the place in TipSearch via the preselectPlaceOnMount method
          initialReduxState.notification = {
            ...initialReduxState.notification,
            tip: {
              ...initialReduxState.notification.tip,
              target: targetResult.id,
            },
          };
        } catch (err) {
          console.log("ERROR", err);
        }
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

export default Tip;