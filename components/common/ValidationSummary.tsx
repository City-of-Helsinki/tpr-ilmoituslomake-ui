import React, { ReactElement, useEffect, useRef } from "react";
import { useI18n } from "next-localization";
import { Link as HdsLink, Notification as HdsNotification } from "hds-react";
import { KeyValueValidation } from "../../types/general";
import styles from "./ValidationSummary.module.scss";

interface ValidationSummaryProps {
  prefix: string;
  pageValid: boolean;
  validationSummary: KeyValueValidation;
}

const ValidationSummary = ({ prefix, pageValid, validationSummary }: ValidationSummaryProps): ReactElement => {
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
        <div>{i18n.t(`${prefix}.message.validationFailed.message`)}</div>

        <div className={styles.linkContainer}>
          {Object.keys(validationSummary)
            .filter((key) => !validationSummary[key].valid)
            .map((key) => {
              return (
                <div key={key}>
                  <HdsLink href={`#${key}`} size="M" disableVisitedStyles>
                    {i18n.t(validationSummary[key].message as string).replace("$fieldName", validationSummary[key].fieldLabel as string)}
                  </HdsLink>
                </div>
              );
            })}
        </div>
      </HdsNotification>
    </div>
  );
};

export default ValidationSummary;
