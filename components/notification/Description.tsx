import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { TextInput, TextArea } from "hds-react";
import InputLanguage, { languageOptions } from "./InputLanguage";
import { NotificationAction } from "../../state/actions/types";
import { setNotificationData, setNotificationValidation } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";
import { MAX_LENGTH_SHORT_DESC, MIN_LENGTH_LONG_DESC, MAX_LENGTH_LONG_DESC } from "../../types/constants";

const Description = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const router = useRouter();

  // Fetch values from redux state
  const notification = useSelector((state: RootState) => state.notification.notification);
  const {
    name: placeName,
    description: { short: shortDesc, long: longDesc },
  } = notification;

  const notificationExtra = useSelector((state: RootState) => state.notification.notificationExtra);
  const { inputLanguages } = notificationExtra;

  const notificationValidation = useSelector((state: RootState) => state.notification.notificationValidation);
  const {
    name: nameValid,
    description: { short: shortDescValid, long: longDescValid },
  } = notificationValidation;

  // Functions for updating values in redux state
  const updateName = (evt: ChangeEvent<HTMLInputElement>) => {
    const newNotification = { ...notification, name: { ...placeName, [evt.target.name]: evt.target.value } };
    dispatch(setNotificationData(newNotification));
  };

  const updateShortDescription = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    const newNotification = {
      ...notification,
      description: { ...notification.description, short: { ...shortDesc, [evt.target.name]: evt.target.value } },
    };
    dispatch(setNotificationData(newNotification));
  };

  const updateLongDescription = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    const newNotification = {
      ...notification,
      description: { ...notification.description, long: { ...longDesc, [evt.target.name]: evt.target.value } },
    };
    dispatch(setNotificationData(newNotification));
  };

  // Functions for validating values and storing the results in redux state
  const validateName = (evt: ChangeEvent<HTMLInputElement>) => {
    const valid = evt.target.value.length > 0;
    const newValidation = { ...notificationValidation, name: { ...notificationValidation.name, [evt.target.name]: valid } };
    dispatch(setNotificationValidation(newValidation));
  };

  const validateShortDescription = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    const valid = evt.target.value.length > 0 && evt.target.value.length <= MAX_LENGTH_SHORT_DESC;
    const newValidation = {
      ...notificationValidation,
      description: { ...notificationValidation.description, short: { ...shortDescValid, [evt.target.name]: valid } },
    };
    dispatch(setNotificationValidation(newValidation));

    // Also update the long description if it's empty to help the user
    if ((longDesc[evt.target.name] as string).length === 0) {
      const newNotification = {
        ...notification,
        description: { ...notification.description, long: { ...longDesc, [evt.target.name]: evt.target.value } },
      };
      dispatch(setNotificationData(newNotification));

      const newValidationLong = {
        ...notificationValidation,
        description: { ...notificationValidation.description, long: { ...longDescValid, [evt.target.name]: valid } },
      };
      dispatch(setNotificationValidation(newValidationLong));
    }
  };

  const validateLongDescription = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    const valid = evt.target.value.length >= MIN_LENGTH_LONG_DESC && evt.target.value.length <= MAX_LENGTH_LONG_DESC;
    const newValidation = {
      ...notificationValidation,
      description: { ...notificationValidation.description, long: { ...longDescValid, [evt.target.name]: valid } },
    };
    dispatch(setNotificationValidation(newValidation));
  };

  return (
    <div className="formSection">
      <h2>{i18n.t("notification.description.title")}</h2>
      <InputLanguage />

      <div className={inputLanguages.length > 1 ? "languageSection" : ""}>
        {inputLanguages.length > 1 && <h3>{i18n.t("notification.description.placeName.label")}</h3>}
        {languageOptions.map((option) =>
          inputLanguages.includes(option) ? (
            <TextInput
              id={`placeName_${option}`}
              key={`placeName_${option}`}
              className="formInput"
              label={`${i18n.t("notification.description.placeName.label")} ${i18n.t(`notification.inputLanguage.${option}`)}`}
              name={option}
              value={placeName[option] as string}
              onChange={updateName}
              onBlur={validateName}
              invalid={!nameValid[option]}
              required={router.locale === option}
            />
          ) : null
        )}
      </div>

      <div className={inputLanguages.length > 1 ? "languageSection" : ""}>
        {inputLanguages.length > 1 && <h3>{i18n.t("notification.description.shortDescription.label")}</h3>}
        {languageOptions.map((option) =>
          inputLanguages.includes(option) ? (
            <TextArea
              id={`shortDescription_${option}`}
              key={`shortDescription_${option}`}
              className="formInput"
              rows={3}
              label={`${i18n.t("notification.description.shortDescription.label")} ${i18n.t(`notification.inputLanguage.${option}`)}`}
              name={option}
              value={shortDesc[option] as string}
              onChange={updateShortDescription}
              onBlur={validateShortDescription}
              helperText={i18n.t("notification.description.shortDescription.helperText")}
              tooltipLabel={i18n.t("notification.description.shortDescription.tooltipLabel")}
              tooltipText={i18n.t("notification.description.shortDescription.tooltipText")}
              invalid={!shortDescValid[option]}
              required={router.locale === option}
            />
          ) : null
        )}
      </div>

      <div className={inputLanguages.length > 1 ? "languageSection" : ""}>
        {inputLanguages.length > 1 && <h3>{i18n.t("notification.description.longDescription.label")}</h3>}
        {languageOptions.map((option) =>
          inputLanguages.includes(option) ? (
            <TextArea
              id={`longDescription_${option}`}
              key={`longDescription_${option}`}
              className="formInput"
              rows={6}
              label={`${i18n.t("notification.description.longDescription.label")} ${i18n.t(`notification.inputLanguage.${option}`)}`}
              name={option}
              value={longDesc[option] as string}
              onChange={updateLongDescription}
              onBlur={validateLongDescription}
              helperText={i18n.t("notification.description.longDescription.helperText")}
              invalid={!longDescValid[option]}
              required={router.locale === option}
            />
          ) : null
        )}
      </div>
    </div>
  );
};

export default Description;
