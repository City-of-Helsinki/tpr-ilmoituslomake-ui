import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { TextInput, TextArea } from "hds-react";
import { TranslationAction } from "../../state/actions/translationTypes";
import { setTranslationName, setTranslationShortDescription, setTranslationLongDescription } from "../../state/actions/translation";
import { RootState } from "../../state/reducers";
import TranslationSection from "./TranslationSection";
import { isTranslationTaskFieldValid } from "../../utils/translationValidation";

interface DescriptionTranslationProps {
  prefix: string;
  buttonsPrefix?: string;
}

const DescriptionTranslation = ({ prefix, buttonsPrefix }: DescriptionTranslationProps): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<TranslationAction>>();

  // Fetch values from redux state
  const selectedTask = useSelector((state: RootState) => state.translation.selectedTask);
  const {
    name: placeNameSelected,
    description: { short: shortDescSelected, long: longDescSelected },
  } = selectedTask;

  const translatedTask = useSelector((state: RootState) => state.translation.translatedTask);
  const {
    name: placeNameTranslated,
    description: { short: shortDescTranslated, long: longDescTranslated },
  } = translatedTask;

  const translationExtra = useSelector((state: RootState) => state.translation.translationExtra);
  const {
    translationRequest: {
      language: { from: translateFrom, to: translateTo },
    },
    translationTask: { taskType, taskStatus },
  } = translationExtra;

  const taskValidation = useSelector((state: RootState) => state.translation.taskValidation);
  const { name: nameValid, descriptionShort: shortDescValid, descriptionLong: longDescValid } = taskValidation;

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

  // Functions for validating values and storing the results in redux state
  const validateName = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setTranslationName({ [evt.target.name]: (placeNameTranslated[evt.target.name] as string).trim() }));
    isTranslationTaskFieldValid(buttonsPrefix ?? prefix, "name", "name", translatedTask, dispatch);
  };

  const validateShortDescription = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setTranslationShortDescription({ [evt.target.name]: (shortDescTranslated[evt.target.name] as string).trim() }));
    isTranslationTaskFieldValid(buttonsPrefix ?? prefix, "short", "descriptionShort", translatedTask, dispatch);
  };

  const validateLongDescription = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setTranslationLongDescription({ [evt.target.name]: (longDescTranslated[evt.target.name] as string).trim() }));
    isTranslationTaskFieldValid(buttonsPrefix ?? prefix, "long", "descriptionLong", translatedTask, dispatch);
  };

  return (
    <div className="formSection">
      <div className="gridLayoutContainer translation">
        <TranslationSection
          id={`placeName_${toOption}`}
          translateFrom={translateFrom}
          translateTo={translateTo}
          selectedValue={placeNameSelected[fromOption] as string}
          translatedValue={placeNameTranslated[toOption] as string}
          taskType={taskType}
          taskStatus={taskStatus}
          changeCallback={updateName}
          blurCallback={validateName}
          invalid={!nameValid.valid}
          errorText={
            !nameValid.valid ? i18n.t(nameValid.message as string).replace("$fieldName", i18n.t(`${prefix}.description.placeName.label`)) : ""
          }
          required
          TranslationComponent={<TextInput id={`placeName_${toOption}`} label={i18n.t(`${prefix}.description.placeName.label`)} name={toOption} />}
        />
      </div>

      <div className="gridLayoutContainer translation">
        <TranslationSection
          id={`shortDescription_${toOption}`}
          translateFrom={translateFrom}
          translateTo={translateTo}
          selectedValue={shortDescSelected[fromOption] as string}
          translatedValue={shortDescTranslated[toOption] as string}
          taskType={taskType}
          taskStatus={taskStatus}
          helperText={i18n.t(`${prefix}.description.shortDescription.helperText`)}
          tooltipButtonLabel={i18n.t(`${buttonsPrefix ?? prefix}.button.openHelp`)}
          tooltipLabel={i18n.t(`${prefix}.description.shortDescription.tooltipLabel`)}
          tooltipText={i18n.t(`${prefix}.description.shortDescription.tooltipText`)}
          changeCallback={updateShortDescription}
          blurCallback={validateShortDescription}
          invalid={!shortDescValid.valid}
          errorText={
            !shortDescValid.valid
              ? i18n.t(shortDescValid.message as string).replace("$fieldName", i18n.t(`${prefix}.description.shortDescription.label`))
              : ""
          }
          required
          TranslationComponent={
            <TextArea id={`shortDescription_${toOption}`} rows={3} label={i18n.t(`${prefix}.description.shortDescription.label`)} name={toOption} />
          }
        />
      </div>

      <div className="gridLayoutContainer translation">
        <TranslationSection
          id={`longDescription_${toOption}`}
          translateFrom={translateFrom}
          translateTo={translateTo}
          selectedValue={longDescSelected[fromOption] as string}
          translatedValue={longDescTranslated[toOption] as string}
          taskType={taskType}
          taskStatus={taskStatus}
          helperText={`${i18n.t(`${prefix}.description.longDescription.helperText`)}`}
          tooltipButtonLabel={i18n.t(`${buttonsPrefix ?? prefix}.button.openHelp`)}
          tooltipLabel={i18n.t(`${prefix}.description.longDescription.tooltipLabel`)}
          tooltipText={i18n.t(`${prefix}.description.longDescription.tooltipText`)}
          changeCallback={updateLongDescription}
          blurCallback={validateLongDescription}
          invalid={!longDescValid.valid}
          errorText={
            !longDescValid.valid
              ? i18n.t(longDescValid.message as string).replace("$fieldName", i18n.t(`${prefix}.description.longDescription.label`))
              : ""
          }
          required
          TranslationComponent={
            <TextArea id={`longDescription_${toOption}`} rows={6} label={i18n.t(`${prefix}.description.longDescription.label`)} name={toOption} />
          }
        />
      </div>
    </div>
  );
};

DescriptionTranslation.defaultProps = {
  buttonsPrefix: undefined,
};

export default DescriptionTranslation;
