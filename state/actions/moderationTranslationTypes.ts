import { AnyAction } from "redux";
import {
  SET_MODERATION_TRANSLATION_TASK_SEARCH,
  SET_MODERATION_TRANSLATION_TASK_RESULTS,
  SET_MODERATION_TRANSLATION_SELECTED_TASKS,
  SET_MODERATION_TRANSLATION_PLACE_SEARCH,
  CLEAR_MODERATION_TRANSLATION_PLACE_SEARCH,
  SET_MODERATION_TRANSLATION_PLACE_RESULTS,
  SET_MODERATION_TRANSLATION_SELECTED_PLACES,
} from "../../types/constants";
import {
  ModerationPlaceResults,
  ModerationPlaceSearch,
  TranslationSelectedItems,
  TranslationTaskSearch,
  TranslationTodoResults,
} from "../../types/general";

interface SetModerationTranslationTaskSearchAction extends AnyAction {
  type: typeof SET_MODERATION_TRANSLATION_TASK_SEARCH;
  payload: TranslationTaskSearch;
}

interface SetModerationTranslationTaskResultsAction extends AnyAction {
  type: typeof SET_MODERATION_TRANSLATION_TASK_RESULTS;
  payload: TranslationTodoResults;
}

interface SetModerationTranslationSelectedTasksAction extends AnyAction {
  type: typeof SET_MODERATION_TRANSLATION_SELECTED_TASKS;
  payload: TranslationSelectedItems;
}

interface SetModerationTranslationPlaceSearchAction extends AnyAction {
  type: typeof SET_MODERATION_TRANSLATION_PLACE_SEARCH;
  payload: ModerationPlaceSearch;
}

interface ClearModerationTranslationPlaceSearchAction extends AnyAction {
  type: typeof CLEAR_MODERATION_TRANSLATION_PLACE_SEARCH;
  payload: undefined;
}

interface SetModerationTranslationPlaceResultsAction extends AnyAction {
  type: typeof SET_MODERATION_TRANSLATION_PLACE_RESULTS;
  payload: ModerationPlaceResults;
}

interface SetModerationTranslationSelectedPlacesAction extends AnyAction {
  type: typeof SET_MODERATION_TRANSLATION_SELECTED_PLACES;
  payload: TranslationSelectedItems;
}

export type ModerationTranslationAction =
  | SetModerationTranslationTaskSearchAction
  | SetModerationTranslationTaskResultsAction
  | SetModerationTranslationSelectedTasksAction
  | SetModerationTranslationPlaceSearchAction
  | ClearModerationTranslationPlaceSearchAction
  | SetModerationTranslationPlaceResultsAction
  | SetModerationTranslationSelectedPlacesAction;
