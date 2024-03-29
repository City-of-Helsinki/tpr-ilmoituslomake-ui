import React, { Dispatch, ChangeEvent, ReactElement, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { Button, IconLink, IconUpload, Link as HdsLink, RadioButton, SelectionGroup, TextArea, TextInput } from "hds-react";
import { v4 as uuidv4 } from "uuid";
import { NotificationAction } from "../../state/actions/notificationTypes";
import { NotificationValidationAction } from "../../state/actions/notificationValidationTypes";
import { setNotificationPhoto, removeNotificationPhoto } from "../../state/actions/notification";
import { setNotificationPhotoValidation, removeNotificationPhotoValidation } from "../../state/actions/notificationValidation";
import { RootState } from "../../state/reducers";
import {
  LANGUAGE_OPTIONS,
  MAX_LENGTH,
  MAX_LENGTH_PHOTO_DESC,
  MAX_LENGTH_URL,
  MAX_PHOTOS,
  PhotoPermission,
  PhotoSourceType,
} from "../../types/constants";
import { PhotoValidation } from "../../types/notification_validation";
import { isPhotoFieldValid, isPhotoAltTextValid, isPhotoBase64Valid } from "../../utils/validation";
import NotificationNotice from "../common/NotificationNotice";
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
    const fieldName = evt.target.name.indexOf("permission") >= 0 ? "permission" : evt.target.name;
    dispatch(setNotificationPhoto(index, { ...photos[index], [fieldName]: evt.target.value }));
  };

  const updatePhotoAltText = (index: number, evt: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setNotificationPhoto(index, { ...photos[index], altText: { ...photos[index].altText, [evt.target.name]: evt.target.value } }));
  };

  const addPhoto = (sourceType: PhotoSourceType) => {
    dispatch(
      setNotificationPhoto(-1, {
        uuid: uuidv4(),
        sourceType,
        url: "",
        altText: {
          fi: "",
          sv: "",
          en: "",
        },
        permission: undefined,
        source: "",
        mediaId: "",
        new: true,
      })
    );
    dispatchValidation(
      setNotificationPhotoValidation(-1, {
        url: { valid: true },
        altText: {
          fi: { valid: true },
          sv: { valid: true },
          en: { valid: true },
        },
        permission: { valid: true },
        source: { valid: true },
        base64: { valid: true },
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
    dispatch(setNotificationPhoto(index, { ...photos[index], url: photos[index].url.trim() }));
    isPhotoFieldValid(index, "url", notificationExtra, dispatchValidation);
  };

  const validatePhoto = (index: number, evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setNotificationPhoto(index, { ...photos[index], [evt.target.name]: (photos[index][evt.target.name] as string).trim() }));
    isPhotoFieldValid(index, evt.target.name, notificationExtra, dispatchValidation);
  };

  const validatePhotoAltText = (index: number, evt: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(
      setNotificationPhoto(index, {
        ...photos[index],
        altText: { ...photos[index].altText, [evt.target.name]: (photos[index].altText[evt.target.name] as string).trim() },
      })
    );
    isPhotoAltTextValid(index, evt.target.name, notificationExtra, dispatchValidation);
  };

  const validatePhotoBase64 = (index: number, base64: string) => {
    isPhotoBase64Valid(index, base64, notificationExtra, dispatchValidation);
  };

  const fetchPhoto = async (index: number, evt: ChangeEvent<HTMLInputElement>) => {
    const { new: isNewImage, sourceType, url } = photos[index];

    if (isNewImage && sourceType === PhotoSourceType.Device && evt && evt.target && evt.target.files && evt.target.files.length > 0) {
      const file = evt.target.files[0];
      dispatchValidation(setNotificationPhotoValidation(index, { url: { valid: true }, base64: { valid: true } }));

      // Read the image file and store it as a base64 string
      const reader = new FileReader();
      reader.onload = (fileEvt: ProgressEvent<FileReader>) => {
        if (fileEvt && fileEvt.target && fileEvt.target.result) {
          const base64 = fileEvt.target.result as string;
          dispatch(setNotificationPhoto(index, { ...photos[index], url: file.name, base64, preview: base64 }));
          validatePhotoBase64(index, base64);
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

    if (!isNewImage || sourceType === PhotoSourceType.Link) {
      // The backend will fetch the image using the url, so just validate it here
      validateUrl(index);
      dispatch(setNotificationPhoto(index, { ...photos[index], base64: "", preview: url }));
    }
  };

  return (
    <div className={`formSection ${styles.photos}`}>
      {photos.map(({ new: isNewImage, sourceType, url, altText, permission, source, preview }, index) => {
        // Note: before saving, new images can be uploaded from the device, but after saving, all images have a url link
        const key = `photo_${index}`;
        return (
          <div key={key}>
            <h3>{`${i18n.t("notification.photos.photo.title")} ${index + 1}`}</h3>
            <div className={styles.notice}>
              <NotificationNotice messageKey="notification.photos.photo.notice1" messageKey2="notification.photos.photo.notice2" />
            </div>

            {isNewImage && sourceType === PhotoSourceType.Device && (
              <>
                <TextInput
                  id={`url_${index}`}
                  className="formInput disabledTextColor"
                  label={i18n.t("notification.photos.url.labelDevice")}
                  name="url"
                  value={url}
                  invalid={!photosValid[index].base64.valid}
                  errorText={
                    !photosValid[index].base64.valid
                      ? i18n.t(photosValid[index].base64.message as string).replace("$fieldName", i18n.t("notification.photos.photo.title"))
                      : ""
                  }
                  required
                  aria-required
                  disabled
                />

                <input className="hidden" type="file" ref={ref} onChange={(evt) => fetchPhoto(index, evt)} />
                <div className={styles.selectRemove}>
                  <Button variant="secondary" onClick={() => selectPhoto()}>
                    {i18n.t("notification.button.selectFromDevice")}
                  </Button>
                </div>
                <div className={styles.selectRemove}>
                  <Button variant="secondary" onClick={() => removePhoto(index)}>
                    {i18n.t("notification.photos.remove")}
                  </Button>
                </div>
              </>
            )}

            {(!isNewImage || sourceType === PhotoSourceType.Link) && (
              <>
                <TextInput
                  id={`url_${index}`}
                  className="formInput disabledTextColor"
                  label={i18n.t("notification.photos.url.labelLink")}
                  name="url"
                  value={url}
                  inputMode="url"
                  maxLength={MAX_LENGTH_URL}
                  onChange={(evt) => updatePhoto(index, evt)}
                  onBlur={(evt) => fetchPhoto(index, evt)}
                  invalid={!photosValid[index].url.valid}
                  errorText={
                    !photosValid[index].url.valid
                      ? i18n.t(photosValid[index].url.message as string).replace("$fieldName", i18n.t("notification.photos.url.labelLink"))
                      : ""
                  }
                  required
                  aria-required
                  disabled={!isNewImage}
                />
                <div className={styles.selectRemove}>
                  <Button variant="secondary" onClick={() => removePhoto(index)}>
                    {i18n.t("notification.photos.remove")}
                  </Button>
                </div>
              </>
            )}

            {preview && preview.length > 0 && (
              <div className={styles.imagePreview}>
                <img src={preview} alt="" />
              </div>
            )}

            {/* {photosValid[index].url.valid && preview && preview.length > 0 && ( */}
            {true && (
              <>
                <div className={inputLanguages.length > 1 ? "languageSection" : ""}>
                  {inputLanguages.length > 1 && <h3>{i18n.t("notification.photos.altText.label")}</h3>}
                  {LANGUAGE_OPTIONS.map((option) => {
                    const key2 = `altText_${index}_${option}`;
                    const label = `${i18n.t("notification.photos.altText.label")} ${i18n.t(`common.inLanguage.${option}`)}`;
                    return inputLanguages.includes(option) ? (
                      <TextArea
                        id={`altText_${index}_${option}`}
                        key={key2}
                        lang={option}
                        className="formInput"
                        rows={3}
                        label={label}
                        name={option}
                        value={altText[option] as string}
                        maxLength={MAX_LENGTH_PHOTO_DESC}
                        onChange={(evt) => updatePhotoAltText(index, evt)}
                        onBlur={(evt) => validatePhotoAltText(index, evt)}
                        helperText={i18n.t("notification.photos.altText.helperText")}
                        tooltipButtonLabel={i18n.t("notification.button.openHelp")}
                        tooltipLabel={i18n.t("notification.photos.altText.tooltipLabel")}
                        tooltipText={i18n.t("notification.photos.altText.tooltipText")}
                        invalid={!photosValid[index].altText[option].valid}
                        errorText={
                          !photosValid[index].altText[option].valid
                            ? i18n.t(photosValid[index].altText[option].message as string).replace("$fieldName", label)
                            : ""
                        }
                      />
                    ) : null;
                  })}
                </div>

                <h5>{i18n.t("notification.photos.permission.title")}</h5>
                <div className={styles.notice}>
                  <NotificationNotice messageKey="notification.photos.permission.notice" />
                </div>

                <SelectionGroup
                  id={`permission_${index}`}
                  direction="vertical"
                  label={i18n.t("notification.photos.permission.label")}
                  errorText={
                    !photosValid[index].permission.valid
                      ? i18n.t(photosValid[index].permission.message as string).replace("$fieldName", i18n.t("notification.photos.permission.label"))
                      : ""
                  }
                  required
                  aria-required
                >
                  <RadioButton
                    id={`permission_locationOnly_${index}`}
                    label={i18n.t("notification.photos.permission.locationOnly")}
                    name={`permission_${index}`}
                    value={PhotoPermission.LocationOnly}
                    checked={permission === PhotoPermission.LocationOnly}
                    onChange={(evt) => updatePhoto(index, evt)}
                  />
                  <RadioButton
                    id={`permission_creativeCommons_${index}`}
                    label={i18n.t("notification.photos.permission.creativeCommons1")}
                    name={`permission_${index}`}
                    value={PhotoPermission.CreativeCommons}
                    checked={permission === PhotoPermission.CreativeCommons}
                    onChange={(evt) => updatePhoto(index, evt)}
                  />
                </SelectionGroup>
                <div className={styles.creativeCommonsLink}>
                  <HdsLink
                    href="https://creativecommons.org/licenses/by/4.0/"
                    size="M"
                    openInNewTab
                    openInNewTabAriaLabel={i18n.t("common.opensInANewTab")}
                    external
                    openInExternalDomainAriaLabel={i18n.t("common.opensExternal")}
                    disableVisitedStyles
                  >
                    {i18n.t("notification.photos.permission.creativeCommons2")}
                  </HdsLink>
                </div>

                <TextInput
                  id={`source_${index}`}
                  className="formInput"
                  label={i18n.t("notification.photos.source.label")}
                  name="source"
                  value={source}
                  maxLength={MAX_LENGTH}
                  onChange={(evt) => updatePhoto(index, evt)}
                  onBlur={(evt) => validatePhoto(index, evt)}
                  invalid={!photosValid[index].source.valid}
                  errorText={
                    !photosValid[index].source.valid
                      ? i18n.t(photosValid[index].source.message as string).replace("$fieldName", i18n.t("notification.photos.source.label"))
                      : ""
                  }
                  tooltipButtonLabel={i18n.t("notification.button.openHelp")}
                  tooltipLabel={i18n.t("notification.photos.source.tooltipLabel")}
                  tooltipText={i18n.t("notification.photos.source.tooltipText")}
                  required
                  aria-required
                />
              </>
            )}
            <hr />
          </div>
        );
      })}

      {photos.length < MAX_PHOTOS && (
        <div>
          <div className={styles.addNew}>
            <Button variant="secondary" iconRight={<IconUpload aria-hidden />} onClick={() => addPhoto(PhotoSourceType.Device)}>
              {i18n.t("notification.photos.addNewFromDevice")}
            </Button>
          </div>
          <div className={styles.addNew}>
            <Button variant="secondary" iconRight={<IconLink aria-hidden />} onClick={() => addPhoto(PhotoSourceType.Link)}>
              {i18n.t("notification.photos.addNewFromLink")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Photos;
