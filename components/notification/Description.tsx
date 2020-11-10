import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput, TextArea } from "hds-react";
import { NotificationAction } from "../../state/actions/types";
import { setNotificationData, setNotificationValidation } from "../../state/actions/notification";
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

  const notificationValidation = useSelector((state: RootState) => state.notification.notificationValidation);
  const {
    name: { fi: nameFiValid = true } = {},
    description: { short: { fi: shortDescFiValid = true } = {}, long: { fi: longDescFiValid = true } = {} } = {},
  } = notificationValidation;

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

  const validateName = (evt: ChangeEvent<HTMLInputElement>) => {
    const valid = evt.target.value.length > 0;
    const newValidation = { ...notificationValidation, name: { ...notificationValidation.name, [evt.target.name]: valid } };
    dispatch(setNotificationValidation(newValidation));
  };

  const validateShortDescription = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    const valid = evt.target.value.length > 0;
    const newValidation = {
      ...notificationValidation,
      description: {
        ...notificationValidation.description,
        short: { ...(notificationValidation.description ?? {}).short, [evt.target.name]: valid },
      },
    };
    dispatch(setNotificationValidation(newValidation));

    // Also update the long description if it's empty to help the user
    if (longDescFi.length === 0) {
      const newNotification = {
        ...notification,
        description: { ...notification.description, long: { ...notification.description.long, [evt.target.name]: evt.target.value } },
      };
      dispatch(setNotificationData(newNotification));
    }
  };

  const validateLongDescription = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    const valid = evt.target.value.length > 0;
    const newValidation = {
      ...notificationValidation,
      description: { ...notificationValidation.description, long: { ...(notificationValidation.description ?? {}).long, [evt.target.name]: valid } },
    };
    dispatch(setNotificationValidation(newValidation));
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
        onBlur={validateName}
        invalid={!nameFiValid}
        required
      />
      <TextArea
        id="shortDescription"
        className="formInput"
        label={i18n.t("notification.description.shortDescription.label")}
        name="fi"
        value={shortDescFi}
        onChange={updateShortDescription}
        onBlur={validateShortDescription}
        helperText={i18n.t("notification.description.shortDescription.helperText")}
        tooltipLabel={i18n.t("notification.description.shortDescription.tooltipLabel")}
        tooltipText={i18n.t("notification.description.shortDescription.tooltipText")}
        invalid={!shortDescFiValid}
        required
      />
      <TextArea
        id="longDescription"
        className="formInput"
        label={i18n.t("notification.description.longDescription.label")}
        name="fi"
        value={longDescFi}
        onChange={updateLongDescription}
        onBlur={validateLongDescription}
        helperText={i18n.t("notification.description.longDescription.helperText")}
        invalid={!longDescFiValid}
        required
      />
    </div>
  );
};

export default Description;
