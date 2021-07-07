import { AnyAction } from "redux";
import {
  SET_TRANSLATION_TASK_SEARCH,
  SET_TRANSLATION_TASK_RESULTS,
  SET_TRANSLATION_NAME,
  SET_TRANSLATION_SHORT_DESCRIPTION,
  SET_TRANSLATION_LONG_DESCRIPTION,
  SET_TRANSLATION_PHOTO,
} from "../../types/constants";
import { KeyValueString, PhotoTranslation, TranslationTaskSearch, TranslationTodoResults } from "../../types/general";

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

export type TranslationAction =
  | SetTranslationTaskSearchAction
  | SetTranslationTaskResultsAction
  | SetTranslationNameAction
  | SetTranslationShortDescriptionAction
  | SetTranslationLongDescriptionAction
  | SetTranslationPhotoAction;
