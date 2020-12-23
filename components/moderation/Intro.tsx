import React, { ReactElement } from "react";
import Link from "next/link";
import { useI18n } from "next-localization";
import { Button, IconPlus, Koros } from "hds-react";
import styles from "./Intro.module.scss";

const Intro = (): ReactElement => {
  const i18n = useI18n();

  return (
    <div className="formSection">
      <div className={styles.intro}>
        <h1>{i18n.t("moderation.intro.title")}</h1>
        <div className="formInput">{i18n.t("general.todo")}</div>
        <Link href="/moderation/place">
          <Button className={styles.primary}>{i18n.t("moderation.button.allPlaces")}</Button>
        </Link>
        <Link href="/notification">
          <Button className={styles.primary} iconLeft={<IconPlus />}>
            {i18n.t("moderation.button.addNewPlace")}
          </Button>
        </Link>
      </div>
      <Koros className={styles.wave} type="basic" flipHorizontal />
    </div>
  );
};

export default Intro;
