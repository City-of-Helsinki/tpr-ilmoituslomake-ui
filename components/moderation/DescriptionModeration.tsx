import React, { Dispatch, ChangeEvent, ReactElement, Fragment } from "react";
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
import { Status, LANGUAGE_OPTIONS } from "../../types/constants";
import ActionButton from "./ActionButton";
import ModifyButton from "./ModifyButton";

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
  const updateNameStatus = (language: string, status: Status) => {
    dispatchStatus(setModerationNameStatus({ [language]: status }));
  };

  const updateShortDescriptionStatus = (language: string, status: Status) => {
    dispatchStatus(setModerationShortDescriptionStatus({ [language]: status }));
  };

  const updateLongDescriptionStatus = (language: string, status: Status) => {
    dispatchStatus(setModerationLongDescriptionStatus({ [language]: status }));
  };

  return (
    <div className="formSection">
      <h3>{i18n.t("moderation.description.title")}</h3>

      <div className="languageSection gridContainer">
        <h3 className="gridColumn1">{i18n.t("moderation.description.placeNameSelected.label")}</h3>
        <h3 className="gridColumn2">{i18n.t("moderation.description.placeNameModified.label")}</h3>
        {LANGUAGE_OPTIONS.map((option) => (
          <Fragment key={`placeName_${option}`}>
            <TextInput
              id={`placeNameSelected_${option}`}
              className="gridColumn1"
              label={`${i18n.t("moderation.description.placeName.label")} ${i18n.t(`notification.inputLanguage.${option}`)}`}
              name={option}
              value={placeNameSelected[option] as string}
              onChange={updateName}
              disabled
            />
            <ModifyButton
              className="gridColumn2"
              label={`${i18n.t("moderation.description.placeName.label")} ${i18n.t(`notification.inputLanguage.${option}`)}`}
              targetName={option}
              status={placeNameStatus[option]}
              modifyCallback={updateNameStatus}
            >
              <TextInput
                id={`placeNameModified_${option}`}
                className="gridColumn2"
                label={`${i18n.t("moderation.description.placeName.label")} ${i18n.t(`notification.inputLanguage.${option}`)}`}
                name={option}
                value={placeNameModified[option] as string}
                onChange={updateName}
                disabled={placeNameStatus[option] === Status.Approved || placeNameStatus[option] === Status.Rejected}
              />
            </ModifyButton>
            <ActionButton className="gridColumn3" targetName={option} status={placeNameStatus[option]} actionCallback={updateNameStatus} />
          </Fragment>
        ))}
      </div>

      <div className="languageSection gridContainer">
        <h3 className="gridColumn1">{i18n.t("moderation.description.shortDescriptionSelected.label")}</h3>
        <h3 className="gridColumn2">{i18n.t("moderation.description.shortDescriptionModified.label")}</h3>
        {LANGUAGE_OPTIONS.map((option) => (
          <Fragment key={`shortDescription_${option}`}>
            <TextArea
              id={`shortDescriptionSelected_${option}`}
              className="gridColumn1"
              rows={3}
              label={`${i18n.t("moderation.description.shortDescription.label")} ${i18n.t(`notification.inputLanguage.${option}`)}`}
              name={option}
              value={shortDescSelected[option] as string}
              onChange={updateShortDescription}
              disabled
            />
            <ModifyButton
              className="gridColumn2"
              label={`${i18n.t("moderation.description.shortDescription.label")} ${i18n.t(`notification.inputLanguage.${option}`)}`}
              targetName={option}
              status={shortDescStatus[option]}
              modifyCallback={updateShortDescriptionStatus}
            >
              <TextArea
                id={`shortDescriptionModified_${option}`}
                className="gridColumn2"
                rows={3}
                label={`${i18n.t("moderation.description.shortDescription.label")} ${i18n.t(`notification.inputLanguage.${option}`)}`}
                name={option}
                value={shortDescModified[option] as string}
                onChange={updateShortDescription}
              />
            </ModifyButton>
            <ActionButton
              className="gridColumn3"
              targetName={option}
              status={shortDescStatus[option]}
              actionCallback={updateShortDescriptionStatus}
            />
          </Fragment>
        ))}
      </div>

      <div className="languageSection gridContainer">
        <h3 className="gridColumn1">{i18n.t("moderation.description.longDescriptionSelected.label")}</h3>
        <h3 className="gridColumn2">{i18n.t("moderation.description.longDescriptionModified.label")}</h3>
        {LANGUAGE_OPTIONS.map((option) => (
          <Fragment key={`longDescription_${option}`}>
            <TextArea
              id={`longDescriptionSelected_${option}`}
              className="gridColumn1"
              rows={6}
              label={`${i18n.t("moderation.description.longDescription.label")} ${i18n.t(`notification.inputLanguage.${option}`)}`}
              name={option}
              value={longDescSelected[option] as string}
              onChange={updateLongDescription}
              disabled
            />
            <ModifyButton
              className="gridColumn2"
              label={`${i18n.t("moderation.description.longDescription.label")} ${i18n.t(`notification.inputLanguage.${option}`)}`}
              targetName={option}
              status={longDescStatus[option]}
              modifyCallback={updateLongDescriptionStatus}
            >
              <TextArea
                id={`longDescriptionModified_${option}`}
                className="gridColumn2"
                rows={6}
                label={`${i18n.t("moderation.description.longDescription.label")} ${i18n.t(`notification.inputLanguage.${option}`)}`}
                name={option}
                value={longDescModified[option] as string}
                onChange={updateLongDescription}
              />
            </ModifyButton>
            <ActionButton className="gridColumn3" targetName={option} status={longDescStatus[option]} actionCallback={updateLongDescriptionStatus} />
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default DescriptionModeration;
