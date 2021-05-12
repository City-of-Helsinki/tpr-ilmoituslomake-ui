import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useI18n } from "next-localization";
import { Button, IconAngleRight } from "hds-react";
import { RootState } from "../../state/reducers";
import styles from "./TipNotice.module.scss";

interface TipNoticeProps {
  selectedPlaceName: string;
}

const TipNotice = ({ selectedPlaceName }: TipNoticeProps): ReactElement => {
  const i18n = useI18n();

  const tip = useSelector((state: RootState) => state.notification.tip);
  const { target } = tip;

  return (
    <div className={styles.tipNotice}>
      <div className={styles.heading}>{i18n.t("notification.tip.loginNotice.title")}</div>
      <div className={styles.notice}>{i18n.t("notification.tip.loginNotice.notice")}</div>
      <Link href={`/notification/${target}`}>
        <Button variant="supplementary" size="small" iconRight={<IconAngleRight aria-hidden />}>
          {selectedPlaceName}
        </Button>
      </Link>
    </div>
  );
};

export default TipNotice;
