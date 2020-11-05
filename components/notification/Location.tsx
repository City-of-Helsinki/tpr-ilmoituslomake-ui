import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput } from "hds-react";
import { NotificationAction } from "../../state/actions/types";
import { setNotificationData } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";

const Location = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();

  const notification = useSelector((state: RootState) => state.notification.notification);
  const { street_address } = notification;

  const updateData = (evt: ChangeEvent<HTMLInputElement>) => {
    const newNotification = { ...notification, [evt.target.name]: evt.target.value };
    dispatch(setNotificationData(newNotification));
  };

  return (
    <div className="formSection">
      <h2>{i18n.t("notification.location.title")}</h2>
      <TextInput
        id="streetAddress"
        className="formInput"
        label={i18n.t("notification.location.streetAddress.label")}
        name="street_address"
        value={street_address}
        onChange={updateData}
        required
      />
      <TextInput id="postalCode" className="formInput" label={i18n.t("notification.location.postalCode.label")} required />
      <TextInput id="postalOffice" className="formInput" label={i18n.t("notification.location.postalOffice.label")} required />
    </div>
  );
};

export default Location;
