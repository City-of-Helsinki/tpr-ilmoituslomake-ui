import React, { ReactElement } from "react";
import Link from "next/link";
import { Koros, Logo } from "hds-react";
import styles from "./Footer.module.scss";

const Footer = (): ReactElement => {
  return (
    <div className={styles.footer}>
      <Koros type="basic" className={styles.wave} />
      <Link href="/">
        <Logo language="fi" size="large" className={styles.content} />
      </Link>
    </div>
  );
};

export default Footer;
