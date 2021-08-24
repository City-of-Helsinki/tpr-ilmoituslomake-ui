import { Dispatch } from "react";
import { string } from "yup";
import { setTranslationTaskPhotoValidation, setTranslationTaskValidation } from "../state/actions/translation";
import { TranslationAction } from "../state/actions/translationTypes";
import { TranslationExtra, Validation } from "../types/general";
import { TranslationSchema } from "../types/translation_schema";
import { isValid } from "./validation";

export const isTranslationTaskFieldValid = (
  prefix: string,
  translationTaskField: string,
  translationValidationField: string,
  translatedTask: TranslationSchema,
  dispatch: Dispatch<TranslationAction>
): boolean => {
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
  dispatch(setTranslationTaskValidation({ [translationValidationField]: result }));
  return result.valid;
};

export const isTranslationTaskPhotoFieldValid = (
  prefix: string,
  index: number,
  translationTaskPhotoField: string,
  translationValidationPhotoField: string,
  translationExtra: TranslationExtra,
  dispatch: Dispatch<TranslationAction>
): boolean => {
  const { photosTranslated } = translationExtra;
  const photo = photosTranslated[index];
  const schema = string().required(`${prefix}.message.fieldRequired`);
  const result = isValid(schema, photo[translationTaskPhotoField] as string);
  dispatch(setTranslationTaskPhotoValidation(index, { [translationValidationPhotoField]: result }));
  return result.valid;
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
