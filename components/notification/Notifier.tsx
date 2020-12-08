import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput, RadioButton, Tooltip } from "hds-react";
import { NotificationAction, NotificationValidationAction } from "../../state/actions/types";
import { setNotificationNotifier } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";
import { isNotifierFieldValid } from "../../utils/validation";

const Notifier = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const dispatchValidation = useDispatch<Dispatch<NotificationValidationAction>>();

  const notificationExtra = useSelector((state: RootState) => state.notification.notificationExtra);
  const {
    notifier: { notifierType = "owner", fullName, email, phone },
  } = notificationExtra;

  const notificationValidation = useSelector((state: RootState) => state.notificationValidation.notificationValidation);
  const { notifier: { fullName: fullNameValid = true, email: emailValid = true, phone: phoneValid = true } = {} } = notificationValidation;

  const updateNotifier = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setNotificationNotifier({ [evt.target.name]: evt.target.value }));
  };

  const validateNotifier = (evt: ChangeEvent<HTMLInputElement>) => {
    isNotifierFieldValid(evt.target.name, notificationExtra, dispatchValidation);
  };

  return (
    <div className="formSection">
      <h3>{i18n.t("notification.notifier.title")}</h3>
      <div role="group" className="formInput" aria-labelledby="notifierType">
        <div id="notifierType">
          {i18n.t("notification.notifier.notifierType")}
          <span aria-hidden="true" className="hds-text-input__required">
            *
          </span>
        </div>
        <RadioButton
          id="notifierType_owner"
          label={i18n.t("notification.notifier.owner")}
          name="notifierType"
          value="owner"
          checked={notifierType === "owner"}
          onChange={updateNotifier}
        />
        <RadioButton
          id="notifierType_outsideSource"
          label={i18n.t("notification.notifier.outsideSource")}
          name="notifierType"
          value="outsideSource"
          checked={notifierType === "outsideSource"}
          onChange={updateNotifier}
        />
        <Tooltip>{i18n.t("notification.notifier.tooltip")}</Tooltip>
      </div>
      <TextInput
        id="fullName"
        className="formInput"
        label={i18n.t("notification.notifier.fullName.label")}
        name="fullName"
        value={fullName}
        onChange={updateNotifier}
        onBlur={validateNotifier}
        invalid={!fullNameValid}
        required
      />
      <TextInput
        id="email"
        className="formInput"
        label={i18n.t("notification.notifier.email.label")}
        name="email"
        value={email}
        onChange={updateNotifier}
        onBlur={validateNotifier}
        invalid={!emailValid}
        required
      />
      <TextInput
        id="phone"
        className="formInput"
        label={i18n.t("notification.notifier.phone.label")}
        name="phone"
        value={phone}
        onChange={updateNotifier}
        onBlur={validateNotifier}
        invalid={!phoneValid}
        required
      />
    </div>
  );
};

export default Notifier;
