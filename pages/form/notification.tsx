import React, { ReactElement } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import absoluteUrl from "next-absolute-url";
import Layout from "../../components/Layout";

interface NotificationProps {
  message: string;
}

const Notification = ({ message }: NotificationProps): ReactElement => {
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

  return {
    props: {
      message: hello.message,
    },
  };
};

export default Notification;
