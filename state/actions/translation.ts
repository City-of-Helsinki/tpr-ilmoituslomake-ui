import {
  SET_TRANSLATION_TASK_SEARCH,
  SET_TRANSLATION_TASK_RESULTS,
  SET_TRANSLATION_NAME,
  SET_TRANSLATION_SHORT_DESCRIPTION,
  SET_TRANSLATION_LONG_DESCRIPTION,
  SET_TRANSLATION_PHOTO,
} from "../../types/constants";
import { KeyValueString, PhotoTranslation, TranslationTaskSearch, TranslationTodoResults } from "../../types/general";
import { TranslationAction } from "./translationTypes";

export const setTranslationTaskSearch = (taskSearch: TranslationTaskSearch): TranslationAction => ({
  type: SET_TRANSLATION_TASK_SEARCH,
  payload: taskSearch,
});

export const setTranslationTaskResults = (taskResults: TranslationTodoResults): TranslationAction => ({
  type: SET_TRANSLATION_TASK_RESULTS,
  payload: taskResults,
});

export const setTranslationName = (keyValue: KeyValueString): TranslationAction => ({
  type: SET_TRANSLATION_NAME,
  payload: keyValue,
});

export const setTranslationShortDescription = (keyValue: KeyValueString): TranslationAction => ({
  type: SET_TRANSLATION_SHORT_DESCRIPTION,
  payload: keyValue,
});

export const setTranslationLongDescription = (keyValue: KeyValueString): TranslationAction => ({
  type: SET_TRANSLATION_LONG_DESCRIPTION,
  payload: keyValue,
});

export const setTranslationPhoto = (index: number, value: PhotoTranslation): TranslationAction => ({
  type: SET_TRANSLATION_PHOTO,
  payload: { index, value },
});
