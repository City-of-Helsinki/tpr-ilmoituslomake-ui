import React, { Dispatch, ChangeEvent, ReactElement, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput, Button, IconUpload, IconLink, TextArea, SelectionGroup, RadioButton, IconLinkExternal } from "hds-react";
import { ModerationAction, ModerationStatusAction } from "../../state/actions/types";
import { setModerationPhoto } from "../../state/actions/moderation";
import { setModerationPhotoAltTextStatus, setModerationPhotoStatus } from "../../state/actions/moderationStatus";
import { RootState } from "../../state/reducers";
import { LANGUAGE_OPTIONS, ModerationStatus, PhotoPermission, PhotoSourceType } from "../../types/constants";
import ActionButton from "./ActionButton";
import ModifyButton from "./ModifyButton";

const PhotosModeration = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<ModerationAction>>();
  const dispatchStatus = useDispatch<Dispatch<ModerationStatusAction>>();

  const selectedTask = useSelector((state: RootState) => state.moderation.selectedTask);
  const { images: imagesSelected } = selectedTask;

  const moderationExtra = useSelector((state: RootState) => state.moderation.moderationExtra);
  const { photos: photosModified } = moderationExtra;

  const moderationStatus = useSelector((state: RootState) => state.moderationStatus.moderationStatus);
  const { photos: photosStatus } = moderationStatus;

  const updatePhoto = (index: number, evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setModerationPhoto(index, { ...photosModified[index], [evt.target.name]: evt.target.value }));
  };

  const updatePhotoAltText = (index: number, evt: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(
      setModerationPhoto(index, { ...photosModified[index], altText: { ...photosModified[index].altText, [evt.target.name]: evt.target.value } })
    );
  };

  const updatePhotoStatus = (index: number, photoField: string, status: ModerationStatus) => {
    dispatchStatus(setModerationPhotoStatus(index, { [photoField]: status }));
  };

  const updatePhotoAltTextStatus = (index: number, language: string, status: ModerationStatus) => {
    dispatchStatus(setModerationPhotoAltTextStatus(index, { [language]: status }));
  };

  return (
    <div className="formSection">
      <div className="gridLayoutContainer">
        {imagesSelected.map(
          (
            { source_type: sourceTypeSelected, url: urlSelected, alt_text: altTextSelected, permission: permissionSelected, source: sourceSelected },
            index
          ) => {
            const key = `photo_${index}`;
            const myHelsinki = permissionSelected === PhotoPermission.MyHelsinki ? i18n.t("moderation.photos.permission.myHelsinki") : null;
            const creativeCommons =
              permissionSelected === PhotoPermission.CreativeCommons ? i18n.t("moderation.photos.permission.creativeCommons") : null;

            return (
              <Fragment key={key}>
                <h4 className="gridColumn1">{`${i18n.t("moderation.photos.photo.title")} ${index + 1}`}</h4>

                {sourceTypeSelected === PhotoSourceType.Device && (
                  <>
                    <TextInput
                      id={`urlSelected_${index}`}
                      className="gridColumn1 disabledTextColor"
                      label={i18n.t("moderation.photos.url.labelDevice")}
                      name="url"
                      value={urlSelected}
                      disabled
                    />
                    <ModifyButton
                      className="gridColumn2"
                      label={i18n.t("moderation.photos.url.labelDevice")}
                      fieldName="url"
                      status={photosStatus[index].url}
                      modifyCallback={(fieldName, status) => updatePhotoStatus(index, fieldName, status)}
                    >
                      <TextInput
                        id={`urlModified_${index}`}
                        className="gridColumn2 disabledTextColor"
                        label={i18n.t("moderation.photos.url.labelDevice")}
                        name="url"
                        value={photosModified[index].url}
                        onChange={(evt) => updatePhoto(index, evt)}
                        disabled
                      />
                    </ModifyButton>
                    <ActionButton
                      className="gridColumn3"
                      fieldName="url"
                      status={photosStatus[index].url}
                      actionCallback={(fieldName, status) => updatePhotoStatus(index, fieldName, status)}
                    />
                  </>
                )}

                {sourceTypeSelected === PhotoSourceType.Link && (
                  <>
                    <TextInput
                      id={`urlSelected_${index}`}
                      className="gridColumn1 disabledTextColor"
                      label={i18n.t("moderation.photos.url.labelLink")}
                      name="url"
                      value={urlSelected}
                      disabled
                    />
                    <ModifyButton
                      className="gridColumn2"
                      label={i18n.t("moderation.photos.url.labelLink")}
                      fieldName="url"
                      status={photosStatus[index].url}
                      modifyCallback={(fieldName, status) => updatePhotoStatus(index, fieldName, status)}
                    >
                      <TextInput
                        id={`urlModified_${index}`}
                        className="gridColumn2 disabledTextColor"
                        label={i18n.t("moderation.photos.url.labelLink")}
                        name="url"
                        value={photosModified[index].url}
                        onChange={(evt) => updatePhoto(index, evt)}
                        disabled={photosStatus[index].url === ModerationStatus.Approved || photosStatus[index].url === ModerationStatus.Rejected}
                      />
                    </ModifyButton>
                    <ActionButton
                      className="gridColumn3"
                      fieldName="url"
                      status={photosStatus[index].url}
                      actionCallback={(fieldName, status) => updatePhotoStatus(index, fieldName, status)}
                    />
                  </>
                )}

                {LANGUAGE_OPTIONS.map((option) => (
                  <Fragment key={`altText_${option}`}>
                    <TextArea
                      id={`altTextSelected_${index}_${option}`}
                      className="gridColumn1 languageSection disabledTextColor"
                      rows={3}
                      label={`${i18n.t("moderation.photos.altText.label")} ${i18n.t(`general.inLanguage.${option}`)}`}
                      name={option}
                      value={altTextSelected[option] as string}
                      disabled
                    />
                    <ModifyButton
                      className="gridColumn2"
                      label={`${i18n.t("moderation.photos.altText.label")} ${i18n.t(`general.inLanguage.${option}`)}`}
                      fieldName={option}
                      status={photosStatus[index].altText[option]}
                      modifyCallback={(language, status) => updatePhotoAltTextStatus(index, language, status)}
                    >
                      <TextArea
                        id={`altTextModified_${index}_${option}`}
                        className="gridColumn2 disabledTextColor"
                        rows={3}
                        label={`${i18n.t("moderation.photos.altText.label")} ${i18n.t(`general.inLanguage.${option}`)}`}
                        name={option}
                        value={photosModified[index].altText[option] as string}
                        onChange={(evt) => updatePhotoAltText(index, evt)}
                        disabled={
                          photosStatus[index].altText[option] === ModerationStatus.Approved ||
                          photosStatus[index].altText[option] === ModerationStatus.Rejected
                        }
                      />
                    </ModifyButton>
                    <ActionButton
                      className="gridColumn3"
                      fieldName={option}
                      status={photosStatus[index].altText[option]}
                      actionCallback={(language, status) => updatePhotoAltTextStatus(index, language, status)}
                    />
                  </Fragment>
                ))}

                <TextInput
                  id={`permissionSelected_${index}`}
                  className="gridColumn1 disabledTextColor"
                  label={i18n.t("moderation.photos.permission.label")}
                  name="permission"
                  value={myHelsinki || creativeCommons || ""}
                  disabled
                />
                <ModifyButton
                  className="gridColumn2"
                  label={i18n.t("moderation.photos.permission.label")}
                  fieldName="permission"
                  status={photosStatus[index].permission}
                  modifyCallback={(fieldName, status) => updatePhotoStatus(index, fieldName, status)}
                >
                  <SelectionGroup
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
                      name="permission"
                      value={PhotoPermission.MyHelsinki}
                      checked={photosModified[index].permission === PhotoPermission.MyHelsinki}
                      onChange={(evt) => updatePhoto(index, evt)}
                    />
                    <RadioButton
                      id={`permission_creativeCommons_${index}`}
                      label={i18n.t("moderation.photos.permission.creativeCommons")}
                      name="permission"
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

                <TextInput
                  id={`sourceSelected_${index}`}
                  className="gridColumn1 disabledTextColor"
                  label={i18n.t("moderation.photos.source.label")}
                  name="source"
                  value={sourceSelected}
                  disabled
                />
                <ModifyButton
                  className="gridColumn2"
                  label={i18n.t("moderation.photos.source.label")}
                  fieldName="source"
                  status={photosStatus[index].source}
                  modifyCallback={(fieldName, status) => updatePhotoStatus(index, fieldName, status)}
                >
                  <TextInput
                    id={`sourceModified_${index}`}
                    className="gridColumn2 disabledTextColor"
                    label={i18n.t("moderation.photos.source.label")}
                    name="source"
                    value={photosModified[index].source}
                    onChange={(evt) => updatePhoto(index, evt)}
                    disabled={photosStatus[index].source === ModerationStatus.Approved || photosStatus[index].source === ModerationStatus.Rejected}
                  />
                </ModifyButton>
                <ActionButton
                  className="gridColumn3"
                  fieldName="source"
                  status={photosStatus[index].source}
                  actionCallback={(fieldName, status) => updatePhotoStatus(index, fieldName, status)}
                />
              </Fragment>
            );
          }
        )}
      </div>
    </div>
  );
};

export default PhotosModeration;
