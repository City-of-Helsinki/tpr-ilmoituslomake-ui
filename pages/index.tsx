import React, { ReactElement } from "react";
import Head from "next/head";
import Link from "next/link";
import Layout from "../components/Layout";

const Main = (): ReactElement => {
  return (
    <Layout>
      <Head>
        <title>TITLE</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>HOME</div>
      <div>
        <Link href="/form/notification">NOTIFICATION</Link>
      </div>
      <div>
        <Link href="/form/moderation">MODERATION</Link>
      </div>
    </Layout>
  );
};

export default Main;
