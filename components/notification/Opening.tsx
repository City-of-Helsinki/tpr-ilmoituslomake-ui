import React, { ReactElement } from "react";
import { useI18n } from "next-localization";
import { Notification as HdsNotification, IconClock } from "hds-react";
import styles from "./Opening.module.scss";

const Opening = (): ReactElement => {
  const i18n = useI18n();

  return (
    <div className={styles.opening}>
      <div className="hds-notification__label">
        <IconClock className={styles.icon} />
        {i18n.t("notification.opening.title")}
      </div>
      <div className={styles.notice}>{i18n.t("notification.opening.notice")}</div>
    </div>
  );
};

export default Opening;
