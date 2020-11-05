import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useI18n } from "next-localization";
import absoluteUrl from "next-absolute-url";
import i18nLoader from "../../utils/i18n";
import { setMessage } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";
import { initStore } from "../../state/store";
import Layout from "../../components/Layout";
import Header from "../../components/notification/Header";
import Footer from "../../components/notification/Footer";
import Contact from "../../components/notification/Contact";
import Description from "../../components/notification/Description";
import Links from "../../components/notification/Links";
import Location from "../../components/notification/Location";
import Map from "../../components/notification/Map";
import Notifier from "../../components/notification/Notifier";
import Opening from "../../components/notification/Opening";
import Payment from "../../components/notification/Payment";
import Photos from "../../components/notification/Photos";
// import PlaceType from "../../components/notification/PlaceType";
import Preview from "../../components/notification/Preview";
import Prices from "../../components/notification/Prices";
import Tags from "../../components/notification/Tags";

const Notification = (): ReactElement => {
  const i18n = useI18n();

  const currentPage = useSelector((state: RootState) => state.notification.page);

  return (
    <Layout>
      <Head>
        <title>{i18n.t("notification.title")}</title>
      </Head>
      <Header />
      {currentPage === 1 && (
        <div>
          <h1>{`${currentPage} ${i18n.t("notification.main.basic")}`}</h1>
          <Description />
          {/* <PlaceType /> */}
          <Tags />
          <Notifier />
        </div>
      )}
      {currentPage === 2 && (
        <div>
          <h1>{`${currentPage} ${i18n.t("notification.main.contact")}`}</h1>
          <Location />
          <Map />
          <Contact />
          <Links />
          <Opening />
        </div>
      )}
      {currentPage === 3 && (
        <div>
          <h1>{`${currentPage} ${i18n.t("notification.main.photos")}`}</h1>
          <Photos />
        </div>
      )}
      {currentPage === 4 && (
        <div>
          <h1>{`${currentPage} ${i18n.t("notification.main.payment")}`}</h1>
          <Prices />
          <Payment />
        </div>
      )}
      {currentPage === 5 && (
        <div>
          <h1>{`${currentPage} ${i18n.t("notification.main.send")}`}</h1>
          <Preview />
        </div>
      )}
      <Footer />
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
