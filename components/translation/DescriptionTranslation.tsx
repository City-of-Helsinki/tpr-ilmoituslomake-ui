import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput, TextArea } from "hds-react";
import { TranslationAction } from "../../state/actions/translationTypes";
import { TranslationStatusAction } from "../../state/actions/translationStatusTypes";
import { setTranslationName, setTranslationShortDescription, setTranslationLongDescription } from "../../state/actions/translation";
import {
  setTranslationNameStatus,
  setTranslationShortDescriptionStatus,
  setTranslationLongDescriptionStatus,
} from "../../state/actions/translationStatus";
import { RootState } from "../../state/reducers";
import { TranslationStatus } from "../../types/constants";
import TranslationSection from "./TranslationSection";

const DescriptionTranslation = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<TranslationAction>>();
  const dispatchStatus = useDispatch<Dispatch<TranslationStatusAction>>();

  // Fetch values from redux state
  const selectedTask = useSelector((state: RootState) => state.translation.selectedTask);
  const {
    name: placeNameSelected,
    description: { short: shortDescSelected, long: longDescSelected },
  } = selectedTask;

  const translatedTask = useSelector((state: RootState) => state.translation.translatedTask);
  const {
    language: translateTo,
    name: placeNameTranslated,
    description: { short: shortDescTranslated, long: longDescTranslated },
  } = translatedTask;

  const translationExtra = useSelector((state: RootState) => state.translation.translationExtra);
  const { taskType, taskStatus } = translationExtra;

  const translationStatus = useSelector((state: RootState) => state.translationStatus.translationStatus);
  const {
    name: placeNameStatus,
    description: { short: shortDescStatus, long: longDescStatus },
  } = translationStatus;

  const translateFrom = "en";
  const fromOption = "en";
  const toOption = "lang";

  // Functions for updating values in redux state
  const updateName = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setTranslationName({ [evt.target.name]: evt.target.value }));
  };

  const updateShortDescription = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setTranslationShortDescription({ [evt.target.name]: evt.target.value }));
  };

  const updateLongDescription = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setTranslationLongDescription({ [evt.target.name]: evt.target.value }));
  };

  // Functions for updating status values in redux state
  const updateNameStatus = (language: string, status: TranslationStatus) => {
    dispatchStatus(setTranslationNameStatus({ [language]: status }));
  };

  const updateShortDescriptionStatus = (language: string, status: TranslationStatus) => {
    dispatchStatus(setTranslationShortDescriptionStatus({ [language]: status }));
  };

  const updateLongDescriptionStatus = (language: string, status: TranslationStatus) => {
    dispatchStatus(setTranslationLongDescriptionStatus({ [language]: status }));
  };

  return (
    <div className="formSection">
      <div className="gridLayoutContainer translation">
        <TranslationSection
          id={`placeName_${toOption}`}
          fieldName={toOption}
          translateFrom={translateFrom}
          translateTo={translateTo}
          selectedValue={placeNameSelected[fromOption] as string}
          translatedValue={placeNameTranslated[toOption] as string}
          translationStatus={placeNameStatus[toOption]}
          taskType={taskType}
          taskStatus={taskStatus}
          modifyButtonLabel={i18n.t("translation.description.placeName.label")}
          changeCallback={updateName}
          statusCallback={updateNameStatus}
          TranslationComponent={<TextInput id={`placeName_${toOption}`} label={i18n.t("translation.description.placeName.label")} name={toOption} />}
        />
      </div>

      <div className="gridLayoutContainer translation">
        <TranslationSection
          id={`shortDescription_${toOption}`}
          fieldName={toOption}
          translateFrom={translateFrom}
          translateTo={translateTo}
          selectedValue={shortDescSelected[fromOption] as string}
          translatedValue={shortDescTranslated[toOption] as string}
          translationStatus={shortDescStatus[toOption]}
          taskType={taskType}
          taskStatus={taskStatus}
          helperText={i18n.t("translation.description.shortDescription.helperText")}
          tooltipButtonLabel={i18n.t("translation.button.openHelp")}
          tooltipLabel={i18n.t("translation.description.shortDescription.tooltipLabel")}
          tooltipText={i18n.t("translation.description.shortDescription.tooltipText")}
          modifyButtonLabel={i18n.t("translation.description.shortDescription.label")}
          changeCallback={updateShortDescription}
          statusCallback={updateShortDescriptionStatus}
          TranslationComponent={
            <TextArea id={`shortDescription_${toOption}`} rows={3} label={i18n.t("translation.description.shortDescription.label")} name={toOption} />
          }
        />
      </div>

      <div className="gridLayoutContainer translation">
        <TranslationSection
          id={`longDescription_${toOption}`}
          fieldName={toOption}
          translateFrom={translateFrom}
          translateTo={translateTo}
          selectedValue={longDescSelected[fromOption] as string}
          translatedValue={longDescTranslated[toOption] as string}
          translationStatus={longDescStatus[toOption]}
          taskType={taskType}
          taskStatus={taskStatus}
          helperText={`${i18n.t("translation.description.longDescription.helperText")}`}
          tooltipButtonLabel={i18n.t("translation.button.openHelp")}
          tooltipLabel={i18n.t("translation.description.longDescription.tooltipLabel")}
          tooltipText={i18n.t("translation.description.longDescription.tooltipText")}
          modifyButtonLabel={i18n.t("translation.description.longDescription.label")}
          changeCallback={updateLongDescription}
          statusCallback={updateLongDescriptionStatus}
          TranslationComponent={
            <TextArea id={`longDescription_${toOption}`} rows={6} label={i18n.t("translation.description.longDescription.label")} name={toOption} />
          }
        />
      </div>
    </div>
  );
};

export default DescriptionTranslation;
