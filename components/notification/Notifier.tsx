import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput, RadioButton } from "hds-react";
import { NotificationAction } from "../../state/actions/types";
import { setNotificationExtra, setNotificationValidation } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";

const Notifier = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();

  const notificationExtra = useSelector((state: RootState) => state.notification.notificationExtra);
  const {
    notifier: { notifierType = "owner", fullName, email, phone },
  } = notificationExtra;

  const notificationValidation = useSelector((state: RootState) => state.notification.notificationValidation);
  const { notifier: { fullName: fullNameValid = true, email: emailValid = true, phone: phoneValid = true } = {} } = notificationValidation;

  const updateNotifier = (evt: ChangeEvent<HTMLInputElement>) => {
    const newNotificationExtra = { ...notificationExtra, notifier: { ...notificationExtra.notifier, [evt.target.name]: evt.target.value } };
    dispatch(setNotificationExtra(newNotificationExtra));
  };

  const validateNotifier = (evt: ChangeEvent<HTMLInputElement>) => {
    const valid = evt.target.value.length > 0;
    const newValidation = { ...notificationValidation, notifier: { ...notificationValidation.notifier, [evt.target.name]: valid } };
    dispatch(setNotificationValidation(newValidation));
  };

  return (
    <div className="formSection">
      <h2>{i18n.t("notification.notifier.title")}</h2>
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
