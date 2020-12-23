import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useI18n } from "next-localization";
import { Button, IconLinkExternal } from "hds-react";
import { RootState } from "../../state/reducers";
import styles from "./SentFooter.module.scss";

const SentFooter = (): ReactElement => {
  const i18n = useI18n();

  const notificationId = useSelector((state: RootState) => state.notification.notificationId);

  return (
    <div className={styles.footer}>
      <Link href={`/notification/${notificationId}`}>
        <Button variant="secondary">{i18n.t("notification.button.modifyInformation")}</Button>
      </Link>
      <Button variant="secondary" iconRight={<IconLinkExternal />}>
        {i18n.t("notification.button.modifyOpeningTimes")}
      </Button>
      <Button variant="secondary" iconRight={<IconLinkExternal />}>
        {i18n.t("notification.button.notifyClosingDown")}
      </Button>
      <div className="flexSpace" />
      <Link href="/">
        <Button variant="secondary">{i18n.t("notification.button.return")}</Button>
      </Link>
    </div>
  );
};

export default SentFooter;
