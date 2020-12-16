import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput, RadioButton, SelectionGroup } from "hds-react";
import { NotificationAction, NotificationValidationAction } from "../../state/actions/types";
import { setNotificationNotifier } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";
import { NotifierType } from "../../types/constants";
import { isNotifierFieldValid } from "../../utils/validation";

const Notifier = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const dispatchValidation = useDispatch<Dispatch<NotificationValidationAction>>();

  const notificationExtra = useSelector((state: RootState) => state.notification.notificationExtra);
  const {
    notifier: { notifierType, fullName, email, phone },
  } = notificationExtra;

  const notificationValidation = useSelector((state: RootState) => state.notificationValidation.notificationValidation);
  const {
    notifier: { notifierType: notifierTypeValid = true, fullName: fullNameValid = true, email: emailValid = true, phone: phoneValid = true } = {},
  } = notificationValidation;

  const updateNotifier = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setNotificationNotifier({ [evt.target.name]: evt.target.value }));
  };

  const validateNotifier = (evt: ChangeEvent<HTMLInputElement>) => {
    isNotifierFieldValid(evt.target.name, notificationExtra, dispatchValidation);
  };

  return (
    <div className="formSection">
      <h3>{i18n.t("notification.notifier.title")}</h3>

      <SelectionGroup
        direction="horizontal"
        className="formInput"
        label={i18n.t("notification.notifier.notifierType")}
        tooltipButtonLabel={i18n.t("notification.notifier.tooltipLabel")}
        tooltipLabel={i18n.t("notification.notifier.tooltipLabel")}
        tooltipText={i18n.t("notification.notifier.tooltipText")}
        errorText={!notifierTypeValid ? i18n.t("notification.toast.validationFailed.title") : ""}
        required
      >
        <RadioButton
          id="notifierType_owner"
          label={i18n.t("notification.notifier.representative")}
          name="notifierType"
          value={NotifierType.Representative}
          checked={notifierType === NotifierType.Representative}
          onChange={updateNotifier}
        />
        <RadioButton
          id="notifierType_outsideSource"
          label={i18n.t("notification.notifier.notRepresentative")}
          name="notifierType"
          value={NotifierType.NotRepresentative}
          checked={notifierType === NotifierType.NotRepresentative}
          onChange={updateNotifier}
        />
      </SelectionGroup>

      <TextInput
        id="fullName"
        className="formInput"
        label={i18n.t("notification.notifier.fullName.label")}
        name="fullName"
        value={fullName}
        onChange={updateNotifier}
        onBlur={validateNotifier}
        invalid={!fullNameValid}
        errorText={!fullNameValid ? i18n.t("notification.toast.validationFailed.title") : ""}
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
        errorText={!emailValid ? i18n.t("notification.toast.validationFailed.title") : ""}
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
        errorText={!phoneValid ? i18n.t("notification.toast.validationFailed.title") : ""}
        required
      />
    </div>
  );
};

export default Notifier;
