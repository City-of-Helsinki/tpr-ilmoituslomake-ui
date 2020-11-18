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
  const { email: emailValid = true, phone: phoneValid = true } = notificationValidation;

  const updateContact = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setNotificationContact({ [evt.target.name]: evt.target.value }));
  };

  const validateContact = (evt: ChangeEvent<HTMLInputElement>) => {
    isContactFieldValid(evt.target.name, notification, dispatchValidation);
  };

  return (
    <div className="formSection">
      <h2>{i18n.t("notification.contact.title")}</h2>
      <TextInput
        id="phone"
        className="formInput"
        label={i18n.t("notification.contact.phone.label")}
        name="phone"
        value={phone}
        onChange={updateContact}
        onBlur={validateContact}
        invalid={!phoneValid}
      />
      <TextInput
        id="email"
        className="formInput"
        label={i18n.t("notification.contact.email.label")}
        name="email"
        value={email}
        onChange={updateContact}
        onBlur={validateContact}
        invalid={!emailValid}
      />
    </div>
  );
};

export default Contact;
