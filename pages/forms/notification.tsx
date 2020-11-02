import React, { Dispatch, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useI18n } from "next-localization";
import absoluteUrl from "next-absolute-url";
import i18nLoader from "../../utils/i18n";
import { NotificationAction } from "../../state/actions/types";
import { setMessage } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";
import { initStore } from "../../state/store";
import Layout from "../../components/Layout";
import Header from "../../components/notification/Header";
import Footer from "../../components/notification/Footer";
import Contact from "../../components/notification/Contact";
import Description from "../../components/notification/Description";
import Notifier from "../../components/notification/Notifier";
import Opening from "../../components/notification/Opening";
import Photos from "../../components/notification/Photos";

interface NotificationProps {
  message: string;
}

const Notification = ({ message }: NotificationProps): ReactElement => {
  const i18n = useI18n();

  /*
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const handleMessage = () => dispatch(setMessage({ text: `test message set at ${new Date().toLocaleString("fi-FI")}` }));
  const message2 = useSelector((state: RootState) => state.notification.message.text);
  */

  const currentPage = useSelector((state: RootState) => state.notification.page);

  return (
    <Layout>
      <Head>
        <title>{i18n.t("notification.title")}</title>
      </Head>
      <Header />
      {currentPage === 1 && <Description />}
      {currentPage === 2 && <Contact />}
      {currentPage === 3 && <Opening />}
      {currentPage === 4 && <Photos />}
      {currentPage === 5 && <Notifier />}
      <Footer />
      {/*
      <br />
      <br />
      <br />
      <div>TEST</div>
      <div>
        <span>{message}</span>
      </div>
      <div>
        <button type="button" onClick={handleMessage}>
          Message
        </button>
        <span>{message2}</span>
      </div>
      */}
    </Layout>
  );
};

// Server-side rendering
export const getServerSideProps: GetServerSideProps = async ({ req, locale }) => {
  const lngDict = await i18nLoader(locale);

  const { origin } = absoluteUrl(req);

  const response = await fetch(`${origin}/backend/api/hello`);
  const hello = await response.json();

  const reduxStore = initStore();
  const { dispatch } = reduxStore;
  dispatch(setMessage({ text: `SSR got message ${hello.message} at ${new Date().toLocaleString("fi-FI")}` }));

  return {
    props: {
      initialReduxState: reduxStore.getState(),
      lngDict,
      message: hello.message,
    },
  };
};

export default Notification;
