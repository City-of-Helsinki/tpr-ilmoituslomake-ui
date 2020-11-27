import React, { ReactElement } from "react";
import Link from "next/link";
import { useI18n } from "next-localization";
import { Button, IconArrowRight, IconGroup } from "hds-react";
import styles from "./TranslationNotice.module.scss";

const TranslationNotice = (): ReactElement => {
  const i18n = useI18n();

  return (
    <div>
      <h3>{i18n.t("moderation.translationNotice.title")}</h3>
      <div className={styles.notice}>
        <IconGroup size="xl" />
        <div className="flexSpace" />
        <div>TEXT HERE</div>
        <div className="flexSpace" />
        <Link href="/moderation/translation">
          <Button variant="secondary" iconLeft={<IconArrowRight />}>
            {i18n.t("moderation.translationNotice.manageTranslation")}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default TranslationNotice;
