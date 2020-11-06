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
  const {
    name: { fi: nameFi },
    description: {
      short: { fi: shortDescFi },
      long: { fi: longDescFi },
    },
  } = notification;

  const updateName = (evt: ChangeEvent<HTMLInputElement>) => {
    const newNotification = { ...notification, name: { ...notification.name, [evt.target.name]: evt.target.value } };
    dispatch(setNotificationData(newNotification));
  };

  const updateShortDescription = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    const newNotification = {
      ...notification,
      description: { ...notification.description, short: { ...notification.description.short, [evt.target.name]: evt.target.value } },
    };
    dispatch(setNotificationData(newNotification));
  };

  const updateLongDescription = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    const newNotification = {
      ...notification,
      description: { ...notification.description, long: { ...notification.description.long, [evt.target.name]: evt.target.value } },
    };
    dispatch(setNotificationData(newNotification));
  };

  return (
    <div className="formSection">
      <h2>{i18n.t("notification.description.title")}</h2>
      <TextInput
        id="placeName"
        className="formInput"
        label={i18n.t("notification.description.placeName.label")}
        name="fi"
        value={nameFi}
        onChange={updateName}
        required
      />
      <TextArea
        id="shortDescription"
        className="formInput"
        label={i18n.t("notification.description.shortDescription.label")}
        name="fi"
        value={shortDescFi}
        onChange={updateShortDescription}
        helperText={i18n.t("notification.description.shortDescription.helperText")}
        tooltipLabel={i18n.t("notification.description.shortDescription.tooltipLabel")}
        tooltipText={i18n.t("notification.description.shortDescription.tooltipText")}
        required
      />
      <TextArea
        id="longDescription"
        className="formInput"
        label={i18n.t("notification.description.longDescription.label")}
        name="fi"
        value={longDescFi}
        onChange={updateLongDescription}
        helperText={i18n.t("notification.description.longDescription.helperText")}
        tooltipLabel={i18n.t("notification.description.longDescription.tooltipLabel")}
        tooltipText={i18n.t("notification.description.longDescription.tooltipText")}
      />
    </div>
  );
};

export default Description;
