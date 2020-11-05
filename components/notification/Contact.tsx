import React, { ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput } from "hds-react";
import { RootState } from "../../state/reducers";

const Contact = (): ReactElement => {
  const i18n = useI18n();

  return (
    <div className="formSection">
      <h2>{i18n.t("notification.contact.title")}</h2>
      <TextInput id="phone" className="formInput" label={i18n.t("notification.contact.phone.label")} />
      <TextInput id="email" className="formInput" label={i18n.t("notification.contact.email.label")} />
    </div>
  );
};

export default Contact;
