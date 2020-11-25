import React, { ReactElement } from "react";
import dynamic from "next/dynamic";
import { useI18n } from "next-localization";
import styles from "./Map.module.scss";

const MapWrapper = dynamic(() => import("./MapWrapper"), { ssr: false });

const Map = (): ReactElement => {
  const i18n = useI18n();

  return (
    <div className="formSection">
      <h3>{i18n.t("notification.map.title")}</h3>
      <div className={styles.geocode}>
        <div>{i18n.t("notification.map.notice")}</div>
      </div>
      <MapWrapper />
    </div>
  );
};

export default Map;
