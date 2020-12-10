import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { TextInput, TextArea } from "hds-react";
import InputLanguage from "./InputLanguage";
import { NotificationAction, NotificationValidationAction } from "../../state/actions/types";
import { setNotificationName, setNotificationShortDescription, setNotificationLongDescription } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";
import { LANGUAGE_OPTIONS } from "../../types/constants";
import { isNameValid, isShortDescriptionValid, isLongDescriptionValid } from "../../utils/validation";

const Description = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const dispatchValidation = useDispatch<Dispatch<NotificationValidationAction>>();
  const router = useRouter();

  // Fetch values from redux state
  const notification = useSelector((state: RootState) => state.notification.notification);
  const {
    name: placeName,
    description: { short: shortDesc, long: longDesc },
  } = notification;

  const notificationExtra = useSelector((state: RootState) => state.notification.notificationExtra);
  const { inputLanguages } = notificationExtra;

  const notificationValidation = useSelector((state: RootState) => state.notificationValidation.notificationValidation);
  const {
    name: nameValid,
    description: { short: shortDescValid, long: longDescValid },
  } = notificationValidation;

  // Functions for updating values in redux state
  const updateName = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setNotificationName({ [evt.target.name]: evt.target.value }));
  };

  const updateShortDescription = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setNotificationShortDescription({ [evt.target.name]: evt.target.value }));
  };

  const updateLongDescription = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setNotificationLongDescription({ [evt.target.name]: evt.target.value }));
  };

  // Functions for validating values and storing the results in redux state
  const validateName = (evt: ChangeEvent<HTMLInputElement>) => {
    isNameValid(evt.target.name, notification, dispatchValidation);
  };

  const validateShortDescription = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    isShortDescriptionValid(evt.target.name, notification, dispatchValidation);

    // Also update the long description if it's empty to help the user
    if ((longDesc[evt.target.name] as string).length === 0) {
      dispatch(setNotificationLongDescription({ [evt.target.name]: evt.target.value }));

      isLongDescriptionValid(evt.target.name, notification, dispatchValidation);
    }
  };

  const validateLongDescription = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    isLongDescriptionValid(evt.target.name, notification, dispatchValidation);
  };

  return (
    <div className="formSection">
      <h3>{i18n.t("notification.description.title")}</h3>
      <InputLanguage />

      <div className={inputLanguages.length > 1 ? "languageSection" : ""}>
        {inputLanguages.length > 1 && <h3>{i18n.t("notification.description.placeName.label")}</h3>}
        {LANGUAGE_OPTIONS.map((option) =>
          inputLanguages.includes(option) ? (
            <TextInput
              id={`placeName_${option}`}
              key={`placeName_${option}`}
              className="formInput"
              label={`${i18n.t("notification.description.placeName.label")} ${i18n.t(`general.inLanguage.${option}`)}`}
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
        {LANGUAGE_OPTIONS.map((option) =>
          inputLanguages.includes(option) ? (
            <TextArea
              id={`shortDescription_${option}`}
              key={`shortDescription_${option}`}
              className="formInput"
              rows={3}
              label={`${i18n.t("notification.description.shortDescription.label")} ${i18n.t(`general.inLanguage.${option}`)}`}
              name={option}
              value={shortDesc[option] as string}
              onChange={updateShortDescription}
              onBlur={validateShortDescription}
              helperText={i18n.t("notification.description.shortDescription.helperText")}
              tooltipButtonLabel={i18n.t("notification.description.shortDescription.tooltipLabel")}
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
        {LANGUAGE_OPTIONS.map((option) =>
          inputLanguages.includes(option) ? (
            <TextArea
              id={`longDescription_${option}`}
              key={`longDescription_${option}`}
              className="formInput"
              rows={6}
              label={`${i18n.t("notification.description.longDescription.label")} ${i18n.t(`general.inLanguage.${option}`)}`}
              name={option}
              value={longDesc[option] as string}
              onChange={updateLongDescription}
              onBlur={validateLongDescription}
              helperText={i18n.t("notification.description.longDescription.helperText")}
              tooltipButtonLabel={i18n.t("notification.description.longDescription.tooltipLabel")}
              tooltipLabel={i18n.t("notification.description.longDescription.tooltipLabel")}
              tooltipText={i18n.t("notification.description.longDescription.tooltipText")}
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
