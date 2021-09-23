import { Dispatch } from "react";
import { string } from "yup";
import { setTranslationTaskPhotoValidation, setTranslationTaskValidation } from "../state/actions/translation";
import { TranslationAction } from "../state/actions/translationTypes";
import { TranslationExtra, TranslationTaskValidation, Validation } from "../types/general";
import { TranslationSchema } from "../types/translation_schema";
import { isValid } from "./validation";

export const validateTranslationTaskField = (prefix: string, translationTaskField: string, translatedTask: TranslationSchema): Validation => {
  let result: Validation;
  switch (translationTaskField) {
    case "name": {
      const schema = string().required(`${prefix}.message.fieldRequired`);
      result = isValid(schema, translatedTask[translationTaskField].lang);
      break;
    }
    case "short":
    case "long": {
      const schema = string().required(`${prefix}.message.fieldRequired`);
      result = isValid(schema, translatedTask.description[translationTaskField].lang);
      break;
    }
    default: {
      result = { valid: false, message: undefined };
    }
  }
  return { ...result, changed: true };
};

export const isTranslationTaskFieldValid = (
  prefix: string,
  translationTaskField: string,
  translationValidationField: string,
  translatedTask: TranslationSchema,
  dispatch: Dispatch<TranslationAction>
): boolean => {
  const result = validateTranslationTaskField(prefix, translationTaskField, translatedTask);
  dispatch(setTranslationTaskValidation({ [translationValidationField]: result }));
  return result.valid;
};

export const validateTranslationTaskPhotoField = (
  prefix: string,
  index: number,
  translationTaskPhotoField: string,
  translationExtra: TranslationExtra
): Validation => {
  const { photosTranslated } = translationExtra;
  const photo = photosTranslated[index];
  const schema = string().required(`${prefix}.message.fieldRequired`);
  const result = isValid(schema, photo[translationTaskPhotoField] as string);
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

export const validateTranslationTaskDetails = (prefix: string, translatedTask: TranslationSchema): boolean => {
  const inputValid = [
    validateTranslationTaskField(prefix, "name", translatedTask),
    validateTranslationTaskField(prefix, "short", translatedTask),
    validateTranslationTaskField(prefix, "long", translatedTask),
  ];
  return inputValid.every((v) => v.valid);
};

export const validateTranslationTaskPhoto = (prefix: string, index: number, translationExtra: TranslationExtra): boolean => {
  const photoValid = [validateTranslationTaskPhotoField(prefix, index, "source", translationExtra)];
  return photoValid.every((v) => v.valid);
};

export const isTranslationTaskPageValid = (
  prefix: string,
  translatedTask: TranslationSchema,
  translationExtra: TranslationExtra,
  dispatch: Dispatch<TranslationAction>
): boolean => {
  const { photosTranslated } = translationExtra;

  // Check whether all data on the page is valid
  // Everything needs to be validated, so make sure lazy evaluation is not used
  const inputValid = [
    isTranslationTaskFieldValid(prefix, "name", "name", translatedTask, dispatch),
    isTranslationTaskFieldValid(prefix, "short", "descriptionShort", translatedTask, dispatch),
    isTranslationTaskFieldValid(prefix, "long", "descriptionLong", translatedTask, dispatch),
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
  console.log("inputChanged", inputChanged);

  const photosChanged = photosTranslated.map((photo, index) => {
    const photoChanged = [taskValidation.photos[index].altText.changed, taskValidation.photos[index].source.changed];
    console.log("photoChanged", photoChanged);
    return photoChanged.some((changed) => changed);
  });
  console.log("photosChanged", photosChanged);

  return inputChanged.some((changed) => changed) || photosChanged.some((changed) => changed);
};
