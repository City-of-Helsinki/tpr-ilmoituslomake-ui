import React, { ReactElement, useLayoutEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useI18n } from "next-localization";
import i18nLoader, { defaultLocale } from "../../utils/i18n";
import { RootState } from "../../state/reducers";
import { initStore } from "../../state/store";
import Layout from "../../components/Layout";
import Header from "../../components/notification/Header";
import Footer from "../../components/notification/Footer";
import Comments from "../../components/notification/Comments";
import Contact from "../../components/notification/Contact";
import Description from "../../components/notification/Description";
import Links from "../../components/notification/Links";
import Location from "../../components/notification/Location";
import Map from "../../components/notification/Map";
import Notice from "../../components/notification/Notice";
import Notifier from "../../components/notification/Notifier";
import Opening from "../../components/notification/Opening";
import Payment from "../../components/notification/Payment";
import Photos from "../../components/notification/Photos";
import Preview from "../../components/notification/Preview";
import Prices from "../../components/notification/Prices";
import Tags from "../../components/notification/Tags";
import Terms from "../../components/notification/Terms";
import ValidationSummary from "../../components/notification/ValidationSummary";

const Notification = (): ReactElement => {
  const i18n = useI18n();

  const currentPage = useSelector((state: RootState) => state.notification.page);
  const pageValid = useSelector((state: RootState) => state.notificationValidation.pageValid);
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
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
      {currentPage === 1 && (
        <div id="content" ref={ref}>
          <h1>{`${currentPage} ${i18n.t("notification.main.basic")}`}</h1>
          <Notice messageKey="notification.mandatory" />
          {!pageValid && <ValidationSummary />}
          <Description />
          <Tags />
          <Notifier />
        </div>
      )}
      {currentPage === 2 && (
        <div id="content" ref={ref}>
          <h1>{`${currentPage} ${i18n.t("notification.main.contact")}`}</h1>
          <Notice messageKey="notification.mandatory" />
          {!pageValid && <ValidationSummary />}
          <Location />
          <Map />
          <Contact />
          <Links />
          <Opening />
        </div>
      )}
      {currentPage === 3 && (
        <div id="content" ref={ref}>
          <h1>{`${currentPage} ${i18n.t("notification.main.photos")}`}</h1>
          <Notice messageKey="notification.photos.notice" />
          {!pageValid && <ValidationSummary />}
          <Photos />
        </div>
      )}
      {currentPage === 4 && (
        <div id="content" ref={ref}>
          <h1>{`${currentPage} ${i18n.t("notification.main.payment")}`}</h1>
          <Notice messageKey="notification.mandatory" />
          <Prices />
          <Payment />
        </div>
      )}
      {currentPage === 5 && (
        <div id="content" ref={ref}>
          <h1>{`${currentPage} ${i18n.t("notification.main.send")}`}</h1>
          <Notice messageKey="notification.comments.notice" />
          <Terms />
          <Comments />
          <Preview />
        </div>
      )}
      <Footer />
    </Layout>
  );
};

// Server-side rendering
export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const lngDict = await i18nLoader(locale);

  const reduxStore = initStore();
  const initialReduxState = reduxStore.getState();
  initialReduxState.notification.notificationExtra.inputLanguages = [locale || defaultLocale];

  return {
    props: {
      initialReduxState,
      lngDict,
    },
  };
};

export default Notification;
