import React, { ReactElement } from "react";
import { useI18n } from "next-localization";
import { Button, IconLinkExternal } from "hds-react";
import { TERMS_URL } from "../../types/constants";
import styles from "./Terms.module.scss";

const Terms = (): ReactElement => {
  const i18n = useI18n();

  const openTermsOfUse = () => {
    window.open(TERMS_URL, "_blank");
  };

  return (
    <div className="formSection">
      <div className={styles.terms}>
        <div className={styles.heading}>{i18n.t("notification.terms.heading")}</div>
        <div className={styles.notice}>
          <div>{i18n.t("notification.terms.text1")}</div>
          <Button
            variant="supplementary"
            size="small"
            className={styles.creativeCommonsLink}
            iconRight={<IconLinkExternal aria-hidden />}
            onClick={openTermsOfUse}
          >
            {i18n.t("notification.terms.link")}
            <span className="screenReaderOnly"> {i18n.t("common.opensInANewTab")}</span>
          </Button>
          <div>{i18n.t("notification.terms.text2")}</div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
