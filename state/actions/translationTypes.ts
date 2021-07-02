import { AnyAction } from "redux";
import { SET_TRANSLATION_TASK_SEARCH, SET_TRANSLATION_TASK_RESULTS } from "../../types/constants";
import { TranslationTaskResults, TranslationTaskSearch } from "../../types/general";

interface SetTranslationTaskSearchAction extends AnyAction {
  type: typeof SET_TRANSLATION_TASK_SEARCH;
  payload: TranslationTaskSearch;
}

interface SetTranslationTaskResultsAction extends AnyAction {
  type: typeof SET_TRANSLATION_TASK_RESULTS;
  payload: TranslationTaskResults;
}

export type TranslationAction = SetTranslationTaskSearchAction | SetTranslationTaskResultsAction;
