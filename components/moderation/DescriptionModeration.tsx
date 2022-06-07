import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput, TextArea } from "hds-react";
import { ModerationAction } from "../../state/actions/moderationTypes";
import { ModerationStatusAction } from "../../state/actions/moderationStatusTypes";
import { setModerationName, setModerationShortDescription, setModerationLongDescription } from "../../state/actions/moderation";
import {
  setModerationNameStatus,
  setModerationShortDescriptionStatus,
  setModerationLongDescriptionStatus,
} from "../../state/actions/moderationStatus";
import { RootState } from "../../state/reducers";
import { ModerationStatus, LANGUAGE_OPTIONS } from "../../types/constants";
import ModerationSection from "./ModerationSection";

const DescriptionModeration = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<ModerationAction>>();
  const dispatchStatus = useDispatch<Dispatch<ModerationStatusAction>>();

  // Fetch values from redux state
  const selectedTask = useSelector((state: RootState) => state.moderation.selectedTask);
  const {
    name: placeNameSelected,
    description: { short: shortDescSelected, long: longDescSelected },
  } = selectedTask;

  const modifiedTask = useSelector((state: RootState) => state.moderation.modifiedTask);
  const {
    name: placeNameModified,
    description: { short: shortDescModified, long: longDescModified },
  } = modifiedTask;

  const moderationExtra = useSelector((state: RootState) => state.moderation.moderationExtra);
  const { taskType, taskStatus } = moderationExtra;

  const moderationStatus = useSelector((state: RootState) => state.moderationStatus.moderationStatus);
  const {
    name: placeNameStatus,
    description: { short: shortDescStatus, long: longDescStatus },
  } = moderationStatus;

  // Functions for updating values in redux state
  const updateName = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setModerationName({ [evt.target.name]: evt.target.value }));
  };

  const updateShortDescription = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setModerationShortDescription({ [evt.target.name]: evt.target.value }));
  };

  const updateLongDescription = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setModerationLongDescription({ [evt.target.name]: evt.target.value }));
  };

  // Functions for updating status values in redux state
  const updateNameStatus = (language: string, status: ModerationStatus) => {
    dispatchStatus(setModerationNameStatus({ [language]: status }));
  };

  const updateShortDescriptionStatus = (language: string, status: ModerationStatus) => {
    dispatchStatus(setModerationShortDescriptionStatus({ [language]: status }));
  };

  const updateLongDescriptionStatus = (language: string, status: ModerationStatus) => {
    dispatchStatus(setModerationLongDescriptionStatus({ [language]: status }));
  };

  return (
    <div className="formSection">
      <div className="languageSection gridLayoutContainer moderation">
        {LANGUAGE_OPTIONS.map((option, index) => (
          <ModerationSection
            id={`placeName_${option}`}
            key={`placeName_${option}`}
            fieldName={option}
            selectedValue={placeNameSelected[option] as string}
            modifiedValue={placeNameModified[option] as string}
            moderationStatus={placeNameStatus[option]}
            taskType={taskType}
            taskStatus={taskStatus}
            selectedHeaderText={index === 0 ? `${i18n.t("moderation.description.placeName.title")}${i18n.t("moderation.task.selected")}` : undefined}
            modifiedHeaderText={index === 0 ? `${i18n.t("moderation.description.placeName.title")}${i18n.t("moderation.task.modified")}` : undefined}
            modifyButtonLabel={i18n.t(`common.inLanguage.${option}`)}
            changeCallback={updateName}
            statusCallback={updateNameStatus}
            ModerationComponent={
              <TextInput
                id={`placeName_${option}`}
                lang={option}
                label={`${i18n.t("moderation.description.placeName.label")} ${i18n.t(`common.inLanguage.${option}`)}`}
                name={option}
              />
            }
          />
        ))}
      </div>

      <div className="languageSection gridLayoutContainer moderation">
        {LANGUAGE_OPTIONS.map((option, index) => (
          <ModerationSection
            id={`shortDescription_${option}`}
            key={`shortDescription_${option}`}
            fieldName={option}
            selectedValue={shortDescSelected[option] as string}
            modifiedValue={shortDescModified[option] as string}
            moderationStatus={shortDescStatus[option]}
            taskType={taskType}
            taskStatus={taskStatus}
            selectedHeaderText={
              index === 0 ? `${i18n.t("moderation.description.shortDescription.title")}${i18n.t("moderation.task.selected")}` : undefined
            }
            modifiedHeaderText={
              index === 0 ? `${i18n.t("moderation.description.shortDescription.title")}${i18n.t("moderation.task.modified")}` : undefined
            }
            helperText={i18n.t("moderation.description.shortDescription.helperText")}
            tooltipButtonLabel={i18n.t("moderation.button.openHelp")}
            tooltipLabel={i18n.t("moderation.description.shortDescription.tooltipLabel")}
            tooltipText={i18n.t("moderation.description.shortDescription.tooltipText")}
            modifyButtonLabel={i18n.t(`common.inLanguage.${option}`)}
            changeCallback={updateShortDescription}
            statusCallback={updateShortDescriptionStatus}
            ModerationComponent={
              <TextArea
                id={`shortDescription_${option}`}
                lang={option}
                rows={3}
                label={`${i18n.t("moderation.description.shortDescription.label")} ${i18n.t(`common.inLanguage.${option}`)}`}
                name={option}
              />
            }
          />
        ))}
      </div>

      <div className="languageSection gridLayoutContainer moderation">
        {LANGUAGE_OPTIONS.map((option, index) => (
          <ModerationSection
            id={`longDescription_${option}`}
            key={`longDescription_${option}`}
            fieldName={option}
            selectedValue={longDescSelected[option] as string}
            modifiedValue={longDescModified[option] as string}
            moderationStatus={longDescStatus[option]}
            taskType={taskType}
            taskStatus={taskStatus}
            selectedHeaderText={
              index === 0 ? `${i18n.t("moderation.description.longDescription.title")}${i18n.t("moderation.task.selected")}` : undefined
            }
            modifiedHeaderText={
              index === 0 ? `${i18n.t("moderation.description.longDescription.title")}${i18n.t("moderation.task.modified")}` : undefined
            }
            helperText={`${i18n.t("moderation.description.longDescription.helperText")} (${(longDescModified[option] as string).length})`}
            tooltipButtonLabel={i18n.t("moderation.button.openHelp")}
            tooltipLabel={i18n.t("moderation.description.longDescription.tooltipLabel")}
            tooltipText={i18n.t("moderation.description.longDescription.tooltipText")}
            modifyButtonLabel={i18n.t(`common.inLanguage.${option}`)}
            changeCallback={updateLongDescription}
            statusCallback={updateLongDescriptionStatus}
            ModerationComponent={
              <TextArea
                id={`longDescription_${option}`}
                lang={option}
                rows={6}
                label={`${i18n.t("moderation.description.longDescription.label")} ${i18n.t(`common.inLanguage.${option}`)}`}
                name={option}
              />
            }
          />
        ))}
      </div>
    </div>
  );
};

export default DescriptionModeration;
