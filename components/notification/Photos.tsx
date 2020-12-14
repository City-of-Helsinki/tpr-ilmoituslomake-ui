import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput, Button, IconUpload, IconLink, TextArea, SelectionGroup, RadioButton, IconLinkExternal } from "hds-react";
import { NotificationAction, NotificationValidationAction } from "../../state/actions/types";
import { setNotificationPhoto, removeNotificationPhoto } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";
import { MAX_PHOTOS, PhotoSourceType } from "../../types/constants";
import { isPhotoUrlValid } from "../../utils/validation";
import Notice from "./Notice";
import styles from "./Photos.module.scss";

const Photos = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const dispatchValidation = useDispatch<Dispatch<NotificationValidationAction>>();

  const notificationExtra = useSelector((state: RootState) => state.notification.notificationExtra);
  const { photos = [] } = notificationExtra;

  const notificationValidation = useSelector((state: RootState) => state.notificationValidation.notificationValidation);
  const { photos: photosValid } = notificationValidation;

  const updatePhoto = (index: number, evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch(setNotificationPhoto(index, { ...photos[index], [evt.target.name]: evt.target.value }));
  };

  const addPhoto = (sourceType: PhotoSourceType) => {
    dispatch(
      setNotificationPhoto(-1, {
        sourceType,
        url: "",
        description: "",
        permission: "",
        source: "",
      })
    );
  };

  const removePhoto = (index: number) => {
    dispatch(removeNotificationPhoto(index));
  };

  const openCreativeCommons = () => {
    window.open("https://creativecommons.org/licenses/by/4.0/", "_blank");
  };

  const validateUrl = (index: number) => {
    isPhotoUrlValid(index, notificationExtra, dispatchValidation);
  };

  return (
    <div className={styles.photos}>
      {photos.map(({ sourceType, url, description, permission, source }, index) => {
        const key = `photo_${index}`;
        return (
          <div key={key}>
            <h3>{`${i18n.t("notification.photos.photo.title")} ${index + 1}`}</h3>
            <Notice messageKey="notification.photos.photo.notice1" messageKey2="notification.photos.photo.notice2" />

            <TextInput
              id={`url_${index}`}
              className="formInput"
              label={
                sourceType === PhotoSourceType.Device ? i18n.t("notification.photos.url.labelDevice") : i18n.t("notification.photos.url.labelLink")
              }
              name="url"
              value={url}
              onChange={(evt) => updatePhoto(index, evt)}
              onBlur={() => validateUrl(index)}
              invalid={photosValid[index] && !photosValid[index].url}
              errorText={photosValid[index] && !photosValid[index].url ? i18n.t("notification.toast.validationFailed.title") : ""}
              required
            />

            <TextArea
              id={`description_${index}`}
              className="formInput"
              rows={6}
              label={i18n.t("notification.photos.description.label")}
              name="description"
              value={description}
              onChange={(evt) => updatePhoto(index, evt)}
              helperText={i18n.t("notification.photos.description.helperText")}
              tooltipButtonLabel={i18n.t("notification.photos.description.tooltipLabel")}
              tooltipLabel={i18n.t("notification.photos.description.tooltipLabel")}
              tooltipText={i18n.t("notification.photos.description.tooltipText")}
            />

            <h5>{i18n.t("notification.photos.permission.title")}</h5>
            <Notice messageKey="notification.photos.permission.notice" />

            <SelectionGroup direction="vertical" className="formInput" label={i18n.t("notification.photos.permission.label")} required>
              <RadioButton
                id={`permission_myHelsinki_${index}`}
                label={i18n.t("notification.photos.permission.myHelsinki")}
                name="permission"
                value="myHelsinki"
                checked={permission === "myHelsinki"}
                onChange={(evt) => updatePhoto(index, evt)}
              />
              <RadioButton
                id={`permission_creativeCommons_${index}`}
                label={i18n.t("notification.photos.permission.creativeCommons1")}
                name="permission"
                value="creativeCommons"
                checked={permission === "creativeCommons"}
                onChange={(evt) => updatePhoto(index, evt)}
              />
              <Button variant="supplementary" size="small" iconRight={<IconLinkExternal />} onClick={openCreativeCommons}>
                {i18n.t("notification.photos.permission.creativeCommons2")}
              </Button>
            </SelectionGroup>

            <TextInput
              id={`source_${index}`}
              className="formInput"
              label={i18n.t("notification.photos.source.label")}
              name="source"
              value={source}
              onChange={(evt) => updatePhoto(index, evt)}
              tooltipButtonLabel={i18n.t("notification.photos.source.tooltipLabel")}
              tooltipLabel={i18n.t("notification.photos.source.tooltipLabel")}
              tooltipText={i18n.t("notification.photos.source.tooltipText")}
              required
            />
            <Button variant="secondary" className="formInput" onClick={() => removePhoto(index)}>
              {i18n.t("notification.photos.remove")}
            </Button>
            <hr />
          </div>
        );
      })}

      {photos.length < MAX_PHOTOS && (
        <div>
          <Button variant="secondary" className={styles.addNew} iconRight={<IconUpload />} onClick={() => addPhoto(PhotoSourceType.Device)}>
            {i18n.t("notification.photos.addNewFromDevice")}
          </Button>
          <Button variant="secondary" className={styles.addNew} iconRight={<IconLink />} onClick={() => addPhoto(PhotoSourceType.Link)}>
            {i18n.t("notification.photos.addNewFromLink")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Photos;
