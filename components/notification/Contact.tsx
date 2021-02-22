import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput } from "hds-react";
import { NotificationAction, NotificationValidationAction } from "../../state/actions/types";
import { setNotificationContact } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";
import { isContactFieldValid } from "../../utils/validation";

const Contact = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const dispatchValidation = useDispatch<Dispatch<NotificationValidationAction>>();

  const notification = useSelector((state: RootState) => state.notification.notification);
  const { phone, email } = notification;

  const notificationValidation = useSelector((state: RootState) => state.notificationValidation.notificationValidation);
  const { email: emailValid, phone: phoneValid } = notificationValidation;

  const updateContact = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setNotificationContact({ [evt.target.name]: evt.target.value }));
  };

  const validateContact = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setNotificationContact({ [evt.target.name]: evt.target.name === "email" ? email.trim() : phone.trim() }));
    isContactFieldValid(evt.target.name, notification, dispatchValidation);
  };

  return (
    <div>
      <h3>{i18n.t("notification.contact.title")}</h3>
      <TextInput
        id="phone"
        className="formInput limitInputWidth"
        label={i18n.t("notification.contact.phone.label")}
        name="phone"
        value={phone}
        onChange={updateContact}
        onBlur={validateContact}
        invalid={!phoneValid.valid}
        errorText={!phoneValid.valid ? i18n.t(phoneValid.message as string).replace("$fieldName", i18n.t("notification.contact.phone.label")) : ""}
      />
      <TextInput
        id="email"
        className="formInput limitInputWidth"
        label={i18n.t("notification.contact.email.label")}
        name="email"
        value={email}
        onChange={updateContact}
        onBlur={validateContact}
        invalid={!emailValid.valid}
        errorText={!emailValid.valid ? i18n.t(emailValid.message as string).replace("$fieldName", i18n.t("notification.contact.email.label")) : ""}
      />
    </div>
  );
};

export default Contact;
