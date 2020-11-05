import React, { ReactElement } from "react";
import { useI18n } from "next-localization";
import { Koros, Logo } from "hds-react";
import styles from "./Footer.module.scss";

const Footer = (): ReactElement => {
  const i18n = useI18n();

  return (
    <div className={styles.footer}>
      <Koros type="basic" className={styles.wave} />
      <div className={styles.content}>
        <Logo language="fi" size="small" className={styles.smallLogo} />
        <Logo language="fi" size="medium" className={styles.mediumLogo} />
        <Logo language="fi" size="large" className={styles.largeLogo} />
        <span className={styles.title}>{i18n.t("notification.title")}</span>
      </div>
    </div>
  );
};

export default Footer;
