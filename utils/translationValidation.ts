import { Dispatch } from "react";
import { I18n } from "next-localization";
import { string } from "yup";
import { setTranslationTaskPhotoValidation, setTranslationTaskValidation } from "../state/actions/translation";
import { TranslationAction } from "../state/actions/translationTypes";
import { KeyValueValidation, TranslationExtra, TranslationTaskValidation, Validation } from "../types/general";
import { NotificationSchema } from "../types/notification_schema";
import { TranslationSchema } from "../types/translation_schema";
import { isValid } from "./validation";

export const validateTranslationTaskField = (
  prefix: string,
  translationTaskField: string,
  selectedTask: NotificationSchema,
  translatedTask: TranslationSchema,
  translationExtra: TranslationExtra
): Validation => {
  const {
    translationRequest: {
      language: { from: translateFrom },
    },
  } = translationExtra;
  let selectedResult: Validation;
  let translatedResult: Validation;

  switch (translationTaskField) {
    case "name": {
      const schema = string().required(`${prefix}.message.fieldRequired`);
      selectedResult = isValid(schema, selectedTask[translationTaskField][translateFrom] as string);
      translatedResult = isValid(schema, translatedTask[translationTaskField].lang);
      break;
    }
    case "short":
    case "long": {
      const schema = string().required(`${prefix}.message.fieldRequired`);
      selectedResult = isValid(schema, selectedTask.description[translationTaskField][translateFrom] as string);
      translatedResult = isValid(schema, translatedTask.description[translationTaskField].lang);
      break;
    }
    default: {
      selectedResult = { valid: false, message: undefined };
      translatedResult = { valid: false, message: undefined };
    }
  }

  // Only need to validate the translated value if the original value is valid, so not empty
  const result = selectedResult.valid ? translatedResult : { valid: true, message: undefined };
  return { ...result, changed: true };
};

export const isTranslationTaskFieldValid = (
  prefix: string,
  translationTaskField: string,
  translationValidationField: string,
  selectedTask: NotificationSchema,
  translatedTask: TranslationSchema,
  translationExtra: TranslationExtra,
  dispatch: Dispatch<TranslationAction>
): boolean => {
  const result = validateTranslationTaskField(prefix, translationTaskField, selectedTask, translatedTask, translationExtra);
  dispatch(setTranslationTaskValidation({ [translationValidationField]: result }));
  return result.valid;
};

export const validateTranslationTaskPhotoField = (
  prefix: string,
  index: number,
  translationTaskPhotoField: string,
  translationExtra: TranslationExtra
): Validation => {
  const { photosSelected, photosTranslated } = translationExtra;
  const photoSelected = photosSelected[index];
  const photoTranslated = photosTranslated[index];

  const schema = string().required(`${prefix}.message.fieldRequired`);
  const selectedResult = isValid(schema, photoSelected[translationTaskPhotoField] as string);
  const translatedResult = isValid(schema, photoTranslated[translationTaskPhotoField] as string);

  // Only need to validate the translated value if the original value is valid, so not empty
  const result = selectedResult.valid ? translatedResult : { valid: true, message: undefined };
  return { ...result, changed: true };
};

export const isTranslationTaskPhotoFieldValid = (
  prefix: string,
  index: number,
  translationTaskPhotoField: string,
  translationValidationPhotoField: string,
  translationExtra: TranslationExtra,
  dispatch: Dispatch<TranslationAction>
): boolean => {
  const result = validateTranslationTaskPhotoField(prefix, index, translationTaskPhotoField, translationExtra);
  dispatch(setTranslationTaskPhotoValidation(index, { [translationValidationPhotoField]: result }));
  return result.valid;
};

export const isTranslationTaskPhotoAltTextValid = (
  index: number,
  translationValidationPhotoField: string,
  dispatch: Dispatch<TranslationAction>
): boolean => {
  // No validation needed
  const result = { valid: true, message: undefined, changed: true };
  dispatch(setTranslationTaskPhotoValidation(index, { [translationValidationPhotoField]: result }));
  return result.valid;
};

export const validateTranslationTaskDetails = (
  prefix: string,
  selectedTask: NotificationSchema,
  translatedTask: TranslationSchema,
  translationExtra: TranslationExtra
): boolean => {
  const inputValid = [
    validateTranslationTaskField(prefix, "name", selectedTask, translatedTask, translationExtra),
    validateTranslationTaskField(prefix, "short", selectedTask, translatedTask, translationExtra),
    validateTranslationTaskField(prefix, "long", selectedTask, translatedTask, translationExtra),
  ];
  return inputValid.every((v) => v.valid);
};

export const validateTranslationTaskPhoto = (prefix: string, index: number, translationExtra: TranslationExtra): boolean => {
  const photoValid = [validateTranslationTaskPhotoField(prefix, index, "source", translationExtra)];
  return photoValid.every((v) => v.valid);
};

export const getTranslationTaskPageValidationSummary = (
  prefix: string,
  selectedTask: NotificationSchema,
  translatedTask: TranslationSchema,
  translationExtra: TranslationExtra,
  i18n: I18n<unknown>
): KeyValueValidation => {
  const { photosTranslated } = translationExtra;

  // Check whether all data on the page is valid and create a summary of the results
  // The fieldLabel value is also added to use in the ValidationSummary component
  return {
    [`placeName_lang_Translated`]: {
      ...validateTranslationTaskField(prefix, "name", selectedTask, translatedTask, translationExtra),
      fieldLabel: i18n.t(`${prefix}.description.placeName.label`),
    },
    [`shortDescription_lang_Translated`]: {
      ...validateTranslationTaskField(prefix, "short", selectedTask, translatedTask, translationExtra),
      fieldLabel: i18n.t(`${prefix}.description.shortDescription.label`),
    },
    [`longDescription_lang_Translated`]: {
      ...validateTranslationTaskField(prefix, "long", selectedTask, translatedTask, translationExtra),
      fieldLabel: i18n.t(`${prefix}.description.longDescription.label`),
    },
    ...photosTranslated.reduce((acc, photo, index) => {
      return {
        ...acc,
        [`source_${index}_Translated`]: {
          ...validateTranslationTaskPhotoField(prefix, index, "source", translationExtra),
          fieldLabel: i18n.t(`${prefix}.photos.source.label`),
        },
      };
    }, {}),
  };
};

export const isTranslationTaskPageValid = (
  prefix: string,
  selectedTask: NotificationSchema,
  translatedTask: TranslationSchema,
  translationExtra: TranslationExtra,
  dispatch: Dispatch<TranslationAction>
): boolean => {
  const { photosTranslated } = translationExtra;

  // Check whether all data on the page is valid
  // Everything needs to be validated, so make sure lazy evaluation is not used
  const inputValid = [
    isTranslationTaskFieldValid(prefix, "name", "name", selectedTask, translatedTask, translationExtra, dispatch),
    isTranslationTaskFieldValid(prefix, "short", "descriptionShort", selectedTask, translatedTask, translationExtra, dispatch),
    isTranslationTaskFieldValid(prefix, "long", "descriptionLong", selectedTask, translatedTask, translationExtra, dispatch),
  ];

  const photosValid = photosTranslated.map((photo, index) => {
    const photoValid = [isTranslationTaskPhotoFieldValid(prefix, index, "source", "source", translationExtra, dispatch)];
    return photoValid.every((valid) => valid);
  });

  return inputValid.every((valid) => valid) && photosValid.every((valid) => valid);
};

export const isTranslationTaskPageChanged = (translationExtra: TranslationExtra, taskValidation: TranslationTaskValidation): boolean => {
  const { photosTranslated } = translationExtra;

  // Check whether any data on the page has changed
  const inputChanged = [taskValidation.name.changed, taskValidation.descriptionShort.changed, taskValidation.descriptionLong.changed];
  const photosChanged = photosTranslated.map((photo, index) => {
    const photoChanged = [taskValidation.photos[index].altText.changed, taskValidation.photos[index].source.changed];
    return photoChanged.some((changed) => changed);
  });

  return inputChanged.some((changed) => changed) || photosChanged.some((changed) => changed);
};
