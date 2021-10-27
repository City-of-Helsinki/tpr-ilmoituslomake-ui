import React, { ReactElement } from "react";
import { useI18n } from "next-localization";
import { Koros } from "hds-react";
import styles from "./Intro.module.scss";

const Intro = (): ReactElement => {
  const i18n = useI18n();

  return (
    <div className="formSection">
      <div className={styles.intro}>
        <h1 className="translation">{i18n.t("translation.intro.title")}</h1>
        <div className="formInput">{i18n.t("translation.intro.info1")}</div>
        <div className="formInput">{i18n.t("translation.intro.info2")}</div>
        <div className="formInput">{i18n.t("translation.intro.info3")}</div>
      </div>
      <Koros className={styles.wave} type="basic" flipHorizontal />
    </div>
  );
};

export default Intro;
