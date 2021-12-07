import { AnyAction } from "redux";
import {
  SET_TRANSLATION_TASK_SEARCH,
  SET_TRANSLATION_TASK_RESULTS,
  SET_TRANSLATION_NAME,
  SET_TRANSLATION_SHORT_DESCRIPTION,
  SET_TRANSLATION_LONG_DESCRIPTION,
  SET_TRANSLATION_PHOTO,
  SET_TRANSLATION_TASK_PAGE_VALID,
  SET_TRANSLATION_TASK_VALIDATION,
  SET_TRANSLATION_TASK_PHOTO_VALIDATION,
  SET_TRANSLATION_TASK_VALIDATION_SUMMARY,
} from "../../types/constants";
import {
  KeyValueString,
  KeyValueValidation,
  PhotoTranslation,
  TranslationTaskPhotoValidation,
  TranslationTaskSearch,
  TranslationTodoResults,
} from "../../types/general";

interface SetTranslationTaskSearchAction extends AnyAction {
  type: typeof SET_TRANSLATION_TASK_SEARCH;
  payload: TranslationTaskSearch;
}

interface SetTranslationTaskResultsAction extends AnyAction {
  type: typeof SET_TRANSLATION_TASK_RESULTS;
  payload: TranslationTodoResults;
}

interface SetTranslationNameAction extends AnyAction {
  type: typeof SET_TRANSLATION_NAME;
  payload: KeyValueString;
}

interface SetTranslationShortDescriptionAction extends AnyAction {
  type: typeof SET_TRANSLATION_SHORT_DESCRIPTION;
  payload: KeyValueString;
}

interface SetTranslationLongDescriptionAction extends AnyAction {
  type: typeof SET_TRANSLATION_LONG_DESCRIPTION;
  payload: KeyValueString;
}

interface SetTranslationPhotoAction extends AnyAction {
  type: typeof SET_TRANSLATION_PHOTO;
  payload: { index: number; value: PhotoTranslation };
}

interface SetTranslationTaskPageValidAction extends AnyAction {
  type: typeof SET_TRANSLATION_TASK_PAGE_VALID;
  payload: boolean;
}

interface SetTranslationTaskValidationAction extends AnyAction {
  type: typeof SET_TRANSLATION_TASK_VALIDATION;
  payload: KeyValueValidation;
}

interface SetTranslationTaskPhotoValidationAction extends AnyAction {
  type: typeof SET_TRANSLATION_TASK_PHOTO_VALIDATION;
  payload: { index: number; value: TranslationTaskPhotoValidation | KeyValueValidation };
}

interface SetTranslationTaskValidationSummaryAction extends AnyAction {
  type: typeof SET_TRANSLATION_TASK_VALIDATION_SUMMARY;
  payload: KeyValueValidation;
}

export type TranslationAction =
  | SetTranslationTaskSearchAction
  | SetTranslationTaskResultsAction
  | SetTranslationNameAction
  | SetTranslationShortDescriptionAction
  | SetTranslationLongDescriptionAction
  | SetTranslationPhotoAction
  | SetTranslationTaskPageValidAction
  | SetTranslationTaskValidationAction
  | SetTranslationTaskPhotoValidationAction
  | SetTranslationTaskValidationSummaryAction;
