import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useI18n } from "next-localization";
import { Button, IconLinkExternal } from "hds-react";
import { RootState } from "../../state/reducers";
import styles from "./InfoFooter.module.scss";

const InfoFooter = (): ReactElement => {
  const i18n = useI18n();

  const currentUser = useSelector((state: RootState) => state.general.user);
  const notificationId = useSelector((state: RootState) => state.notification.notificationId);

  return (
    <div className={styles.footer}>
      {currentUser?.authenticated && (
        <div className={styles.flexButton}>
          <Link href={`/notification/${notificationId}`}>
            <Button variant="secondary">{i18n.t("notification.button.modifyInformation")}</Button>
          </Link>
        </div>
      )}
      {!currentUser?.authenticated && (
        <div className={styles.flexButton}>
          <Link href="/tip">
            <Button variant="secondary" iconRight={<IconLinkExternal aria-hidden />}>
              {i18n.t("notification.button.modifyPlace")}
            </Button>
          </Link>
        </div>
      )}
      {/* NOTE: temporarily removed until external opening times application is ready
      <div className={styles.flexButton}>
        <Button variant="secondary" iconRight={<IconLinkExternal aria-hidden />}>
          {i18n.t("notification.button.modifyOpeningTimes")}
          <span className="screenReaderOnly"> {i18n.t("common.opensInANewTab")}</span>
        </Button>
      </div>
      */}
      <div className={styles.flexButton}>
        <Link href="/tip">
          <Button variant="secondary" iconRight={<IconLinkExternal aria-hidden />}>
            {i18n.t("notification.button.notifyClosingDown")}
          </Button>
        </Link>
      </div>
      <div className="flexSpace" />
      <div className={`${styles.flexButton} ${styles.returnButton}`}>
        <Link href="/search">
          <Button variant="secondary">{i18n.t("notification.button.return")}</Button>
        </Link>
      </div>
    </div>
  );
};

export default InfoFooter;
