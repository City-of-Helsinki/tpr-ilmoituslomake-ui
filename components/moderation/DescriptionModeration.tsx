import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput, TextArea } from "hds-react";
import { ModerationAction, ModerationStatusAction } from "../../state/actions/types";
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
        <h4 className="gridColumn1 moderation">{`${i18n.t("moderation.description.placeName.title")}${i18n.t("moderation.task.selected")}`}</h4>
        <h4 className="gridColumn2 moderation">{`${i18n.t("moderation.description.placeName.title")}${i18n.t("moderation.task.modified")}`}</h4>

        {LANGUAGE_OPTIONS.map((option) => (
          <ModerationSection
            id={`placeName_${option}`}
            key={`placeName_${option}`}
            fieldName={option}
            selectedValue={placeNameSelected[option] as string}
            modifiedValue={placeNameModified[option] as string}
            status={placeNameStatus[option]}
            modifyButtonLabel={`${i18n.t("moderation.description.placeName.label")} ${i18n.t(`general.inLanguage.${option}`)}`}
            changeCallback={updateName}
            statusCallback={updateNameStatus}
            ModerationComponent={
              <TextInput
                id={`placeName_${option}`}
                label={`${i18n.t("moderation.description.placeName.label")} ${i18n.t(`general.inLanguage.${option}`)}`}
                name={option}
              />
            }
          />
        ))}
      </div>

      <div className="languageSection gridLayoutContainer moderation">
        <h4 className="gridColumn1 moderation">{`${i18n.t("moderation.description.shortDescription.title")}${i18n.t(
          "moderation.task.selected"
        )}`}</h4>
        <h4 className="gridColumn2 moderation">{`${i18n.t("moderation.description.shortDescription.title")}${i18n.t(
          "moderation.task.modified"
        )}`}</h4>

        {LANGUAGE_OPTIONS.map((option) => (
          <ModerationSection
            id={`shortDescription_${option}`}
            key={`shortDescription_${option}`}
            fieldName={option}
            selectedValue={shortDescSelected[option] as string}
            modifiedValue={shortDescModified[option] as string}
            status={shortDescStatus[option]}
            modifyButtonLabel={`${i18n.t("moderation.description.shortDescription.label")} ${i18n.t(`general.inLanguage.${option}`)}`}
            changeCallback={updateShortDescription}
            statusCallback={updateShortDescriptionStatus}
            ModerationComponent={
              <TextArea
                id={`shortDescription_${option}`}
                rows={3}
                label={`${i18n.t("moderation.description.shortDescription.label")} ${i18n.t(`general.inLanguage.${option}`)}`}
                name={option}
              />
            }
          />
        ))}
      </div>

      <div className="languageSection gridLayoutContainer moderation">
        <h4 className="gridColumn1 moderation">{`${i18n.t("moderation.description.longDescription.title")}${i18n.t("moderation.task.selected")}`}</h4>
        <h4 className="gridColumn2 moderation">{`${i18n.t("moderation.description.longDescription.title")}${i18n.t("moderation.task.modified")}`}</h4>

        {LANGUAGE_OPTIONS.map((option) => (
          <ModerationSection
            id={`longDescription_${option}`}
            key={`longDescription_${option}`}
            fieldName={option}
            selectedValue={longDescSelected[option] as string}
            modifiedValue={longDescModified[option] as string}
            status={longDescStatus[option]}
            modifyButtonLabel={`${i18n.t("moderation.description.longDescription.label")} ${i18n.t(`general.inLanguage.${option}`)}`}
            changeCallback={updateLongDescription}
            statusCallback={updateLongDescriptionStatus}
            ModerationComponent={
              <TextArea
                id={`longDescription_${option}`}
                rows={6}
                label={`${i18n.t("moderation.description.longDescription.label")} ${i18n.t(`general.inLanguage.${option}`)}`}
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
