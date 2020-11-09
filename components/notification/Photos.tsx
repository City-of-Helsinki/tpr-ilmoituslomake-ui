import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput, Checkbox } from "hds-react";
import { NotificationAction } from "../../state/actions/types";
import { setNotificationExtra } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";

const Photos = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();

  const notificationExtra = useSelector((state: RootState) => state.notification.notificationExtra);
  const { photos = [{ url: "", description: "", permission: false, photographer: "" }] } = notificationExtra;

  const updatePhoto = (index: number, evt: ChangeEvent<HTMLInputElement>) => {
    photos[index] = { ...photos[index], [evt.target.name]: evt.target.name === "permission" ? evt.target.checked : evt.target.value };

    const newNotificationExtra = { ...notificationExtra, photos };
    dispatch(setNotificationExtra(newNotificationExtra));
  };

  return (
    <div className="formSection">
      <h2>{i18n.t("notification.photos.title")}</h2>
      {photos.map(({ url, description, permission, photographer }, index) => {
        const key = `photo_${index}`;
        return (
          <div key={key}>
            <TextInput
              id="url"
              className="formInput"
              label={i18n.t("notification.photos.url.label")}
              name="url"
              value={url}
              onChange={(evt) => updatePhoto(index, evt)}
              required
            />
            <TextInput
              id="description"
              className="formInput"
              label={i18n.t("notification.photos.description.label")}
              name="description"
              value={description}
              onChange={(evt) => updatePhoto(index, evt)}
            />
            <Checkbox
              id="permission"
              className="formInput"
              label={i18n.t("notification.photos.permission.label")}
              name="permission"
              value="permission"
              checked={permission}
              onChange={(evt) => updatePhoto(index, evt)}
              required
            />
            <TextInput
              id="photographer"
              className="formInput"
              label={i18n.t("notification.photos.photographer.label")}
              name="photographer"
              value={photographer}
              onChange={(evt) => updatePhoto(index, evt)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Photos;
