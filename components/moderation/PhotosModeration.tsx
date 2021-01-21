import React, { Dispatch, ChangeEvent, ReactElement, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput, Button, IconUpload, IconLink, TextArea, SelectionGroup, RadioButton, IconLinkExternal } from "hds-react";
import { ModerationAction, ModerationStatusAction } from "../../state/actions/types";
import { removeModerationPhoto, setModerationPhoto } from "../../state/actions/moderation";
import { removeModerationPhotoStatus, setModerationPhotoAltTextStatus, setModerationPhotoStatus } from "../../state/actions/moderationStatus";
import { RootState } from "../../state/reducers";
import { LANGUAGE_OPTIONS, ModerationStatus, PhotoPermission, PhotoSourceType } from "../../types/constants";
import ActionButton from "./ActionButton";
import ModifyButton from "./ModifyButton";
import ModerationSection from "./ModerationSection";

const PhotosModeration = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<ModerationAction>>();
  const dispatchStatus = useDispatch<Dispatch<ModerationStatusAction>>();

  const moderationExtra = useSelector((state: RootState) => state.moderation.moderationExtra);
  const { photosSelected, photosModified } = moderationExtra;

  const moderationStatus = useSelector((state: RootState) => state.moderationStatus.moderationStatus);
  const { photos: photosStatus } = moderationStatus;

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
      {photosSelected.map(({ sourceType: sourceTypeSelected }, index) => {
        const key = `photo_${index}`;
        const urlLabelKey = sourceTypeSelected === PhotoSourceType.Device ? "moderation.photos.url.labelDevice" : "moderation.photos.url.labelLink";

        return (
          <Fragment key={key}>
            <div className="gridLayoutContainer moderation">
              <h4 className="gridColumn1 moderation">{`${i18n.t("moderation.photos.photo.title")} ${index + 1}${i18n.t(
                "moderation.task.selected"
              )}`}</h4>
              <h4 className="gridColumn2 moderation">{`${i18n.t("moderation.photos.photo.title")} ${index + 1}${i18n.t(
                "moderation.task.modified"
              )}`}</h4>

              <ModerationSection
                id={`url_${index}`}
                fieldName="url"
                selectedValue={photosSelected[index].url}
                modifiedValue={photosModified[index].url}
                status={photosStatus[index].url}
                modifyButtonLabel={i18n.t(urlLabelKey)}
                forceModifiedDisabled={sourceTypeSelected === PhotoSourceType.Device}
                changeCallback={(evt: ChangeEvent<HTMLInputElement>) => updatePhoto(index, evt)}
                statusCallback={(fieldName, status) => updatePhotoStatus(index, fieldName, status)}
                ModerationComponent={<TextInput id={`url_${index}`} label={i18n.t(urlLabelKey)} name="url" />}
              />
            </div>

            <div className="languageSection gridLayoutContainer moderation">
              {LANGUAGE_OPTIONS.map((option) => (
                <ModerationSection
                  id={`altText_${option}`}
                  key={`altText_${option}`}
                  fieldName={option}
                  selectedValue={photosSelected[index].altText[option] as string}
                  modifiedValue={photosModified[index].altText[option] as string}
                  status={photosStatus[index].altText[option]}
                  modifyButtonLabel={`${i18n.t("moderation.photos.altText.label")} ${i18n.t(`general.inLanguage.${option}`)}`}
                  changeCallback={(evt: ChangeEvent<HTMLTextAreaElement>) => updatePhotoAltText(index, evt)}
                  statusCallback={(language, status) => updatePhotoAltTextStatus(index, language, status)}
                  ModerationComponent={
                    <TextArea
                      id={`altText_${option}`}
                      rows={3}
                      label={`${i18n.t("moderation.photos.altText.label")} ${i18n.t(`general.inLanguage.${option}`)}`}
                      name={option}
                    />
                  }
                />
              ))}
            </div>

            <div className="gridLayoutContainer moderation">
              <SelectionGroup
                id={`permissionSelected_${index}`}
                className="gridColumn1"
                direction="horizontal"
                label={i18n.t("moderation.photos.permission.label")}
                disabled
              >
                <RadioButton
                  id={`permissionSelected_myHelsinki_${index}`}
                  label={i18n.t("moderation.photos.permission.myHelsinki")}
                  name={`permissionSelected_${index}`}
                  value={PhotoPermission.MyHelsinki}
                  checked={photosSelected[index].permission === PhotoPermission.MyHelsinki}
                />
                <RadioButton
                  id={`permissionSelected_creativeCommons_${index}`}
                  label={i18n.t("moderation.photos.permission.creativeCommons")}
                  name={`permissionSelected_${index}`}
                  value={PhotoPermission.CreativeCommons}
                  checked={photosSelected[index].permission === PhotoPermission.CreativeCommons}
                />
              </SelectionGroup>
              <ModifyButton
                className="gridColumn2"
                label={i18n.t("moderation.photos.permission.label")}
                fieldName="permission"
                status={photosStatus[index].permission}
                modifyCallback={(fieldName, status) => updatePhotoStatus(index, fieldName, status)}
              >
                <SelectionGroup
                  id={`permissionModified_${index}`}
                  className="gridColumn2"
                  direction="horizontal"
                  label={i18n.t("moderation.photos.permission.label")}
                  disabled={
                    photosStatus[index].permission === ModerationStatus.Approved || photosStatus[index].permission === ModerationStatus.Rejected
                  }
                >
                  <RadioButton
                    id={`permissionModified_myHelsinki_${index}`}
                    label={i18n.t("moderation.photos.permission.myHelsinki")}
                    name={`permissionModified_${index}`}
                    value={PhotoPermission.MyHelsinki}
                    checked={photosModified[index].permission === PhotoPermission.MyHelsinki}
                    onChange={(evt) => updatePhoto(index, evt)}
                  />
                  <RadioButton
                    id={`permissionModified_creativeCommons_${index}`}
                    label={i18n.t("moderation.photos.permission.creativeCommons")}
                    name={`permissionModified_${index}`}
                    value={PhotoPermission.CreativeCommons}
                    checked={photosModified[index].permission === PhotoPermission.CreativeCommons}
                    onChange={(evt) => updatePhoto(index, evt)}
                  />
                </SelectionGroup>
              </ModifyButton>
              <ActionButton
                className="gridColumn3"
                fieldName="permission"
                status={photosStatus[index].permission}
                actionCallback={(fieldName, status) => updatePhotoStatus(index, fieldName, status)}
              />

              <ModerationSection
                id={`source_${index}`}
                fieldName="source"
                selectedValue={photosSelected[index].source}
                modifiedValue={photosModified[index].source}
                status={photosStatus[index].source}
                modifyButtonLabel={i18n.t("moderation.photos.source.label")}
                changeCallback={(evt: ChangeEvent<HTMLInputElement>) => updatePhoto(index, evt)}
                statusCallback={(fieldName, status) => updatePhotoStatus(index, fieldName, status)}
                ModerationComponent={<TextInput id={`source_${index}`} label={i18n.t("moderation.photos.source.label")} name="source" />}
              />

              <div className="gridColumn1">
                <Button variant="secondary" onClick={() => removePhoto(index)}>
                  {i18n.t("moderation.photos.remove")}
                </Button>
              </div>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
};

export default PhotosModeration;
