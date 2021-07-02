import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Checkbox, SelectionGroup } from "hds-react";
import { useMediaQuery } from "react-responsive";
import { NotificationAction } from "../../state/actions/notificationTypes";
import { NotificationValidationAction } from "../../state/actions/notificationValidationTypes";
import { setNotificationInputLanguage } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";
import { LANGUAGE_OPTIONS } from "../../types/constants";
import { isInputLanguageFieldValid } from "../../utils/validation";
import styles from "./InputLanguage.module.scss";

const InputLanguage = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const dispatchValidation = useDispatch<Dispatch<NotificationValidationAction>>();
  const router = useRouter();

  // Note: this only works for client-side rendering
  const isScreenSizeXS = useMediaQuery({ query: `only screen and (max-width: ${styles.max_breakpoint_xs})` });

  const notificationExtra = useSelector((state: RootState) => state.notification.notificationExtra);
  const { inputLanguages } = notificationExtra;

  const notificationValidation = useSelector((state: RootState) => state.notificationValidation.notificationValidation);
  const { inputLanguage: inputLanguageValid } = notificationValidation;

  const updateInputLanguage = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setNotificationInputLanguage({ [evt.target.value]: evt.target.checked }));
  };

  const validateInputLanguage = () => {
    isInputLanguageFieldValid(notificationExtra, dispatchValidation);
  };

  return (
    <SelectionGroup
      id="inputLanguage"
      direction={isScreenSizeXS ? "vertical" : "horizontal"}
      className={styles.inputLanguage}
      label={i18n.t("notification.inputLanguage.title")}
      errorText={!inputLanguageValid.valid ? i18n.t(inputLanguageValid.message as string) : ""}
      required
      aria-required
    >
      {LANGUAGE_OPTIONS.map((option) => (
        <Checkbox
          id={`input_${option}`}
          key={`input_${option}`}
          className="disabledTextColor"
          label={i18n.t(`notification.inputLanguage.${option}`)}
          name={`input_${option}`}
          value={option}
          checked={inputLanguages.includes(option)}
          onChange={updateInputLanguage}
          onBlur={validateInputLanguage}
          required={router.locale === option}
          aria-required={router.locale === option}
        />
      ))}
    </SelectionGroup>
  );
};

export default InputLanguage;
