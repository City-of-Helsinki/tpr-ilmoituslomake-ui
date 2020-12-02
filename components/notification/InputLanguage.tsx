import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Checkbox } from "hds-react";
import { NotificationAction } from "../../state/actions/types";
import { setNotificationInputLanguage } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";
import { LANGUAGE_OPTIONS } from "../../types/constants";
import styles from "./InputLanguage.module.scss";

const InputLanguage = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const router = useRouter();

  const notificationExtra = useSelector((state: RootState) => state.notification.notificationExtra);
  const { inputLanguages } = notificationExtra;

  const updateInputLanguage = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setNotificationInputLanguage({ [evt.target.value]: evt.target.checked }));
  };

  return (
    <div role="group" className={styles.inputLanguage} aria-labelledby="inputLanguage">
      <div id="inputLanguage">
        {i18n.t("notification.inputLanguage.title")}
        <span aria-hidden="true" className="hds-text-input__required">
          *
        </span>
      </div>
      {LANGUAGE_OPTIONS.map((option) => (
        <Checkbox
          id={`input_${option}`}
          key={`input_${option}`}
          label={i18n.t(`notification.inputLanguage.${option}`)}
          name={`input_${option}`}
          value={option}
          checked={inputLanguages.includes(option)}
          onChange={updateInputLanguage}
          required={router.locale === option}
          disabled={router.locale === option}
        />
      ))}
    </div>
  );
};

export default InputLanguage;
