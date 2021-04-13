import React, { Dispatch, ChangeEvent, ReactElement, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { TextInput } from "hds-react";
import { NotificationAction, NotificationValidationAction } from "../../state/actions/types";
import { setNotificationAddress } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";
import { MAX_LENGTH, MAX_LENGTH_POSTAL_CODE } from "../../types/constants";
import { searchAddress } from "../../utils/address";
import { isAddressFieldValid } from "../../utils/validation";

const Location = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const dispatchValidation = useDispatch<Dispatch<NotificationValidationAction>>();
  const router = useRouter();

  const notification = useSelector((state: RootState) => state.notification.notification);
  const {
    address: {
      fi: { street: streetFi, postal_code: postalCodeFi, post_office: postOfficeFi, neighborhood: neighborhoodFi },
      sv: { street: streetSv, postal_code: postalCodeSv, post_office: postOfficeSv, neighborhood: neighborhoodSv },
    },
  } = notification;

  const notificationValidation = useSelector((state: RootState) => state.notificationValidation.notificationValidation);
  const {
    address: {
      fi: { street: streetFiValid, postal_code: postalCodeFiValid, post_office: postOfficeFiValid },
      sv: { street: streetSvValid, postal_code: postalCodeSvValid, post_office: postOfficeSvValid },
    },
  } = notificationValidation;

  const updateAddress = (language: string, evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setNotificationAddress(language, { [evt.target.name]: evt.target.value }));
  };

  const validateAddress = (language: string, evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setNotificationAddress(language, {
        [evt.target.name]: ((notification.address[language] as { [k: string]: unknown })[evt.target.name] as string).trim(),
      })
    );
    isAddressFieldValid(language, evt.target.name, notification, dispatchValidation);
  };

  useEffect(() => {
    const isAddressComplete =
      router.locale === "sv"
        ? streetSv.length > 0 &&
          streetSvValid.valid &&
          postalCodeSv.length > 0 &&
          postalCodeSvValid.valid &&
          postOfficeSv.length > 0 &&
          postOfficeSvValid.valid
        : streetFi.length > 0 &&
          streetFiValid.valid &&
          postalCodeFi.length > 0 &&
          postalCodeFiValid.valid &&
          postOfficeFi.length > 0 &&
          postOfficeFiValid.valid;

    // Search the address automatically when complete
    if (isAddressComplete) {
      searchAddress(router.locale, streetFi, postOfficeFi, streetSv, postOfficeSv, dispatch);
    }
  }, [
    router.locale,
    streetFi,
    postalCodeFi,
    postOfficeFi,
    streetSv,
    postalCodeSv,
    postOfficeSv,
    streetFiValid,
    postalCodeFiValid,
    postOfficeFiValid,
    streetSvValid,
    postalCodeSvValid,
    postOfficeSvValid,
    dispatch,
  ]);

  return (
    <div className="formSection">
      <h3>{i18n.t("notification.location.title")}</h3>
      {router.locale !== "sv" && (
        <>
          <TextInput
            id="streetAddressFi"
            className="formInput"
            label={i18n.t("notification.location.streetAddress.label")}
            name="street"
            value={streetFi}
            maxLength={MAX_LENGTH}
            onChange={(evt) => updateAddress("fi", evt)}
            onBlur={(evt) => validateAddress("fi", evt)}
            invalid={!streetFiValid.valid}
            errorText={
              !streetFiValid.valid
                ? i18n.t(streetFiValid.message as string).replace("$fieldName", i18n.t("notification.location.streetAddress.label"))
                : ""
            }
            required
            aria-required
          />
          <TextInput
            id="postalCodeFi"
            className="formInput"
            label={i18n.t("notification.location.postalCode.label")}
            name="postal_code"
            value={postalCodeFi}
            maxLength={MAX_LENGTH_POSTAL_CODE}
            onChange={(evt) => updateAddress("fi", evt)}
            onBlur={(evt) => validateAddress("fi", evt)}
            invalid={!postalCodeFiValid.valid}
            errorText={
              !postalCodeFiValid.valid
                ? i18n.t(postalCodeFiValid.message as string).replace("$fieldName", i18n.t("notification.location.postalCode.label"))
                : ""
            }
            required
            aria-required
          />
          <TextInput
            id="postalOfficeFi"
            className="formInput"
            label={i18n.t("notification.location.postalOffice.label")}
            name="post_office"
            value={postOfficeFi}
            maxLength={MAX_LENGTH}
            onChange={(evt) => updateAddress("fi", evt)}
            onBlur={(evt) => validateAddress("fi", evt)}
            invalid={!postOfficeFiValid.valid}
            errorText={
              !postOfficeFiValid.valid
                ? i18n.t(postOfficeFiValid.message as string).replace("$fieldName", i18n.t("notification.location.postalOffice.label"))
                : ""
            }
            required
            aria-required
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
            maxLength={MAX_LENGTH}
            onChange={(evt) => updateAddress("sv", evt)}
            onBlur={(evt) => validateAddress("sv", evt)}
            invalid={!streetSvValid.valid}
            errorText={
              !streetSvValid.valid
                ? i18n.t(streetSvValid.message as string).replace("$fieldName", i18n.t("notification.location.streetAddress.label"))
                : ""
            }
            required
            aria-required
          />
          <TextInput
            id="postalCodeSv"
            className="formInput"
            label={i18n.t("notification.location.postalCode.label")}
            name="postal_code"
            value={postalCodeSv}
            maxLength={MAX_LENGTH_POSTAL_CODE}
            onChange={(evt) => updateAddress("sv", evt)}
            onBlur={(evt) => validateAddress("sv", evt)}
            invalid={!postalCodeSvValid.valid}
            errorText={
              !postalCodeSvValid.valid
                ? i18n.t(postalCodeSvValid.message as string).replace("$fieldName", i18n.t("notification.location.postalCode.label"))
                : ""
            }
            required
            aria-required
          />
          <TextInput
            id="postalOfficeSv"
            className="formInput"
            label={i18n.t("notification.location.postalOffice.label")}
            name="post_office"
            value={postOfficeSv}
            maxLength={MAX_LENGTH}
            onChange={(evt) => updateAddress("sv", evt)}
            onBlur={(evt) => validateAddress("sv", evt)}
            invalid={!postOfficeSvValid.valid}
            errorText={
              !postOfficeSvValid.valid
                ? i18n.t(postOfficeSvValid.message as string).replace("$fieldName", i18n.t("notification.location.postalOffice.label"))
                : ""
            }
            required
            aria-required
          />
        </>
      )}

      {((router.locale === "sv" && neighborhoodSv) || neighborhoodFi) && (
        <div className="formInput">{`${i18n.t("notification.location.neighborhood.label")}: ${
          router.locale === "sv" ? neighborhoodSv : neighborhoodFi
        }`}</div>
      )}
    </div>
  );
};

export default Location;
