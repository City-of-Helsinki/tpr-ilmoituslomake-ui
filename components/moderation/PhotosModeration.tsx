import React, { Dispatch, ChangeEvent, ReactElement, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { Button, IconLink, IconUpload, Notification as HdsNotification, TextArea, TextInput } from "hds-react";
import { v4 as uuidv4 } from "uuid";
import { ModerationAction } from "../../state/actions/moderationTypes";
import { ModerationStatusAction } from "../../state/actions/moderationStatusTypes";
import { removeModerationPhoto, setModerationPhoto } from "../../state/actions/moderation";
import { removeModerationPhotoStatus, setModerationPhotoAltTextStatus, setModerationPhotoStatus } from "../../state/actions/moderationStatus";
import { RootState } from "../../state/reducers";
import { LANGUAGE_OPTIONS, ModerationStatus, PhotoPermission, PhotoSourceType, TaskStatus, TaskType } from "../../types/constants";
import { PhotoStatus } from "../../types/moderation_status";
import ModerationSection from "./ModerationSection";
import PhotoPreviewModeration from "./PhotoPreviewModeration";
import SelectionGroupWrapper from "./SelectionGroupWrapper";
import styles from "./PhotosModeration.module.scss";

const PhotosModeration = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<ModerationAction>>();
  const dispatchStatus = useDispatch<Dispatch<ModerationStatusAction>>();
  const ref = useRef<HTMLInputElement>(null);

  const moderationExtra = useSelector((state: RootState) => state.moderation.moderationExtra);
  const { photosUuids, photosSelected, photosModified, taskType, taskStatus } = moderationExtra;

  const moderationStatus = useSelector((state: RootState) => state.moderationStatus.moderationStatus);
  const { photos: photosStatus } = moderationStatus;

  const pageStatus = useSelector((state: RootState) => state.moderationStatus.pageStatus);

  const updatePhoto = (index: number, evt: ChangeEvent<HTMLInputElement>) => {
    const fieldName = evt.target.name.indexOf("permission") >= 0 ? "permission" : evt.target.name;
    dispatch(setModerationPhoto(index, { ...photosModified[index], [fieldName]: evt.target.value }));
  };

  const updatePhotoAltText = (index: number, evt: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(
      setModerationPhoto(index, { ...photosModified[index], altText: { ...photosModified[index].altText, [evt.target.name]: evt.target.value } })
    );
  };

  const addPhoto = (sourceType: PhotoSourceType) => {
    dispatch(
      setModerationPhoto(-1, {
        uuid: uuidv4(),
        sourceType,
        url: "",
        altText: {
          fi: "",
          sv: "",
          en: "",
        },
        permission: PhotoPermission.LocationOnly,
        source: "",
        mediaId: "",
        new: true,
      })
    );
    dispatchStatus(
      setModerationPhotoStatus(-1, {
        url: ModerationStatus.Edited,
        altText: {
          fi: ModerationStatus.Edited,
          sv: ModerationStatus.Edited,
          en: ModerationStatus.Edited,
        },
        permission: ModerationStatus.Edited,
        source: ModerationStatus.Edited,
      } as PhotoStatus)
    );
  };

  const removePhoto = (index: number) => {
    dispatch(removeModerationPhoto(index));
    dispatchStatus(removeModerationPhotoStatus(index));
  };

  const selectPhoto = () => {
    if (ref.current) {
      ref.current.click();
    }
  };

  const updatePhotoStatus = (index: number, photoField: string, status: ModerationStatus) => {
    dispatchStatus(setModerationPhotoStatus(index, { [photoField]: status }));
  };

  const updatePhotoAltTextStatus = (index: number, language: string, status: ModerationStatus) => {
    dispatchStatus(setModerationPhotoAltTextStatus(index, { [language]: status }));
  };

  const fetchPhoto = async (index: number, evt: ChangeEvent<HTMLInputElement>) => {
    const { new: isNewImage, sourceType, url } = photosModified[index];

    if (isNewImage && sourceType === PhotoSourceType.Device && evt && evt.target && evt.target.files && evt.target.files.length > 0) {
      const file = evt.target.files[0];

      // Read the image file and store it as a base64 string
      const reader = new FileReader();
      reader.onload = (fileEvt: ProgressEvent<FileReader>) => {
        if (fileEvt && fileEvt.target && fileEvt.target.result) {
          const base64 = fileEvt.target.result as string;
          dispatch(setModerationPhoto(index, { ...photosModified[index], url: file.name, base64, preview: base64 }));
        } else {
          dispatch(setModerationPhoto(index, { ...photosModified[index], url: "", base64: "", preview: "" }));
        }
      };
      reader.onerror = () => {
        console.log("ERROR", reader.error);
        dispatch(setModerationPhoto(index, { ...photosModified[index], url: "", base64: "", preview: "" }));
      };
      reader.readAsDataURL(file);
    }

    if (!isNewImage || sourceType === PhotoSourceType.Link) {
      // The backend will fetch the image using the url
      dispatch(setModerationPhoto(index, { ...photosModified[index], base64: "", preview: url }));
    }
  };

  return (
    <div>
      {photosUuids.map((uuid, index) => {
        const key = `photo_${index}`;
        const modifiedImage = photosModified.find((i) => i.uuid === uuid);
        const { new: isNewImage, sourceType: sourceTypeModified } = modifiedImage || {};
        const urlLabelKey = sourceTypeModified === PhotoSourceType.Device ? "moderation.photos.url.labelDevice" : "moderation.photos.url.labelLink";

        return (
          <div key={key} className="formSection">
            <div className="gridLayoutContainer moderation">
              <ModerationSection
                id={`url_${index}`}
                fieldName="url"
                selectedValue={photosSelected[index] && photosSelected[index].url}
                modifiedValue={photosModified[index] && photosModified[index].url}
                moderationStatus={photosStatus[index].url}
                taskType={taskType}
                taskStatus={taskStatus}
                selectedHeaderText={`${i18n.t("moderation.photos.photo.title")} ${index + 1}${i18n.t("moderation.task.selected")}`}
                modifiedHeaderText={`${i18n.t("moderation.photos.photo.title")} ${index + 1}${i18n.t("moderation.task.modified")}`}
                modifyButtonLabel={i18n.t(urlLabelKey)}
                modifyButtonHidden
                actionButtonHidden={!modifiedImage}
                bypassModifiedFieldCheck={!modifiedImage}
                forceDisabled={!isNewImage || sourceTypeModified === PhotoSourceType.Device}
                changeCallback={(evt: ChangeEvent<HTMLInputElement>) => updatePhoto(index, evt)}
                blurCallback={(evt: ChangeEvent<HTMLInputElement>) => fetchPhoto(index, evt)}
                statusCallback={(fieldName, status) => updatePhotoStatus(index, fieldName, status)}
                ModerationComponent={<TextInput id={`url_${index}`} label={i18n.t(urlLabelKey)} name="url" />}
              />
            </div>

            <PhotoPreviewModeration index={index} />

            {(taskType === TaskType.NewPlace ||
              taskType === TaskType.PlaceChange ||
              taskType === TaskType.ChangeTip ||
              taskType === TaskType.AddTip ||
              taskType === TaskType.ModeratorChange ||
              taskType === TaskType.ModeratorAdd ||
              pageStatus === ModerationStatus.Edited) && (
              <div className="gridLayoutContainer moderation">
                {(taskType === TaskType.NewPlace || taskType === TaskType.PlaceChange) && (
                  <div className={styles.gridSelected}>
                    {!modifiedImage && (
                      <HdsNotification size="small" type="alert">
                        {i18n.t(`moderation.photos.removed`)}
                      </HdsNotification>
                    )}
                  </div>
                )}
                <div
                  className={
                    taskType === TaskType.NewPlace ||
                    taskType === TaskType.PlaceChange ||
                    taskType === TaskType.ChangeTip ||
                    taskType === TaskType.AddTip ||
                    taskType === TaskType.ModeratorChange ||
                    taskType === TaskType.ModeratorAdd
                      ? styles.gridModified
                      : styles.gridSelected
                  }
                >
                  {isNewImage && sourceTypeModified === PhotoSourceType.Device && (
                    <>
                      <input className="hidden" type="file" ref={ref} onChange={(evt) => fetchPhoto(index, evt)} />
                      <div className={styles.gridButton}>
                        <Button variant="secondary" onClick={() => selectPhoto()}>
                          {i18n.t("moderation.button.selectFromDevice")}
                        </Button>
                      </div>
                    </>
                  )}
                  {modifiedImage && (
                    <div className={styles.gridButton}>
                      <Button
                        variant="secondary"
                        onClick={() => removePhoto(index)}
                        disabled={taskStatus === TaskStatus.Closed || taskStatus === TaskStatus.Rejected || taskStatus === TaskStatus.Cancelled}
                      >
                        {i18n.t("moderation.photos.remove")}
                      </Button>
                    </div>
                  )}
                </div>
                <div className={styles.gridActionButton} />
              </div>
            )}

            <div className="languageSection gridLayoutContainer moderation">
              {LANGUAGE_OPTIONS.map((option) => {
                const altTextKey = `altText_${option}_${index}`;

                return (
                  <ModerationSection
                    id={altTextKey}
                    key={altTextKey}
                    fieldName={option}
                    selectedValue={photosSelected[index] && (photosSelected[index].altText[option] as string)}
                    modifiedValue={photosModified[index] && (photosModified[index].altText[option] as string)}
                    moderationStatus={photosStatus[index].altText[option]}
                    taskType={taskType}
                    taskStatus={taskStatus}
                    helperText={i18n.t("moderation.photos.altText.helperText")}
                    tooltipButtonLabel={i18n.t("moderation.button.openHelp")}
                    tooltipLabel={i18n.t("moderation.photos.altText.tooltipLabel")}
                    tooltipText={i18n.t("moderation.photos.altText.tooltipText")}
                    modifyButtonLabel={i18n.t(`common.inLanguage.${option}`)}
                    modifyButtonHidden={!modifiedImage}
                    actionButtonHidden={!modifiedImage}
                    bypassModifiedFieldCheck={!modifiedImage}
                    changeCallback={(evt: ChangeEvent<HTMLTextAreaElement>) => updatePhotoAltText(index, evt)}
                    statusCallback={(language, status) => updatePhotoAltTextStatus(index, language, status)}
                    ModerationComponent={
                      <TextArea
                        id={altTextKey}
                        lang={option}
                        rows={3}
                        label={`${i18n.t("moderation.photos.altText.label")} ${i18n.t(`common.inLanguage.${option}`)}`}
                        name={option}
                      />
                    }
                  />
                );
              })}
            </div>

            <div className="gridLayoutContainer moderation">
              <ModerationSection
                id={`permission_${index}`}
                fieldName="permission"
                selectedValue={photosSelected[index] && photosSelected[index].permission}
                modifiedValue={photosModified[index] && photosModified[index].permission}
                moderationStatus={photosStatus[index].permission}
                taskType={taskType}
                taskStatus={taskStatus}
                modifyButtonHidden={!modifiedImage}
                actionButtonHidden={!modifiedImage}
                bypassModifiedFieldCheck={!modifiedImage}
                changeCallback={(evt: ChangeEvent<HTMLInputElement>) => updatePhoto(index, evt)}
                statusCallback={(fieldName, status) => updatePhotoStatus(index, fieldName, status)}
                ModerationComponent={
                  <SelectionGroupWrapper
                    id={`permission_${index}`}
                    horizontal={false}
                    label={i18n.t("moderation.photos.permission.label")}
                    radioButtonLabels={[i18n.t("moderation.photos.permission.locationOnly"), i18n.t("moderation.photos.permission.creativeCommons")]}
                    radioButtonValues={[PhotoPermission.LocationOnly, PhotoPermission.CreativeCommons]}
                  />
                }
                isSelectionGroupWrapper
              />

              <ModerationSection
                id={`source_${index}`}
                fieldName="source"
                selectedValue={photosSelected[index] && photosSelected[index].source}
                modifiedValue={photosModified[index] && photosModified[index].source}
                moderationStatus={photosStatus[index].source}
                taskType={taskType}
                taskStatus={taskStatus}
                tooltipButtonLabel={i18n.t("moderation.button.openHelp")}
                tooltipLabel={i18n.t("moderation.photos.source.tooltipLabel")}
                tooltipText={i18n.t("moderation.photos.source.tooltipText")}
                modifyButtonHidden={!modifiedImage}
                actionButtonHidden={!modifiedImage}
                bypassModifiedFieldCheck={!modifiedImage}
                changeCallback={(evt: ChangeEvent<HTMLInputElement>) => updatePhoto(index, evt)}
                statusCallback={(fieldName, status) => updatePhotoStatus(index, fieldName, status)}
                ModerationComponent={<TextInput id={`source_${index}`} label={i18n.t("moderation.photos.source.label")} name="source" />}
              />
            </div>
            <hr />
          </div>
        );
      })}

      {(taskType === TaskType.NewPlace ||
        taskType === TaskType.PlaceChange ||
        taskType === TaskType.ChangeTip ||
        taskType === TaskType.AddTip ||
        taskType === TaskType.ModeratorChange ||
        taskType === TaskType.ModeratorAdd ||
        pageStatus === ModerationStatus.Edited) &&
        taskStatus !== TaskStatus.Closed &&
        taskStatus !== TaskStatus.Rejected &&
        taskStatus !== TaskStatus.Cancelled && (
          <div className={`gridLayoutContainer moderation ${styles.addNewContainer}`}>
            <div className={styles.gridSelected}>
              <div className={styles.gridButton}>
                <Button variant="secondary" iconRight={<IconUpload aria-hidden />} onClick={() => addPhoto(PhotoSourceType.Device)}>
                  {i18n.t("moderation.photos.addNewFromDevice")}
                </Button>
              </div>
              <div className={styles.gridButton}>
                <Button variant="secondary" iconRight={<IconLink aria-hidden />} onClick={() => addPhoto(PhotoSourceType.Link)}>
                  {i18n.t("moderation.photos.addNewFromLink")}
                </Button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default PhotosModeration;
