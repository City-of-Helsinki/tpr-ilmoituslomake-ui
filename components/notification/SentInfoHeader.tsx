import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button } from "hds-react";
import { RootState } from "../../state/reducers";
import { getDisplayName } from "../../utils/helper";
import { defaultLocale } from "../../utils/i18n";
import styles from "./SentInfoHeader.module.scss";

const SentInfoHeader = (): ReactElement => {
  const i18n = useI18n();
  const router = useRouter();

  const notification = useSelector((state: RootState) => state.notification.notification);
  const { name: placeName } = notification;

  return (
    <div className={styles.sentHeader}>
      <h1 tabIndex={-1}>{getDisplayName(router.locale || defaultLocale, placeName)}</h1>
      <div className={styles.flexButton}>
        <Link href="/notification">
          <Button variant="secondary">{i18n.t("notification.button.notifyNewPlace")}</Button>
        </Link>
      </div>
    </div>
  );
};

export default SentInfoHeader;
