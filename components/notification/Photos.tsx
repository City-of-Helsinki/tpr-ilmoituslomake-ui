import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput, Checkbox, Button } from "hds-react";
import { NotificationAction } from "../../state/actions/types";
import { setNotificationPhoto, removeNotificationPhoto } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";
import styles from "./Photos.module.scss";

const Photos = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();

  const notificationExtra = useSelector((state: RootState) => state.notification.notificationExtra);
  const { photos = [] } = notificationExtra;

  const updatePhoto = (index: number, evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setNotificationPhoto(index, { ...photos[index], [evt.target.name]: evt.target.name === "permission" ? evt.target.checked : evt.target.value })
    );
  };

  const addPhoto = () => {
    dispatch(setNotificationPhoto(-1, { url: "", description: "", permission: false, photographer: "" }));
  };

  const removePhoto = (index: number) => {
    dispatch(removeNotificationPhoto(index));
  };

  return (
    <div className={styles.photos}>
      {photos.map(({ url, description, permission, photographer }, index) => {
        const key = `photo_${index}`;
        return (
          <div key={key}>
            <h2>{`${i18n.t("notification.photos.photo")} ${index + 1}`}</h2>
            <TextInput
              id={`url_${index}`}
              className="formInput"
              label={i18n.t("notification.photos.url.label")}
              name="url"
              value={url}
              onChange={(evt) => updatePhoto(index, evt)}
              required
            />
            <TextInput
              id={`description_${index}`}
              className="formInput"
              label={i18n.t("notification.photos.description.label")}
              name="description"
              value={description}
              onChange={(evt) => updatePhoto(index, evt)}
            />
            <Checkbox
              id={`permission_${index}`}
              className="formInput"
              label={`${i18n.t("notification.photos.permission.label")} *`}
              name="permission"
              value="permission"
              checked={permission}
              onChange={(evt) => updatePhoto(index, evt)}
              required
            />
            <TextInput
              id={`photographer_${index}`}
              className="formInput"
              label={i18n.t("notification.photos.photographer.label")}
              name="photographer"
              value={photographer}
              onChange={(evt) => updatePhoto(index, evt)}
            />
            <Button variant="secondary" className="formInput" onClick={() => removePhoto(index)}>
              {i18n.t("notification.photos.remove")}
            </Button>
            <hr />
          </div>
        );
      })}

      <Button variant="secondary" className={styles.addNew} onClick={addPhoto}>
        {i18n.t("notification.photos.addNew")}
      </Button>
    </div>
  );
};

export default Photos;
