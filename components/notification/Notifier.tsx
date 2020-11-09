import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput } from "hds-react";
import { NotificationAction } from "../../state/actions/types";
import { setNotificationExtra } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";

const Notifier = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();

  const notificationExtra = useSelector((state: RootState) => state.notification.notificationExtra);
  const {
    notifier: { fullName, email, phone },
  } = notificationExtra;

  const updateNotifier = (evt: ChangeEvent<HTMLInputElement>) => {
    const newNotificationExtra = { ...notificationExtra, notifier: { ...notificationExtra.notifier, [evt.target.name]: evt.target.value } };
    dispatch(setNotificationExtra(newNotificationExtra));
  };

  return (
    <div className="formSection">
      <h2>{i18n.t("notification.notifier.title")}</h2>
      <TextInput
        id="fullName"
        className="formInput"
        label={i18n.t("notification.notifier.fullName.label")}
        name="fullName"
        value={fullName}
        onChange={updateNotifier}
        required
      />
      <TextInput
        id="email"
        className="formInput"
        label={i18n.t("notification.notifier.email.label")}
        name="email"
        value={email}
        onChange={updateNotifier}
        required
      />
      <TextInput
        id="phone"
        className="formInput"
        label={i18n.t("notification.notifier.phone.label")}
        name="phone"
        value={phone}
        onChange={updateNotifier}
        required
      />
    </div>
  );
};

export default Notifier;
