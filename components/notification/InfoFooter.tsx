import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useI18n } from "next-localization";
import { Button } from "hds-react";
import { RootState } from "../../state/reducers";
import styles from "./InfoFooter.module.scss";

interface InfoFooterProps {
  isEditingAllowed?: boolean;
}

const InfoFooter = ({ isEditingAllowed }: InfoFooterProps): ReactElement => {
  const i18n = useI18n();

  const currentUser = useSelector((state: RootState) => state.general.user);
  const notificationId = useSelector((state: RootState) => state.notification.notificationId);

  return (
    <div className={styles.footer}>
      {currentUser?.authenticated && isEditingAllowed && (
        <div className={styles.flexButton}>
          <Link href={`/notification/${notificationId}`}>
            <Button variant="secondary">{i18n.t("notification.button.modifyInformation")}</Button>
          </Link>
        </div>
      )}
      {!currentUser?.authenticated && isEditingAllowed && (
        <div className={styles.flexButton}>
          <Link href={`/tip/${notificationId}`}>
            <Button variant="secondary">{i18n.t("notification.button.suggestChange")}</Button>
          </Link>
        </div>
      )}
      {/* NOTE: temporarily removed until external opening times application is ready
      {isEditingAllowed && (
        <div className={styles.flexButton}>
          <Button variant="secondary" iconRight={<IconLinkExternal aria-hidden />} onClick={openExternalOpeningTimesApp}>
            {i18n.t("notification.button.modifyOpeningTimes")}
            <span className="screenReaderOnly"> {i18n.t("common.opensInANewTab")}</span>
          </Button>
        </div>
      )}
      */}
      {isEditingAllowed && (
        <div className={styles.flexButton}>
          <Link href={`/tip/${notificationId}`}>
            <Button variant="secondary">{i18n.t("notification.button.notifyClosingDown")}</Button>
          </Link>
        </div>
      )}
      <div className="flexSpace" />
      <div className={`${styles.flexButton} ${styles.returnButton}`}>
        <Link href="/search">
          <Button variant="secondary">{i18n.t("notification.button.close")}</Button>
        </Link>
      </div>
    </div>
  );
};

InfoFooter.defaultProps = {
  isEditingAllowed: true,
};

export default InfoFooter;
