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
  const {
    address: {
      fi: { street: streetFi, postal_code: postalCodeFi, post_office: postOfficeFi },
      // sv: { street: streetSv, postal_code: postalCodeSv, post_office: postOfficeSv },
    },
  } = notification;

  const updateAddress = (evt: ChangeEvent<HTMLInputElement>) => {
    const newNotification = {
      ...notification,
      address: {
        ...notification.address,
        fi: { ...notification.address.fi, [evt.target.name]: evt.target.value },
        sv: { ...notification.address.sv, [evt.target.name]: evt.target.value },
      },
    };
    dispatch(setNotificationData(newNotification));
  };

  return (
    <div className="formSection">
      <h2>{i18n.t("notification.location.title")}</h2>
      <TextInput
        id="streetAddress"
        className="formInput"
        label={i18n.t("notification.location.streetAddress.label")}
        name="street"
        value={streetFi}
        onChange={updateAddress}
        required
      />
      <TextInput
        id="postalCode"
        className="formInput"
        label={i18n.t("notification.location.postalCode.label")}
        name="postal_code"
        value={postalCodeFi}
        onChange={updateAddress}
        required
      />
      <TextInput
        id="postalOffice"
        className="formInput"
        label={i18n.t("notification.location.postalOffice.label")}
        name="post_office"
        value={postOfficeFi}
        onChange={updateAddress}
        required
      />
    </div>
  );
};

export default Location;
