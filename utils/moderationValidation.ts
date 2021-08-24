import { Dispatch } from "react";
import { string } from "yup";
import { setModerationTranslationRequestValidation } from "../state/actions/moderationTranslation";
import { ModerationTranslationAction } from "../state/actions/moderationTranslationTypes";
import { ModerationTranslationRequest, Validation } from "../types/general";
import { isValid } from "./validation";

export const isModerationTranslationRequestFieldValid = (
  translationRequestField: string,
  translationValidationField: string,
  requestDetail: ModerationTranslationRequest,
  dispatch: Dispatch<ModerationTranslationAction>
): boolean => {
  let result: Validation;
  switch (translationRequestField) {
    case "selectedPlaces": {
      const valid = requestDetail.selectedPlaces.length > 0;
      result = !valid ? { valid, message: "moderation.message.fieldRequired" } : { valid, message: undefined };
      break;
    }
    case "name": {
      const schema = string().required("moderation.message.fieldRequired");
      result = isValid(schema, requestDetail.translator[translationRequestField] as string);
      break;
    }
    case "email": {
      const schema = string().required("moderation.message.fieldRequired").email("moderation.message.fieldFormat");
      result = isValid(schema, requestDetail.translator[translationRequestField] as string);
      break;
    }
    case "language": {
      const schema = string().required("moderation.message.fieldRequired");
      result = isValid(schema, requestDetail.language.from) && isValid(schema, requestDetail.language.to);
      break;
    }
    default: {
      const schema = string().required("moderation.message.fieldRequired");
      result = isValid(schema, requestDetail[translationRequestField] as string);
    }
  }
  dispatch(setModerationTranslationRequestValidation({ [translationValidationField]: result }));
  return result.valid;
};

export const isModerationTranslationRequestPageValid = (
  requestDetail: ModerationTranslationRequest,
  dispatch: Dispatch<ModerationTranslationAction>
): boolean => {
  // Check whether all data on the page is valid
  // Everything needs to be validated, so make sure lazy evaluation is not used
  const inputValid = [
    isModerationTranslationRequestFieldValid("selectedPlaces", "selectedPlaces", requestDetail, dispatch),
    isModerationTranslationRequestFieldValid("name", "translatorName", requestDetail, dispatch),
    isModerationTranslationRequestFieldValid("email", "translatorEmail", requestDetail, dispatch),
    isModerationTranslationRequestFieldValid("language", "language", requestDetail, dispatch),
    isModerationTranslationRequestFieldValid("message", "message", requestDetail, dispatch),
  ];
  return inputValid.every((valid) => valid);
};
