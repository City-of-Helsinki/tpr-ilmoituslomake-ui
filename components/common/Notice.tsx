import React, { ReactElement, ReactNode, useEffect, useRef } from "react";
import { useI18n } from "next-localization";
import styles from "./Notice.module.scss";

interface NoticeProps {
  className?: string;
  icon: ReactNode;
  titleKey?: string;
  messageKey: string;
  messageKey2?: string;
  button?: ReactNode;
  focusOnTitle?: boolean;
}

const Notice = ({ className, icon, titleKey, messageKey, messageKey2, button, focusOnTitle }: NoticeProps): ReactElement => {
  const i18n = useI18n();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focusOnTitle && ref.current) {
      window.scrollTo(0, 0);
      ref.current.scrollIntoView();
      ref.current.focus();
    }
  });

  return (
    <div className={`${styles.notice} ${className}`}>
      <div className={styles.flexText}>
        <div className={styles.icon}>{icon}</div>
        <div className={styles.text}>
          <div className={styles.title} ref={focusOnTitle ? ref : undefined} tabIndex={focusOnTitle ? -1 : undefined}>
            {i18n.t(titleKey as string)}
          </div>
          <div className={styles.message}>{i18n.t(messageKey)}</div>
          {messageKey2 && <div className={styles.message2}>{i18n.t(messageKey2)}</div>}
        </div>
      </div>
      <div className={styles.flexButtonContainer}>
        <div className={styles.flexButton}>{button}</div>
      </div>
    </div>
  );
};

Notice.defaultProps = {
  className: undefined,
  titleKey: "",
  button: undefined,
  focusOnTitle: false,
};

export default Notice;
