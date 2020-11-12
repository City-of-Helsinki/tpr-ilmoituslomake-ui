import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useI18n } from "next-localization";
// import absoluteUrl from "next-absolute-url";
import { Notification as HdsNotification } from "hds-react";
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
import Notifier from "../../components/notification/Notifier";
import Opening from "../../components/notification/Opening";
import Payment from "../../components/notification/Payment";
import Photos from "../../components/notification/Photos";
// import PlaceType from "../../components/notification/PlaceType";
import Preview from "../../components/notification/Preview";
import Prices from "../../components/notification/Prices";
import Tags from "../../components/notification/Tags";
import Terms from "../../components/notification/Terms";

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
          <HdsNotification size="small" className="formNotification">
            {i18n.t("notification.mandatory")}
          </HdsNotification>
          <Description />
          {/* <PlaceType /> */}
          <Tags />
          <Notifier />
        </div>
      )}
      {currentPage === 2 && (
        <div>
          <h1>{`${currentPage} ${i18n.t("notification.main.contact")}`}</h1>
          <HdsNotification size="small" className="formNotification">
            {i18n.t("notification.mandatory")}
          </HdsNotification>
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
          <HdsNotification size="small" className="formNotification">
            {i18n.t("notification.photos.notice")}
          </HdsNotification>
          <Photos />
        </div>
      )}
      {currentPage === 4 && (
        <div>
          <h1>{`${currentPage} ${i18n.t("notification.main.payment")}`}</h1>
          <HdsNotification size="small" className="formNotification">
            {i18n.t("notification.mandatory")}
          </HdsNotification>
          <Prices />
          <Payment />
        </div>
      )}
      {currentPage === 5 && (
        <div>
          <h1>{`${currentPage} ${i18n.t("notification.main.send")}`}</h1>
          <HdsNotification size="small" className="formNotification">
            {i18n.t("notification.comments.notice")}
          </HdsNotification>
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
export const getServerSideProps: GetServerSideProps = async ({ req, locale }) => {
  const lngDict = await i18nLoader(locale);

  // const { origin } = absoluteUrl(req);
  // const origin = "http://tpr-ilmoituslomake";

  // const response = await fetch(`${origin}/api/hello`);
  // const hello = await response.json();

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
