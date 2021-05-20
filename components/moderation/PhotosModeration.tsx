import React, { Dispatch, ChangeEvent, ReactElement, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput, Button, TextArea } from "hds-react";
import { ModerationAction, ModerationStatusAction } from "../../state/actions/types";
import { removeModerationPhoto, setModerationPhoto } from "../../state/actions/moderation";
import { removeModerationPhotoStatus, setModerationPhotoAltTextStatus, setModerationPhotoStatus } from "../../state/actions/moderationStatus";
import { RootState } from "../../state/reducers";
import { LANGUAGE_OPTIONS, ModerationStatus, PhotoPermission, PhotoSourceType, TaskType } from "../../types/constants";
import ModerationSection from "./ModerationSection";
import PhotoPreviewModeration from "./PhotoPreviewModeration";
import SelectionGroupWrapper from "./SelectionGroupWrapper";

const PhotosModeration = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<ModerationAction>>();
  const dispatchStatus = useDispatch<Dispatch<ModerationStatusAction>>();

  const moderationExtra = useSelector((state: RootState) => state.moderation.moderationExtra);
  const { photosSelected, photosModified, taskType, taskStatus } = moderationExtra;

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

  const removePhoto = (index: number) => {
    dispatch(removeModerationPhoto(index));
    dispatchStatus(removeModerationPhotoStatus(index));
  };

  const updatePhotoStatus = (index: number, photoField: string, status: ModerationStatus) => {
    dispatchStatus(setModerationPhotoStatus(index, { [photoField]: status }));
  };

  const updatePhotoAltTextStatus = (index: number, language: string, status: ModerationStatus) => {
    dispatchStatus(setModerationPhotoAltTextStatus(index, { [language]: status }));
  };

  return (
    <div className="formSection">
      {photosModified.map(({ sourceType: sourceTypeModified }, index) => {
        const key = `photo_${index}`;
        const urlLabelKey = sourceTypeModified === PhotoSourceType.Device ? "moderation.photos.url.labelDevice" : "moderation.photos.url.labelLink";

        return (
          <Fragment key={key}>
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
                forceDisabled
                changeCallback={(evt: ChangeEvent<HTMLInputElement>) => updatePhoto(index, evt)}
                statusCallback={(fieldName, status) => updatePhotoStatus(index, fieldName, status)}
                ModerationComponent={<TextInput id={`url_${index}`} label={i18n.t(urlLabelKey)} name="url" />}
              />
            </div>

            <PhotoPreviewModeration index={index} />

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
                    modifyButtonLabel={`${i18n.t("moderation.photos.altText.label")} ${i18n.t(`common.inLanguage.${option}`)}`}
                    changeCallback={(evt: ChangeEvent<HTMLTextAreaElement>) => updatePhotoAltText(index, evt)}
                    statusCallback={(language, status) => updatePhotoAltTextStatus(index, language, status)}
                    ModerationComponent={
                      <TextArea
                        id={altTextKey}
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
                modifyButtonLabel={i18n.t("moderation.photos.permission.label")}
                changeCallback={(evt: ChangeEvent<HTMLInputElement>) => updatePhoto(index, evt)}
                statusCallback={(fieldName, status) => updatePhotoStatus(index, fieldName, status)}
                ModerationComponent={
                  <SelectionGroupWrapper
                    id={`permission_${index}`}
                    label={i18n.t("moderation.photos.permission.label")}
                    radioButtonLabels={[i18n.t("moderation.photos.permission.myHelsinki"), i18n.t("moderation.photos.permission.creativeCommons")]}
                    radioButtonValues={[PhotoPermission.MyHelsinki, PhotoPermission.CreativeCommons]}
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
                modifyButtonLabel={i18n.t("moderation.photos.source.label")}
                changeCallback={(evt: ChangeEvent<HTMLInputElement>) => updatePhoto(index, evt)}
                statusCallback={(fieldName, status) => updatePhotoStatus(index, fieldName, status)}
                ModerationComponent={<TextInput id={`source_${index}`} label={i18n.t("moderation.photos.source.label")} name="source" />}
              />

              {(taskType === TaskType.NewPlace || taskType === TaskType.PlaceChange || pageStatus === ModerationStatus.Edited) && (
                <div className="gridColumn1">
                  <Button variant="secondary" onClick={() => removePhoto(index)}>
                    {i18n.t("moderation.photos.remove")}
                  </Button>
                </div>
              )}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
};

export default PhotosModeration;
