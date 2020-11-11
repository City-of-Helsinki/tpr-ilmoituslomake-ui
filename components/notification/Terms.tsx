import React, { ReactElement } from "react";
import { useI18n } from "next-localization";
import { Card } from "hds-react";
import styles from "./Terms.module.scss";

const Terms = (): ReactElement => {
  const i18n = useI18n();

  return <Card className={styles.terms} heading={i18n.t("notification.terms.heading")} text={i18n.t("notification.terms.text")} />;
};

export default Terms;
