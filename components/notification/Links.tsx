import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput } from "hds-react";
import { NotificationAction } from "../../state/actions/types";
import { setNotificationData } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";

const Links = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();

  const notification = useSelector((state: RootState) => state.notification.notification);
  const {
    website: { fi: websiteFi },
  } = notification;

  const updateWebsite = (evt: ChangeEvent<HTMLInputElement>) => {
    const newNotification = { ...notification, website: { ...notification.website, [evt.target.name]: evt.target.value } };
    dispatch(setNotificationData(newNotification));
  };

  return (
    <div className="formSection">
      <h2>{i18n.t("notification.links.title")}</h2>
      <TextInput
        id="website"
        className="formInput"
        label={i18n.t("notification.links.website.label")}
        name="fi"
        value={websiteFi}
        onChange={updateWebsite}
      />
      {/* <TextInput id="socialMedia" className="formInput" label={i18n.t("notification.links.socialMedia.label")} /> */}
    </div>
  );
};

export default Links;
