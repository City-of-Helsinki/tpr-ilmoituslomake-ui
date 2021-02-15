import React, { ReactElement } from "react";
import { useI18n } from "next-localization";
import { Footer as HdsFooter, IconArrowRight, IconArrowUp } from "hds-react";
import { ACCESSIBILITY_URL, CONTACT_URL, TERMS_URL } from "../../types/constants";
import styles from "./Footer.module.scss";

const Footer = (): ReactElement => {
  const i18n = useI18n();

  return (
    <HdsFooter korosType="basic" className={styles.footer} title={i18n.t("common.footer.title")}>
      <HdsFooter.Navigation variant="minimal">
        <HdsFooter.Item as="a" href={CONTACT_URL} label={i18n.t("common.footer.contact")} icon={<IconArrowRight />} />
        <HdsFooter.Item as="a" href="#content" label={i18n.t("common.footer.backToTop")} icon={<IconArrowUp />} />
      </HdsFooter.Navigation>
      <HdsFooter.Base copyrightHolder={i18n.t("common.footer.copyright")} copyrightText={i18n.t("common.footer.rightsReserved")}>
        <HdsFooter.Item as="a" href={TERMS_URL} label={i18n.t("common.footer.terms")} />
        <HdsFooter.Item as="a" href={ACCESSIBILITY_URL} label={i18n.t("common.footer.accessibility")} />
      </HdsFooter.Base>
    </HdsFooter>
  );
};

export default Footer;
