import React, { ReactElement } from "react";
import { useI18n } from "next-localization";
import { Footer as HdsFooter } from "hds-react";
import styles from "./Footer.module.scss";

const Footer = (): ReactElement => {
  const i18n = useI18n();

  return (
    <div className={styles.footer}>
      <HdsFooter korosType="basic" className={styles.wave} title={i18n.t("notification.title")}>
        <HdsFooter.Utilities backToTopLabel={i18n.t("notification.footer.backToTop")} />
        <HdsFooter.Base copyrightHolder={i18n.t("notification.footer.copyright")} copyrightText={i18n.t("notification.footer.rightsReserved")} />
      </HdsFooter>
    </div>
  );
};

export default Footer;
