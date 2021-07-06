import { SET_TRANSLATION_TASK_SEARCH, SET_TRANSLATION_TASK_RESULTS } from "../../types/constants";
import { TranslationTaskSearch, TranslationTodoResults } from "../../types/general";
import { TranslationSchema } from "../../types/translation_schema";
import { TranslationAction } from "./translationTypes";

export const setTranslationTaskSearch = (taskSearch: TranslationTaskSearch): TranslationAction => ({
  type: SET_TRANSLATION_TASK_SEARCH,
  payload: taskSearch,
});

export const setTranslationTaskResults = (taskResults: TranslationTodoResults): TranslationAction => ({
  type: SET_TRANSLATION_TASK_RESULTS,
  payload: taskResults,
});
