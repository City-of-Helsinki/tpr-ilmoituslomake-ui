import React, { ReactElement } from "react";
import { useI18n } from "next-localization";
import { Button, IconLinkExternal } from "hds-react";
import styles from "./Terms.module.scss";

const Terms = (): ReactElement => {
  const i18n = useI18n();

  const openTermsOfUse = () => {
    window.open("https://www.myhelsinki.fi/fi/myhelsinki-places-palvelun-käyttöehdot/", "_blank");
  };

  return (
    <div className={styles.terms}>
      <div className="hds-notification__label">{i18n.t("notification.terms.heading")}</div>
      <div className={styles.notice}>
        <div>{i18n.t("notification.terms.text1")}</div>
        <Button variant="supplementary" size="small" className={styles.creativeCommonsLink} iconRight={<IconLinkExternal />} onClick={openTermsOfUse}>
          {i18n.t("notification.terms.link")}
        </Button>
        <div>{i18n.t("notification.terms.text2")}</div>
      </div>
    </div>
  );
};

export default Terms;
