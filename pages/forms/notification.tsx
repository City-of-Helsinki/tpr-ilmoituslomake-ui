import React, { Dispatch, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import absoluteUrl from "next-absolute-url";
import { NotificationAction } from "../../state/actions/types";
import { setMessage } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";
import { initStore } from "../../state/store";
import Layout from "../../components/Layout";

interface NotificationProps {
  message: string;
}

const Notification = ({ message }: NotificationProps): ReactElement => {
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const handleMessage = () => dispatch(setMessage({ text: `test message set at ${new Date().toLocaleString("fi-FI")}` }));
  const message2 = useSelector((state: RootState) => state.notification.message.text);

  return (
    <Layout>
      <Head>
        <title>NOTIFICATION</title>
      </Head>
      <div>
        <span>NOTIFICATION</span>
      </div>
      <div>
        <span>{message}</span>
      </div>
      <div>
        <button type="button" onClick={handleMessage}>
          Message
        </button>
        <span>{message2}</span>
      </div>
      <div>
        <Link href="/">HOME</Link>
      </div>
    </Layout>
  );
};

// Server-side rendering
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const { origin } = absoluteUrl(req);

  const response = await fetch(`${origin}/backend/api/hello`);
  const hello = await response.json();

  const reduxStore = initStore();
  const { dispatch } = reduxStore;
  dispatch(setMessage({ text: `SSR got message ${hello.message} at ${new Date().toLocaleString("fi-FI")}` }));

  return {
    props: {
      initialReduxState: reduxStore.getState(),
      message: hello.message,
    },
  };
};

export default Notification;
