import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput, TextArea } from "hds-react";
import { NotificationAction } from "../../state/actions/types";
import { setNotificationData } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";

const Description = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();

  const notification = useSelector((state: RootState) => state.notification.notification);
  const { name } = notification;

  const updateData = (evt: ChangeEvent<HTMLInputElement>) => {
    const newNotification = { ...notification, [evt.target.name]: evt.target.value };
    dispatch(setNotificationData(newNotification));
  };

  return (
    <div className="formSection">
      <h2>{i18n.t("notification.description.title")}</h2>
      <TextInput
        id="placeName"
        className="formInput"
        label={i18n.t("notification.description.placeName.label")}
        name="name"
        value={name}
        onChange={updateData}
        required
      />
      <TextArea
        id="shortDescription"
        className="formInput"
        label={i18n.t("notification.description.shortDescription.label")}
        helperText={i18n.t("notification.description.shortDescription.helperText")}
        tooltipLabel={i18n.t("notification.description.shortDescription.tooltipLabel")}
        tooltipText={i18n.t("notification.description.shortDescription.tooltipText")}
        required
      />
      <TextArea
        id="longDescription"
        className="formInput"
        label={i18n.t("notification.description.longDescription.label")}
        helperText={i18n.t("notification.description.longDescription.helperText")}
        tooltipLabel={i18n.t("notification.description.longDescription.tooltipLabel")}
        tooltipText={i18n.t("notification.description.longDescription.tooltipText")}
      />
    </div>
  );
};

export default Description;
