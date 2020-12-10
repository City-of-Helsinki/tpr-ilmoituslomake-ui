import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput, Checkbox, Button } from "hds-react";
import { NotificationAction, NotificationValidationAction } from "../../state/actions/types";
import { setNotificationPhoto, removeNotificationPhoto } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";
import styles from "./Photos.module.scss";
import { isPhotoUrlValid } from "../../utils/validation";

const Photos = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const dispatchValidation = useDispatch<Dispatch<NotificationValidationAction>>();

  const notificationExtra = useSelector((state: RootState) => state.notification.notificationExtra);
  const { photos = [] } = notificationExtra;

  const notificationValidation = useSelector((state: RootState) => state.notificationValidation.notificationValidation);
  const { photos: photosValid } = notificationValidation;

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

  const validateUrl = (index: number) => {
    isPhotoUrlValid(index, notificationExtra, dispatchValidation);
  };

  return (
    <div className={styles.photos}>
      {photos.map(({ url, description, permission, photographer }, index) => {
        const key = `photo_${index}`;
        return (
          <div key={key}>
            <h3>{`${i18n.t("notification.photos.photo")} ${index + 1}`}</h3>
            <TextInput
              id={`url_${index}`}
              className="formInput"
              label={i18n.t("notification.photos.url.label")}
              name="url"
              value={url}
              onChange={(evt) => updatePhoto(index, evt)}
              onBlur={() => validateUrl(index)}
              invalid={photosValid[index] && !photosValid[index].url}
              errorText={photosValid[index] && !photosValid[index].url ? i18n.t("notification.toast.validationFailed.title") : ""}
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
