import React, { ReactElement } from "react";
import { useI18n } from "next-localization";
import { IconClock } from "hds-react";
import styles from "./Opening.module.scss";

interface OpeningProps {
  temporaryNotice?: boolean;
}

const Opening = ({ temporaryNotice }: OpeningProps): ReactElement => {
  const i18n = useI18n();

  return (
    <div className={styles.opening}>
      <div className={`hds-notification__label ${styles.header}`}>
        <IconClock className={styles.icon} />
        {i18n.t("notification.opening.title")}
      </div>
      <div className={styles.notice}>{temporaryNotice ? i18n.t("notification.opening.temporaryNotice") : i18n.t("notification.opening.notice")}</div>
    </div>
  );
};

Opening.defaultProps = {
  temporaryNotice: false,
};

export default Opening;
