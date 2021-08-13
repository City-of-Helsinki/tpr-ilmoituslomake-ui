import React, { ReactElement } from "react";
import { useI18n } from "next-localization";
import { Notification as HdsNotification } from "hds-react";
import styles from "./ValidationSummary.module.scss";

interface ValidationSummaryProps {
  prefix: string;
}

const ValidationSummary = ({ prefix }: ValidationSummaryProps): ReactElement => {
  const i18n = useI18n();

  return (
    <div className={styles.validationSummary}>
      <HdsNotification size="default" className="formNotification" type="error" label={i18n.t(`${prefix}.message.validationFailed.title`)}>
        {i18n.t(`${prefix}.message.validationFailed.message`)}
      </HdsNotification>
    </div>
  );
};

export default ValidationSummary;
