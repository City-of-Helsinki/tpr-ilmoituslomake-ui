import React, { ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput } from "hds-react";
import { RootState } from "../../state/reducers";

const Location = (): ReactElement => {
  const i18n = useI18n();

  return (
    <div>
      <h2>{i18n.t("notification.location.title")}</h2>
      <TextInput id="streetAddress" label={i18n.t("notification.location.streetAddress.label")} required />
      <TextInput id="postalCode" label={i18n.t("notification.location.postalCode.label")} required />
      <TextInput id="postalOffice" label={i18n.t("notification.location.postalOffice.label")} required />

      <h2>{i18n.t("notification.map.title")}</h2>
      <div>MAP TODO</div>
    </div>
  );
};

export default Location;
