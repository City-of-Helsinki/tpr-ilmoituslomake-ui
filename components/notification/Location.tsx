import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { TextInput } from "hds-react";
import { NotificationAction } from "../../state/actions/types";
import { setNotificationData, setNotificationValidation } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";

const Location = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const router = useRouter();

  const notification = useSelector((state: RootState) => state.notification.notification);
  const {
    address: {
      fi: { street: streetFi, postal_code: postalCodeFi, post_office: postOfficeFi },
      sv: { street: streetSv, postal_code: postalCodeSv, post_office: postOfficeSv },
    },
  } = notification;

  const notificationValidation = useSelector((state: RootState) => state.notification.notificationValidation);
  const {
    address: {
      fi: { street: streetFiValid = true, postal_code: postalCodeFiValid = true, post_office: postOfficeFiValid = true } = {},
      sv: { street: streetSvValid = true, postal_code: postalCodeSvValid = true, post_office: postOfficeSvValid = true } = {},
    } = {},
  } = notificationValidation;

  const updateAddress = (language: string, evt: ChangeEvent<HTMLInputElement>) => {
    const { fi, sv } = notification.address;
    const newNotification = {
      ...notification,
      address: {
        ...notification.address,
        [language]: { ...(language === "sv" ? sv : fi), [evt.target.name]: evt.target.value },
      },
    };
    dispatch(setNotificationData(newNotification));
  };

  const validateAddress = (language: string, evt: ChangeEvent<HTMLInputElement>) => {
    const valid = evt.target.value.length > 0;
    const { fi, sv } = notificationValidation.address ?? {};
    const newValidation = {
      ...notificationValidation,
      address: {
        ...notificationValidation.address,
        [language]: { ...(language === "sv" ? sv : fi), [evt.target.name]: valid },
      },
    };
    dispatch(setNotificationValidation(newValidation));
  };

  return (
    <div className="formSection">
      <h2>{i18n.t("notification.location.title")}</h2>
      {router.locale !== "sv" && (
        <>
          <TextInput
            id="streetAddressFi"
            className="formInput"
            label={i18n.t("notification.location.streetAddress.label")}
            name="street"
            value={streetFi}
            onChange={(evt) => updateAddress("fi", evt)}
            onBlur={(evt) => validateAddress("fi", evt)}
            invalid={!streetFiValid}
            required
          />
          <TextInput
            id="postalCodeFi"
            className="formInput"
            label={i18n.t("notification.location.postalCode.label")}
            name="postal_code"
            value={postalCodeFi}
            onChange={(evt) => updateAddress("fi", evt)}
            onBlur={(evt) => validateAddress("fi", evt)}
            invalid={!postalCodeFiValid}
            required
          />
          <TextInput
            id="postalOfficeFi"
            className="formInput"
            label={i18n.t("notification.location.postalOffice.label")}
            name="post_office"
            value={postOfficeFi}
            onChange={(evt) => updateAddress("fi", evt)}
            onBlur={(evt) => validateAddress("fi", evt)}
            invalid={!postOfficeFiValid}
            required
          />
        </>
      )}
      {router.locale === "sv" && (
        <>
          <TextInput
            id="streetAddressSv"
            className="formInput"
            label={i18n.t("notification.location.streetAddress.label")}
            name="street"
            value={streetSv}
            onChange={(evt) => updateAddress("sv", evt)}
            onBlur={(evt) => validateAddress("sv", evt)}
            invalid={!streetSvValid}
            required
          />
          <TextInput
            id="postalCodeSv"
            className="formInput"
            label={i18n.t("notification.location.postalCode.label")}
            name="postal_code"
            value={postalCodeSv}
            onChange={(evt) => updateAddress("sv", evt)}
            onBlur={(evt) => validateAddress("sv", evt)}
            invalid={!postalCodeSvValid}
            required
          />
          <TextInput
            id="postalOfficeSv"
            className="formInput"
            label={i18n.t("notification.location.postalOffice.label")}
            name="post_office"
            value={postOfficeSv}
            onChange={(evt) => updateAddress("sv", evt)}
            onBlur={(evt) => validateAddress("sv", evt)}
            invalid={!postOfficeSvValid}
            required
          />
        </>
      )}
    </div>
  );
};

export default Location;
