import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import { useI18n } from "next-localization";
import { TextInput, TextArea } from "hds-react";
import { NotificationAction } from "../../state/actions/notificationTypes";
import { NotificationValidationAction } from "../../state/actions/notificationValidationTypes";
import { setNotificationName, setNotificationShortDescription, setNotificationLongDescription } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";
import { LANGUAGE_OPTIONS, MAX_LENGTH, MAX_LENGTH_LONG_DESC, MAX_LENGTH_SHORT_DESC } from "../../types/constants";
import { isNameValid, isShortDescriptionValid, isLongDescriptionValid } from "../../utils/validation";

// Note: The input language selector has an attribute that uses a media query which does not work when server-side rendering
const DynamicInputLanguage = dynamic(() => import("./InputLanguage"), { ssr: false });

const Description = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const dispatchValidation = useDispatch<Dispatch<NotificationValidationAction>>();

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
    dispatch(setNotificationName({ [evt.target.name]: (placeName[evt.target.name] as string).trim() }));
    isNameValid(evt.target.name, notification, dispatchValidation);
  };

  const validateShortDescription = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setNotificationShortDescription({ [evt.target.name]: (shortDesc[evt.target.name] as string).trim() }));
    isShortDescriptionValid(evt.target.name, notification, dispatchValidation);

    // Also update the long description if it's empty to help the user
    if ((longDesc[evt.target.name] as string).length === 0) {
      dispatch(setNotificationLongDescription({ [evt.target.name]: (shortDesc[evt.target.name] as string).trim() }));
      isLongDescriptionValid(evt.target.name, notification, dispatchValidation);
    }
  };

  const validateLongDescription = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setNotificationLongDescription({ [evt.target.name]: (longDesc[evt.target.name] as string).trim() }));
    isLongDescriptionValid(evt.target.name, notification, dispatchValidation);
  };

  return (
    <div className="formSection">
      <h3>{i18n.t("notification.description.title")}</h3>
      <DynamicInputLanguage />

      <div className={inputLanguages.length > 1 ? "languageSection" : ""}>
        {inputLanguages.length > 1 && <h3>{i18n.t("notification.description.placeName.label")}</h3>}
        {LANGUAGE_OPTIONS.map((option) => {
          const label = `${i18n.t("notification.description.placeName.label")} ${i18n.t(`common.inLanguage.${option}`)}`;
          return inputLanguages.includes(option) ? (
            <TextInput
              id={`placeName_${option}`}
              key={`placeName_${option}`}
              lang={option}
              className="formInput"
              label={label}
              name={option}
              value={placeName[option] as string}
              maxLength={MAX_LENGTH}
              onChange={updateName}
              onBlur={validateName}
              invalid={!nameValid[option].valid}
              errorText={!nameValid[option].valid ? i18n.t(nameValid[option].message as string).replace("$fieldName", label) : ""}
              required
              aria-required
            />
          ) : null;
        })}
      </div>

      <div className={inputLanguages.length > 1 ? "languageSection" : ""}>
        {inputLanguages.length > 1 && <h3>{i18n.t("notification.description.shortDescription.label")}</h3>}
        {LANGUAGE_OPTIONS.map((option) => {
          const label = `${i18n.t("notification.description.shortDescription.label")} ${i18n.t(`common.inLanguage.${option}`)}`;
          return inputLanguages.includes(option) ? (
            <TextArea
              id={`shortDescription_${option}`}
              key={`shortDescription_${option}`}
              lang={option}
              className="formInput"
              rows={3}
              label={label}
              name={option}
              value={shortDesc[option] as string}
              maxLength={MAX_LENGTH_SHORT_DESC}
              onChange={updateShortDescription}
              onBlur={validateShortDescription}
              helperText={i18n.t("notification.description.shortDescription.helperText")}
              tooltipButtonLabel={i18n.t("notification.button.openHelp")}
              tooltipLabel={i18n.t("notification.description.shortDescription.tooltipLabel")}
              tooltipText={i18n.t("notification.description.shortDescription.tooltipText")}
              invalid={!shortDescValid[option].valid}
              errorText={!shortDescValid[option].valid ? i18n.t(shortDescValid[option].message as string).replace("$fieldName", label) : ""}
              required
              aria-required
            />
          ) : null;
        })}
      </div>

      <div className={inputLanguages.length > 1 ? "languageSection" : ""}>
        {inputLanguages.length > 1 && <h3>{i18n.t("notification.description.longDescription.label")}</h3>}
        {LANGUAGE_OPTIONS.map((option) => {
          const label = `${i18n.t("notification.description.longDescription.label")} ${i18n.t(`common.inLanguage.${option}`)}`;
          return inputLanguages.includes(option) ? (
            <TextArea
              id={`longDescription_${option}`}
              key={`longDescription_${option}`}
              lang={option}
              className="formInput"
              rows={6}
              label={label}
              name={option}
              value={longDesc[option] as string}
              maxLength={MAX_LENGTH_LONG_DESC}
              onChange={updateLongDescription}
              onBlur={validateLongDescription}
              helperText={`${i18n.t("notification.description.longDescription.helperText")} (${(longDesc[option] as string).length})`}
              tooltipButtonLabel={i18n.t("notification.button.openHelp")}
              tooltipLabel={i18n.t("notification.description.longDescription.tooltipLabel")}
              tooltipText={i18n.t("notification.description.longDescription.tooltipText")}
              invalid={!longDescValid[option].valid}
              errorText={!longDescValid[option].valid ? i18n.t(longDescValid[option].message as string).replace("$fieldName", label) : ""}
              required
              aria-required
            />
          ) : null;
        })}
      </div>
    </div>
  );
};

export default Description;
