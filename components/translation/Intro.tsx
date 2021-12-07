import React, { ReactElement } from "react";
import { useI18n } from "next-localization";
import { Koros, Link as HdsLink } from "hds-react";
import { Email } from "react-obfuscate-email";
import { TRANSLATION_CONTACTS, TRANSLATION_GUIDE_URL } from "../../types/constants";
import styles from "./Intro.module.scss";

const Intro = (): ReactElement => {
  const i18n = useI18n();

  return (
    <div className="formSection">
      <div className={styles.intro}>
        <h1 className="translation">{i18n.t("translation.intro.title")}</h1>
        <div className="formInput">
          {i18n.t("translation.intro.info1")}
          <HdsLink
            href={TRANSLATION_GUIDE_URL}
            size="M"
            openInNewTab
            openInNewTabAriaLabel={i18n.t("common.opensInANewTab")}
            external
            openInExternalDomainAriaLabel={i18n.t("common.opensExternal")}
            disableVisitedStyles
          >
            {i18n.t("translation.intro.guide")}
          </HdsLink>
        </div>
        <div className="formInput">{i18n.t("translation.intro.info2")}</div>
        <div className="formInput">
          {i18n.t("translation.intro.info3")}
          {TRANSLATION_CONTACTS.map((contact, index) => {
            const key = `email_${index}`;
            return (
              <>
                {index > 0 ? ` ${i18n.t("translation.intro.or")} ` : ` `}
                <Email key={key} email={contact} />
              </>
            );
          })}
        </div>
      </div>
      <Koros className={styles.wave} type="basic" flipHorizontal />
    </div>
  );
};

export default Intro;
