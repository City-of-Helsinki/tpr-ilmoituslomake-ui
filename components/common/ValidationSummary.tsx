import React, { ReactElement, useEffect, useRef } from "react";
import { useI18n } from "next-localization";
import { Notification as HdsNotification } from "hds-react";
import styles from "./ValidationSummary.module.scss";

interface ValidationSummaryProps {
  prefix: string;
  pageValid: boolean;
}

const ValidationSummary = ({ prefix, pageValid }: ValidationSummaryProps): ReactElement => {
  const i18n = useI18n();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      window.scrollTo(0, 0);
      ref.current.scrollIntoView();
      ref.current.focus();
    }
  }, [pageValid]);

  return (
    <div className={styles.validationSummary} ref={ref} tabIndex={-1}>
      <HdsNotification size="default" className="formNotification" type="error" label={i18n.t(`${prefix}.message.validationFailed.title`)}>
        {i18n.t(`${prefix}.message.validationFailed.message`)}
      </HdsNotification>
    </div>
  );
};

export default ValidationSummary;
