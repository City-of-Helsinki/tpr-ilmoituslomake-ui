import React, { ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput } from "hds-react";
import { RootState } from "../../state/reducers";
import Location from "./Location";

const Contact = (): ReactElement => {
  const i18n = useI18n();

  const currentPage = useSelector((state: RootState) => state.notification.page);

  return (
    <div>
      <h1>{`${currentPage} ${i18n.t("notification.contact.title")}`}</h1>

      <h2>{i18n.t("notification.contact.address.title")}</h2>
      <TextInput id="streetAddress" label={i18n.t("notification.contact.address.streetAddress")} required />
      <TextInput id="postalCode" label={i18n.t("notification.contact.address.postalCode")} required />
      <TextInput id="postalOffice" label={i18n.t("notification.contact.address.postalOffice")} required />

      <Location />

      <h2>{i18n.t("notification.contact.contact.title")}</h2>
      <TextInput id="phone" label={i18n.t("notification.contact.contact.phone")} />
      <TextInput id="email" label={i18n.t("notification.contact.contact.email")} />

      <h2>{i18n.t("notification.contact.link.title")}</h2>
      <TextInput id="website" label={i18n.t("notification.contact.link.website")} />
      <TextInput id="socialMedia" label={i18n.t("notification.contact.link.socialMedia")} />
    </div>
  );
};

export default Contact;
