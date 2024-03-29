import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput } from "hds-react";
import { NotificationAction } from "../../state/actions/notificationTypes";
import { NotificationValidationAction } from "../../state/actions/notificationValidationTypes";
import { setNotificationContact } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";
import { MAX_LENGTH_BUSINESSID, MAX_LENGTH_EMAIL, MAX_LENGTH_PHONE } from "../../types/constants";
import { isContactFieldValid } from "../../utils/validation";
import styles from "./Contact.module.scss";

const Contact = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const dispatchValidation = useDispatch<Dispatch<NotificationValidationAction>>();

  const notification = useSelector((state: RootState) => state.notification.notification);
  const { businessid, phone, email } = notification;

  const notificationValidation = useSelector((state: RootState) => state.notificationValidation.notificationValidation);
  const { businessid: businessidValid, phone: phoneValid, email: emailValid } = notificationValidation;

  const updateContact = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setNotificationContact({ [evt.target.name]: evt.target.value }));
  };

  const validateContact = (evt: ChangeEvent<HTMLInputElement>) => {
    let targetValue = "";
    switch (evt.target.name) {
      case "businessid": {
        targetValue = businessid ? businessid.trim() : "";
        break;
      }
      case "email": {
        targetValue = email.trim();
        break;
      }
      case "phone": {
        targetValue = phone.trim();
        break;
      }
      default: {
        targetValue = "";
      }
    }
    dispatch(setNotificationContact({ [evt.target.name]: targetValue }));
    isContactFieldValid(evt.target.name, notification, dispatchValidation);
  };

  return (
    <div id="contact" className={`formSection ${styles.contact}`}>
      <h3>{i18n.t("notification.contact.title")}</h3>
      <TextInput
        id="businessid"
        className="formInput"
        label={i18n.t("notification.contact.businessid.label")}
        helperText={i18n.t("notification.contact.businessid.helperText")}
        name="businessid"
        value={businessid}
        maxLength={MAX_LENGTH_BUSINESSID}
        onChange={updateContact}
        onBlur={validateContact}
        invalid={!businessidValid.valid}
        errorText={
          !businessidValid.valid
            ? i18n.t(businessidValid.message as string).replace("$fieldName", i18n.t("notification.contact.businessid.label"))
            : ""
        }
      />
      <TextInput
        id="phone"
        className="formInput"
        label={i18n.t("notification.contact.phone.label")}
        helperText={i18n.t("notification.contact.phone.helperText")}
        name="phone"
        value={phone}
        inputMode="tel"
        maxLength={MAX_LENGTH_PHONE}
        onChange={updateContact}
        onBlur={validateContact}
        invalid={!phoneValid.valid}
        errorText={!phoneValid.valid ? i18n.t(phoneValid.message as string).replace("$fieldName", i18n.t("notification.contact.phone.label")) : ""}
      />
      <TextInput
        id="email"
        className="formInput"
        label={i18n.t("notification.contact.email.label")}
        name="email"
        value={email}
        inputMode="email"
        maxLength={MAX_LENGTH_EMAIL}
        onChange={updateContact}
        onBlur={validateContact}
        invalid={!emailValid.valid}
        errorText={!emailValid.valid ? i18n.t(emailValid.message as string).replace("$fieldName", i18n.t("notification.contact.email.label")) : ""}
      />
    </div>
  );
};

export default Contact;
