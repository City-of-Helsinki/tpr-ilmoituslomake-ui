import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { TextInput, Button } from "hds-react";
import { NotificationAction, NotificationValidationAction } from "../../state/actions/types";
import { setNotificationAddress, setNotificationLocation } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";
import { SEARCH_URL } from "../../types/constants";
import { isAddressFieldValid } from "../../utils/validation";

const Location = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const dispatchValidation = useDispatch<Dispatch<NotificationValidationAction>>();
  const router = useRouter();

  const notification = useSelector((state: RootState) => state.notification.notification);
  const {
    address: {
      fi: { street: streetFi, postal_code: postalCodeFi, post_office: postOfficeFi },
      sv: { street: streetSv, postal_code: postalCodeSv, post_office: postOfficeSv },
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
    isAddressFieldValid(language, evt.target.name, notification, dispatchValidation);
  };

  const geocodeAddress = async () => {
    // The Helsinki API does not use postal code
    const input = router.locale === "sv" ? `${streetSv} ${postOfficeSv}` : `${streetFi} ${postOfficeFi}`;
    const language = router.locale === "sv" ? "sv" : "fi";

    const geocodeResponse = await fetch(`${SEARCH_URL}&type=address&input=${input}&language=${language}`);
    if (geocodeResponse.ok) {
      const geocodeResult = await geocodeResponse.json();

      console.log("GEOCODE RESPONSE", geocodeResult);

      if (geocodeResult.results && geocodeResult.results.length > 0) {
        // Use the first result
        const { location: resultLocation } = geocodeResult.results[0];
        console.log(resultLocation.coordinates);

        // Set the location in redux state using the geocoded position
        // Note: this will cause the map to pan to centre on these coordinates
        // The geocoder returns the coordinates as lon,lat but Leaflet needs them as lat,lon
        dispatch(setNotificationLocation([resultLocation.coordinates[1], resultLocation.coordinates[0]]));
      }
    }
  };

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
            onChange={(evt) => updateAddress("fi", evt)}
            onBlur={(evt) => validateAddress("fi", evt)}
            invalid={!streetFiValid.valid}
            errorText={
              !streetFiValid.valid
                ? i18n.t(streetFiValid.message as string).replace("$fieldName", i18n.t("notification.location.streetAddress.label"))
                : ""
            }
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
            invalid={!postalCodeFiValid.valid}
            errorText={
              !postalCodeFiValid.valid
                ? i18n.t(postalCodeFiValid.message as string).replace("$fieldName", i18n.t("notification.location.postalCode.label"))
                : ""
            }
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
            invalid={!postOfficeFiValid.valid}
            errorText={
              !postOfficeFiValid.valid
                ? i18n.t(postOfficeFiValid.message as string).replace("$fieldName", i18n.t("notification.location.postalOffice.label"))
                : ""
            }
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
            invalid={!streetSvValid.valid}
            errorText={
              !streetSvValid.valid
                ? i18n.t(streetSvValid.message as string).replace("$fieldName", i18n.t("notification.location.streetAddress.label"))
                : ""
            }
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
            invalid={!postalCodeSvValid.valid}
            errorText={
              !postalCodeSvValid.valid
                ? i18n.t(postalCodeSvValid.message as string).replace("$fieldName", i18n.t("notification.location.postalCode.label"))
                : ""
            }
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
            invalid={!postOfficeSvValid.valid}
            errorText={
              !postOfficeSvValid.valid
                ? i18n.t(postOfficeSvValid.message as string).replace("$fieldName", i18n.t("notification.location.postalOffice.label"))
                : ""
            }
            required
          />
        </>
      )}
      <Button variant="secondary" onClick={geocodeAddress}>
        {i18n.t("notification.map.geocode")}
      </Button>
    </div>
  );
};

export default Location;
