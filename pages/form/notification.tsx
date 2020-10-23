import React, { ReactElement } from "react";
import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";

const Notification = (): ReactElement => {
  return (
    <Layout>
      <Head>
        <title>NOTIFICATION</title>
      </Head>
      <div>
        <span>NOTIFICATION</span>
      </div>
      <div>
        <Link href="/">HOME</Link>
      </div>
    </Layout>
  );
};

export default Notification;
