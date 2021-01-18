import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useI18n } from "next-localization";
import { Button, IconLinkExternal } from "hds-react";
import { RootState } from "../../state/reducers";
import styles from "./InfoFooter.module.scss";

const InfoFooter = (): ReactElement => {
  const i18n = useI18n();

  const notificationId = useSelector((state: RootState) => state.notification.notificationId);

  return (
    <div className={`gridLayoutContainer ${styles.footer}`}>
      <div className={styles.gridButton}>
        <Link href={`/notification/${notificationId}`}>
          <Button variant="secondary">{i18n.t("notification.button.modifyInformation")}</Button>
        </Link>
      </div>
      <div className={styles.gridButton}>
        <Button variant="secondary" iconRight={<IconLinkExternal />}>
          {i18n.t("notification.button.modifyOpeningTimes")}
        </Button>
      </div>
      <div className={`${styles.gridButton} ${styles.closingDownButton}`}>
        <Button variant="secondary" iconRight={<IconLinkExternal />}>
          {i18n.t("notification.button.notifyClosingDown")}
        </Button>
      </div>
      <div className={`${styles.gridButton} ${styles.returnButton}`}>
        <Link href="/search">
          <Button variant="secondary">{i18n.t("notification.button.return")}</Button>
        </Link>
      </div>
    </div>
  );
};

export default InfoFooter;
