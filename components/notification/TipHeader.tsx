import React, { ReactElement, RefObject } from "react";
import { useSelector } from "react-redux";
import { useI18n } from "next-localization";
import { RootState } from "../../state/reducers";
import styles from "./TipHeader.module.scss";

interface TipHeaderProps {
  headerRef: RefObject<HTMLHeadingElement>;
}

const TipHeader = ({ headerRef }: TipHeaderProps): ReactElement => {
  const i18n = useI18n();

  const tip = useSelector((state: RootState) => state.notification.tip);
  const { target } = tip;

  return (
    <div className={styles.tipHeader}>
      <h1 ref={headerRef}>{target > 0 ? i18n.t("notification.tip.title") : i18n.t("notification.tip.titleNew")}</h1>
    </div>
  );
};

export default TipHeader;
