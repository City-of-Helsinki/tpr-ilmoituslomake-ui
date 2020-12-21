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

  const notification = useSelector((state: RootState) => state.notification.notification);
  const {
    notifier: { notifier_type, full_name, email, phone },
  } = notification;

  const notificationValidation = useSelector((state: RootState) => state.notificationValidation.notificationValidation);
  const {
    notifier: { notifier_type: notifierTypeValid, full_name: fullNameValid, email: emailValid, phone: phoneValid },
  } = notificationValidation;

  const updateNotifier = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setNotificationNotifier({ [evt.target.name]: evt.target.value }));
  };

  const validateNotifier = (evt: ChangeEvent<HTMLInputElement>) => {
    isNotifierFieldValid(evt.target.name, notification, dispatchValidation);
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
        errorText={
          !notifierTypeValid.valid
            ? i18n.t(notifierTypeValid.message as string).replace("$fieldName", i18n.t("notification.notifier.notifierType"))
            : ""
        }
        required
      >
        <RadioButton
          id="notifierType_owner"
          label={i18n.t("notification.notifier.representative")}
          name="notifier_type"
          value={NotifierType.Representative}
          checked={notifier_type === NotifierType.Representative}
          onChange={updateNotifier}
        />
        <RadioButton
          id="notifierType_outsideSource"
          label={i18n.t("notification.notifier.notRepresentative")}
          name="notifier_type"
          value={NotifierType.NotRepresentative}
          checked={notifier_type === NotifierType.NotRepresentative}
          onChange={updateNotifier}
        />
      </SelectionGroup>

      <TextInput
        id="fullName"
        className="formInput"
        label={i18n.t("notification.notifier.fullName.label")}
        name="full_name"
        value={full_name}
        onChange={updateNotifier}
        onBlur={validateNotifier}
        invalid={!fullNameValid.valid}
        errorText={
          !fullNameValid.valid ? i18n.t(fullNameValid.message as string).replace("$fieldName", i18n.t("notification.notifier.fullName.label")) : ""
        }
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
        invalid={!emailValid.valid}
        errorText={!emailValid.valid ? i18n.t(emailValid.message as string).replace("$fieldName", i18n.t("notification.notifier.email.label")) : ""}
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
        invalid={!phoneValid.valid}
        errorText={!phoneValid.valid ? i18n.t(phoneValid.message as string).replace("$fieldName", i18n.t("notification.notifier.phone.label")) : ""}
        required
      />
    </div>
  );
};

export default Notifier;
