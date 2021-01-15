import React, { ReactElement } from "react";
import { useI18n } from "next-localization";
import styles from "./NotificationNotice.module.scss";

interface NoticeProps {
  messageKey: string;
  messageKey2?: string;
}

const NotificationNotice = ({ messageKey, messageKey2 }: NoticeProps): ReactElement => {
  const i18n = useI18n();

  return (
    <div className={styles.notice}>
      {i18n.t(messageKey)}
      {messageKey2 && (
        <>
          <br />
          <br />
        </>
      )}
      {messageKey2 && i18n.t(messageKey2)}
    </div>
  );
};

NotificationNotice.defaultProps = {
  messageKey2: undefined,
};

export default NotificationNotice;
