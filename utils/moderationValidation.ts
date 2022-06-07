import { Dispatch } from "react";
import { I18n } from "next-localization";
import { string } from "yup";
import { setModerationTranslationRequestValidation } from "../state/actions/moderationTranslation";
import { ModerationTranslationAction } from "../state/actions/moderationTranslationTypes";
import { KeyValueValidation, ModerationTranslationRequest, ModerationTranslationRequestValidation, Validation } from "../types/general";
import { isValid } from "./validation";

export const validateModerationTranslationRequestField = (
  translationRequestField: string,
  requestDetail: ModerationTranslationRequest
): Validation => {
  let result: Validation;
  switch (translationRequestField) {
    case "tasks": {
      const valid = requestDetail.tasks.length > 0;
      result = !valid ? { valid, message: "moderation.message.fieldRequired" } : { valid, message: undefined };
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
  return { ...result, changed: true };
};

export const isModerationTranslationRequestFieldValid = (
  translationRequestField: string,
  translationValidationField: string,
  requestDetail: ModerationTranslationRequest,
  dispatch: Dispatch<ModerationTranslationAction>
): boolean => {
  const result = validateModerationTranslationRequestField(translationRequestField, requestDetail);
  dispatch(setModerationTranslationRequestValidation({ [translationValidationField]: result }));
  return result.valid;
};

export const getModerationTranslationRequestPageValidationSummary = (
  requestDetail: ModerationTranslationRequest,
  i18n: I18n<unknown>
): KeyValueValidation => {
  // Check whether all data on the page is valid and create a summary of the results
  // The fieldLabel value is also added to use in the ValidationSummary component
  // NOTE: The 'tasks' field is not included in the summary since the task id list is created on a different page
  return {
    translator: {
      ...validateModerationTranslationRequestField("translator", requestDetail),
      fieldLabel: i18n.t("moderation.translation.request.translator.label"),
    },
    translationLanguage: {
      ...validateModerationTranslationRequestField("language", requestDetail),
      fieldLabel: i18n.t("moderation.translation.request.translationLanguage.label"),
    },
    message: {
      ...validateModerationTranslationRequestField("message", requestDetail),
      fieldLabel: i18n.t("moderation.translation.request.message.label"),
    },
  };
};

export const isModerationTranslationRequestPageValid = (
  requestDetail: ModerationTranslationRequest,
  dispatch: Dispatch<ModerationTranslationAction>
): boolean => {
  // Check whether all data on the page is valid
  // Everything needs to be validated, so make sure lazy evaluation is not used
  const inputValid = [
    isModerationTranslationRequestFieldValid("tasks", "tasks", requestDetail, dispatch),
    isModerationTranslationRequestFieldValid("translator", "translator", requestDetail, dispatch),
    isModerationTranslationRequestFieldValid("language", "language", requestDetail, dispatch),
    isModerationTranslationRequestFieldValid("message", "message", requestDetail, dispatch),
  ];
  return inputValid.every((valid) => valid);
};

export const isModerationTranslationRequestPageChanged = (requestValidation: ModerationTranslationRequestValidation): boolean => {
  // Check whether any data on the page has changed
  const inputChanged = [
    requestValidation.tasks.changed,
    requestValidation.translator.changed,
    requestValidation.language.changed,
    requestValidation.message.changed,
  ];
  return inputChanged.some((changed) => changed);
};
