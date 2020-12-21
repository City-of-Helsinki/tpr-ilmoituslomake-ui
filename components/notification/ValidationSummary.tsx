import React, { ReactElement } from "react";
import { useI18n } from "next-localization";
import { Notification as HdsNotification } from "hds-react";
import styles from "./ValidationSummary.module.scss";

const ValidationSummary = (): ReactElement => {
  const i18n = useI18n();

  return (
    <div className={styles.validationSummary}>
      <HdsNotification size="default" className="formNotification" type="error" label={i18n.t(`notification.message.validationFailed.title`)}>
        {i18n.t(`notification.message.validationFailed.message`)}
      </HdsNotification>
    </div>
  );
};

export default ValidationSummary;
