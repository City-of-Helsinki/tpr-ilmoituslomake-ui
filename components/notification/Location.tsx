import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput } from "hds-react";
import { NotificationAction } from "../../state/actions/types";
import { setNotificationData, setNotificationValidation } from "../../state/actions/notification";
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

  const notificationValidation = useSelector((state: RootState) => state.notification.notificationValidation);
  const {
    address: {
      fi: { street: streetFiValid = true, postal_code: postalCodeFiValid = true, post_office: postOfficeFiValid = true } = {},
      // sv: { street: streetSvValid = true, postal_code: postalCodeSvValid = true, post_office: postOfficeSvValid = true } = {},
    } = {},
  } = notificationValidation;

  const updateAddress = (evt: ChangeEvent<HTMLInputElement>) => {
    const newNotification = {
      ...notification,
      address: {
        ...notification.address,
        fi: { ...notification.address.fi, [evt.target.name]: evt.target.value },
        // sv: { ...notification.address.sv, [evt.target.name]: evt.target.value },
      },
    };
    dispatch(setNotificationData(newNotification));
  };

  const validateAddress = (evt: ChangeEvent<HTMLInputElement>) => {
    const valid = evt.target.value.length > 0;
    const newValidation = {
      ...notificationValidation,
      address: {
        ...notificationValidation.address,
        fi: { ...(notificationValidation.address ?? {}).fi, [evt.target.name]: valid },
        // sv: { ...(notificationValidation.address ?? {}).sv, [evt.target.name]: valid },
      },
    };
    dispatch(setNotificationValidation(newValidation));
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
        onBlur={validateAddress}
        invalid={!streetFiValid}
        required
      />
      <TextInput
        id="postalCode"
        className="formInput"
        label={i18n.t("notification.location.postalCode.label")}
        name="postal_code"
        value={postalCodeFi}
        onChange={updateAddress}
        onBlur={validateAddress}
        invalid={!postalCodeFiValid}
        required
      />
      <TextInput
        id="postalOffice"
        className="formInput"
        label={i18n.t("notification.location.postalOffice.label")}
        name="post_office"
        value={postOfficeFi}
        onChange={updateAddress}
        onBlur={validateAddress}
        invalid={!postOfficeFiValid}
        required
      />
    </div>
  );
};

export default Location;
