import React, { ReactElement } from "react";
import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";

const Moderation = (): ReactElement => {
  return (
    <Layout>
      <Head>
        <title>MODERATION</title>
      </Head>
      <div>
        <span>MODERATION</span>
      </div>
      <div>
        <Link href="/">HOME</Link>
      </div>
    </Layout>
  );
};

export default Moderation;
