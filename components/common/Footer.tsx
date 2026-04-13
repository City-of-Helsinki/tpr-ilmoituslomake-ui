import React, { ReactElement } from "react";
import { useI18n } from "next-localization";
import { Footer as HdsFooter, IconArrowRight, IconArrowUp, IconLinkExternal, Logo, logoFi } from "hds-react";
import { ACCESSIBILITY_URL, CONTACT_URL, TERMS_URL } from "../../types/constants";
import styles from "./Footer.module.scss";

const Footer = (): ReactElement => {
  const i18n = useI18n();

  return (
    <HdsFooter korosType="basic" className={styles.footer} title={i18n.t("common.footer.title")}>
      <HdsFooter.Navigation>
        <HdsFooter.Link as="a" href={CONTACT_URL} label={i18n.t("common.footer.contact")} icon={<IconArrowRight aria-hidden />} />
      </HdsFooter.Navigation>
      <HdsFooter.Base
        copyrightHolder={i18n.t("common.footer.copyright")}
        copyrightText={i18n.t("common.footer.rightsReserved")}
        logo={<Logo src={logoFi} size="medium" alt={i18n.t("common.header.titleAlt")} />}
        backToTopLabel={i18n.t("common.footer.backToTop")}
      >
        <HdsFooter.Link as="a" target="_blank" href={TERMS_URL} icon={<IconLinkExternal aria-hidden />} label={i18n.t("common.footer.terms")} />
        <HdsFooter.Link
          as="a"
          target="_blank"
          href={ACCESSIBILITY_URL}
          icon={<IconLinkExternal aria-hidden />}
          label={i18n.t("common.footer.accessibility")}
        />
      </HdsFooter.Base>
    </HdsFooter>
  );
};

export default Footer;
