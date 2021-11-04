import React, { ReactElement } from "react";
import { useI18n } from "next-localization";
import { Link as HdsLink } from "hds-react";
import { TERMS_URL } from "../../types/constants";
import styles from "./Terms.module.scss";

const Terms = (): ReactElement => {
  const i18n = useI18n();

  return (
    <div className="formSection">
      <div className={styles.terms}>
        <div className={styles.heading}>{i18n.t("notification.terms.heading")}</div>
        <div className={styles.notice}>
          <div>{i18n.t("notification.terms.text1")}</div>
          <div className={styles.creativeCommonsLink}>
            <HdsLink
              href={TERMS_URL}
              size="M"
              openInNewTab
              openInNewTabAriaLabel={i18n.t("common.opensInANewTab")}
              external
              openInExternalDomainAriaLabel={i18n.t("common.opensExternal")}
              disableVisitedStyles
            >
              {i18n.t("notification.index.terms")}
            </HdsLink>
          </div>
          <div>{i18n.t("notification.terms.text2")}</div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
