import React, { ReactElement } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useI18n } from "next-localization";
import { Link as HdsLink, LinkSize } from "hds-react";
import { RootState } from "../../state/reducers";
import styles from "./TipNotice.module.scss";

interface TipNoticeProps {
  selectedPlaceName: string;
}

const TipNotice = ({ selectedPlaceName }: TipNoticeProps): ReactElement => {
  const i18n = useI18n();
  const router = useRouter();

  const tip = useSelector((state: RootState) => state.notification.tip);
  const { target } = tip;

  return (
    <div className={styles.tipNotice}>
      <div className={styles.heading}>{i18n.t("notification.tip.loginNotice.title")}</div>
      <div className={styles.notice}>{i18n.t("notification.tip.loginNotice.notice")}</div>
      <div className={styles.link}>
        
          <HdsLink href={`${router.basePath}/notification/${target}`} size={LinkSize.Medium} disableVisitedStyles>
            {selectedPlaceName}
          </HdsLink>
        
      </div>
    </div>
  );
};

export default TipNotice;
