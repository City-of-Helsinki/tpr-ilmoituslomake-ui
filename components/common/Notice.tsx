import React, { ReactElement, ReactNode } from "react";
import { useI18n } from "next-localization";
import styles from "./Notice.module.scss";

interface NoticeProps {
  className?: string;
  icon: ReactNode;
  titleKey?: string;
  messageKey: string;
  button?: ReactNode;
}

const Notice = ({ className, icon, titleKey, messageKey, button }: NoticeProps): ReactElement => {
  const i18n = useI18n();

  return (
    <div className={`gridLayoutContainer ${styles.notice} ${className}`}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.text}>
        <div className={styles.title}>{i18n.t(titleKey as string)}</div>
        <div className={styles.message}>{i18n.t(messageKey)}</div>
      </div>
      <div className={styles.gridButton}>{button}</div>
    </div>
  );
};

Notice.defaultProps = {
  className: undefined,
  titleKey: "",
  button: undefined,
};

export default Notice;
