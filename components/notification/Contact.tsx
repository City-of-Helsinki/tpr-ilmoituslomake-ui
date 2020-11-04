import React, { ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput } from "hds-react";
import { RootState } from "../../state/reducers";

const Contact = (): ReactElement => {
  const i18n = useI18n();

  return (
    <div>
      <h2>{i18n.t("notification.contact.title")}</h2>
      <TextInput id="phone" label={i18n.t("notification.contact.phone.label")} />
      <TextInput id="email" label={i18n.t("notification.contact.email.label")} />

      <h2>{i18n.t("notification.links.title")}</h2>
      <TextInput id="website" label={i18n.t("notification.links.website.label")} />
      <TextInput id="socialMedia" label={i18n.t("notification.links.socialMedia.label")} />
    </div>
  );
};

export default Contact;
