import React, { Dispatch, ChangeEvent, ReactElement, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput, Button, IconUpload, IconLink, TextArea, SelectionGroup, RadioButton, IconLinkExternal } from "hds-react";
import { NotificationAction, NotificationValidationAction } from "../../state/actions/types";
import { setNotificationPhoto, removeNotificationPhoto } from "../../state/actions/notification";
import { setNotificationPhotoValidation, removeNotificationPhotoValidation } from "../../state/actions/notificationValidation";
import { RootState } from "../../state/reducers";
import { LANGUAGE_OPTIONS, MAX_PHOTOS, PhotoSourceType } from "../../types/constants";
import { PhotoValidation } from "../../types/notification_validation";
import { isPhotoFieldValid, isPhotoAltTextValid } from "../../utils/validation";
import Notice from "./Notice";
import styles from "./Photos.module.scss";

const Photos = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const dispatchValidation = useDispatch<Dispatch<NotificationValidationAction>>();
  const ref = useRef<HTMLInputElement>(null);

  const notificationExtra = useSelector((state: RootState) => state.notification.notificationExtra);
  const { inputLanguages, photos = [] } = notificationExtra;

  const notificationValidation = useSelector((state: RootState) => state.notificationValidation.notificationValidation);
  const { photos: photosValid } = notificationValidation;

  const updatePhoto = (index: number, evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setNotificationPhoto(index, { ...photos[index], [evt.target.name]: evt.target.value }));
  };

  const updatePhotoAltText = (index: number, evt: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setNotificationPhoto(index, { ...photos[index], altText: { ...photos[index].altText, [evt.target.name]: evt.target.value } }));
  };

  const addPhoto = (sourceType: PhotoSourceType) => {
    dispatch(
      setNotificationPhoto(-1, {
        sourceType,
        url: "",
        altText: {
          fi: "",
          sv: "",
          en: "",
        },
        permission: "",
        source: "",
      })
    );
    dispatchValidation(
      setNotificationPhotoValidation(-1, {
        url: true,
        altText: {
          fi: true,
          sv: true,
          en: true,
        },
        permission: true,
        source: true,
      } as PhotoValidation)
    );
  };

  const removePhoto = (index: number) => {
    dispatch(removeNotificationPhoto(index));
    dispatchValidation(removeNotificationPhotoValidation(index));
  };

  const selectPhoto = () => {
    if (ref.current) {
      ref.current.click();
    }
  };

  const validateUrl = (index: number) => {
    isPhotoFieldValid(index, "url", notificationExtra, dispatchValidation);
  };

  const validatePhoto = (index: number, evt: ChangeEvent<HTMLInputElement>) => {
    isPhotoFieldValid(index, evt.target.name, notificationExtra, dispatchValidation);
  };

  const validatePhotoAltText = (index: number, evt: ChangeEvent<HTMLTextAreaElement>) => {
    isPhotoAltTextValid(index, evt.target.name, notificationExtra, dispatchValidation);
  };

  const fetchPhoto = async (index: number, evt: ChangeEvent<HTMLInputElement>) => {
    const { sourceType, url } = photos[index];

    if (sourceType === PhotoSourceType.Device && evt && evt.target && evt.target.files && evt.target.files.length > 0) {
      const file = evt.target.files[0];
      dispatchValidation(setNotificationPhotoValidation(index, { url: true }));

      // Read the image file and store it as a base64 string
      const reader = new FileReader();
      reader.onload = (fileEvt: ProgressEvent<FileReader>) => {
        if (fileEvt && fileEvt.target && fileEvt.target.result) {
          const base64 = fileEvt.target.result as string;
          dispatch(setNotificationPhoto(index, { ...photos[index], url: file.name, base64, preview: base64 }));
        } else {
          dispatch(setNotificationPhoto(index, { ...photos[index], url: "", base64: "", preview: "" }));
        }
      };
      reader.onerror = () => {
        console.log("ERROR", reader.error);
        dispatch(setNotificationPhoto(index, { ...photos[index], url: "", base64: "", preview: "" }));
      };
      reader.readAsDataURL(file);
    }

    if (sourceType === PhotoSourceType.Link) {
      // The backend will fetch the image using the url, so just validate it here
      validateUrl(index);
      dispatch(setNotificationPhoto(index, { ...photos[index], base64: "", preview: url }));
    }
  };

  const openCreativeCommons = () => {
    window.open("https://creativecommons.org/licenses/by/4.0/", "_blank");
  };

  return (
    <div className={styles.photos}>
      {photos.map(({ sourceType, url, altText, permission, source, preview }, index) => {
        const key = `photo_${index}`;
        return (
          <div key={key}>
            <h3>{`${i18n.t("notification.photos.photo.title")} ${index + 1}`}</h3>
            <Notice messageKey="notification.photos.photo.notice1" messageKey2="notification.photos.photo.notice2" />

            {sourceType === PhotoSourceType.Device && (
              <>
                <TextInput
                  id={`url_${index}`}
                  className="formInput"
                  label={i18n.t("notification.photos.url.labelDevice")}
                  name="url"
                  value={url}
                  invalid={photosValid[index] && !photosValid[index].url}
                  errorText={photosValid[index] && !photosValid[index].url ? i18n.t("notification.toast.validationFailed.title") : ""}
                  required
                  disabled
                />

                <input className="hidden" type="file" ref={ref} onChange={(evt) => fetchPhoto(index, evt)} />
                <Button variant="secondary" className="formInput" onClick={() => selectPhoto()}>
                  {i18n.t("notification.button.selectFromDevice")}
                </Button>
                <Button variant="secondary" className="formInput" onClick={() => removePhoto(index)}>
                  {i18n.t("notification.photos.remove")}
                </Button>

                {preview && preview.length > 0 && (
                  <div className={styles.imagePreview}>
                    <img src={preview} alt="" />
                  </div>
                )}
              </>
            )}

            {sourceType === PhotoSourceType.Link && (
              <>
                <TextInput
                  id={`url_${index}`}
                  className="formInput"
                  label={i18n.t("notification.photos.url.labelLink")}
                  name="url"
                  value={url}
                  onChange={(evt) => updatePhoto(index, evt)}
                  onBlur={(evt) => fetchPhoto(index, evt)}
                  invalid={photosValid[index] && !photosValid[index].url}
                  errorText={photosValid[index] && !photosValid[index].url ? i18n.t("notification.toast.validationFailed.title") : ""}
                  required
                />
                <Button variant="secondary" className="formInput" onClick={() => removePhoto(index)}>
                  {i18n.t("notification.photos.remove")}
                </Button>

                {photosValid[index] && photosValid[index].url && preview && preview.length > 0 && (
                  <div className={styles.imagePreview}>
                    <img src={preview} alt="" />
                  </div>
                )}
              </>
            )}

            {photosValid[index] && photosValid[index].url && preview && preview.length > 0 && (
              <>
                <div className={inputLanguages.length > 1 ? "languageSection" : ""}>
                  {inputLanguages.length > 1 && <h3>{i18n.t("notification.photos.altText.label")}</h3>}
                  {LANGUAGE_OPTIONS.map((option) =>
                    inputLanguages.includes(option) ? (
                      <TextArea
                        id={`altText_${index}_${option}`}
                        className="formInput"
                        rows={6}
                        label={`${i18n.t("notification.photos.altText.label")} ${i18n.t(`general.inLanguage.${option}`)}`}
                        name={option}
                        value={altText[option] as string}
                        onChange={(evt) => updatePhotoAltText(index, evt)}
                        onBlur={(evt) => validatePhotoAltText(index, evt)}
                        helperText={i18n.t("notification.photos.altText.helperText")}
                        tooltipButtonLabel={i18n.t("notification.photos.altText.tooltipLabel")}
                        tooltipLabel={i18n.t("notification.photos.altText.tooltipLabel")}
                        tooltipText={i18n.t("notification.photos.altText.tooltipText")}
                        invalid={photosValid[index] && !photosValid[index].altText[option]}
                        errorText={
                          photosValid[index] && !photosValid[index].altText[option] ? i18n.t("notification.toast.validationFailed.title") : ""
                        }
                      />
                    ) : null
                  )}
                </div>

                <h5>{i18n.t("notification.photos.permission.title")}</h5>
                <Notice messageKey="notification.photos.permission.notice" />

                <SelectionGroup
                  direction="vertical"
                  label={i18n.t("notification.photos.permission.label")}
                  errorText={photosValid[index] && !photosValid[index].permission ? i18n.t("notification.toast.validationFailed.title") : ""}
                  required
                >
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
                </SelectionGroup>
                <Button
                  variant="supplementary"
                  size="small"
                  className={styles.creativeCommonsLink}
                  iconRight={<IconLinkExternal />}
                  onClick={openCreativeCommons}
                >
                  {i18n.t("notification.photos.permission.creativeCommons2")}
                </Button>

                <TextInput
                  id={`source_${index}`}
                  className="formInput"
                  label={i18n.t("notification.photos.source.label")}
                  name="source"
                  value={source}
                  onChange={(evt) => updatePhoto(index, evt)}
                  onBlur={(evt) => validatePhoto(index, evt)}
                  invalid={photosValid[index] && !photosValid[index].source}
                  errorText={photosValid[index] && !photosValid[index].source ? i18n.t("notification.toast.validationFailed.title") : ""}
                  tooltipButtonLabel={i18n.t("notification.photos.source.tooltipLabel")}
                  tooltipLabel={i18n.t("notification.photos.source.tooltipLabel")}
                  tooltipText={i18n.t("notification.photos.source.tooltipText")}
                  required
                />
              </>
            )}
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
