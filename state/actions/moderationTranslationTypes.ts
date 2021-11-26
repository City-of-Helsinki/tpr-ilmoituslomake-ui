import { AnyAction } from "redux";
import {
  SET_MODERATION_TRANSLATION_REQUEST_SEARCH,
  SET_MODERATION_TRANSLATION_REQUEST_RESULTS,
  SET_MODERATION_TRANSLATION_SELECTED_REQUESTS,
  SET_MODERATION_TRANSLATION_TASK_SEARCH,
  SET_MODERATION_TRANSLATION_TASK_RESULTS,
  SET_MODERATION_TRANSLATION_SELECTED_TASKS,
  SET_MODERATION_TRANSLATION_PLACE_SEARCH,
  CLEAR_MODERATION_TRANSLATION_PLACE_SEARCH,
  SET_MODERATION_TRANSLATION_PLACE_RESULTS,
  SET_MODERATION_TRANSLATION_SELECTED_PLACES,
  SET_MODERATION_TRANSLATION_REQUEST,
  SET_MODERATION_TRANSLATION_REQUEST_PAGE_VALID,
  SET_MODERATION_TRANSLATION_REQUEST_VALIDATION,
  SET_MODERATION_TRANSLATION_REQUEST_VALIDATION_SUMMARY,
} from "../../types/constants";
import {
  KeyValueValidation,
  ModerationPlaceResults,
  ModerationPlaceSearch,
  ModerationTranslationRequest,
  ModerationTranslationRequestResults,
  ModerationTranslationRequestTaskSearch,
  ModerationTranslationSelectedItems,
  ModerationTranslationTaskResults,
} from "../../types/general";

interface SetModerationTranslationRequestSearchAction extends AnyAction {
  type: typeof SET_MODERATION_TRANSLATION_REQUEST_SEARCH;
  payload: ModerationTranslationRequestTaskSearch;
}

interface SetModerationTranslationRequestResultsAction extends AnyAction {
  type: typeof SET_MODERATION_TRANSLATION_REQUEST_RESULTS;
  payload: ModerationTranslationRequestResults;
}

interface SetModerationTranslationSelectedRequestsAction extends AnyAction {
  type: typeof SET_MODERATION_TRANSLATION_SELECTED_REQUESTS;
  payload: ModerationTranslationSelectedItems;
}

interface SetModerationTranslationTaskSearchAction extends AnyAction {
  type: typeof SET_MODERATION_TRANSLATION_TASK_SEARCH;
  payload: ModerationTranslationRequestTaskSearch;
}

interface SetModerationTranslationTaskResultsAction extends AnyAction {
  type: typeof SET_MODERATION_TRANSLATION_TASK_RESULTS;
  payload: ModerationTranslationTaskResults;
}

interface SetModerationTranslationSelectedTasksAction extends AnyAction {
  type: typeof SET_MODERATION_TRANSLATION_SELECTED_TASKS;
  payload: ModerationTranslationSelectedItems;
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
  payload: ModerationTranslationSelectedItems;
}

interface SetModerationTranslationRequestAction extends AnyAction {
  type: typeof SET_MODERATION_TRANSLATION_REQUEST;
  payload: ModerationTranslationRequest;
}

interface SetModerationTranslationRequestPageValidAction extends AnyAction {
  type: typeof SET_MODERATION_TRANSLATION_REQUEST_PAGE_VALID;
  payload: boolean;
}

interface SetModerationTranslationRequestValidationAction extends AnyAction {
  type: typeof SET_MODERATION_TRANSLATION_REQUEST_VALIDATION;
  payload: KeyValueValidation;
}

interface SetModerationTranslationRequestValidationSummaryAction extends AnyAction {
  type: typeof SET_MODERATION_TRANSLATION_REQUEST_VALIDATION_SUMMARY;
  payload: KeyValueValidation;
}

export type ModerationTranslationAction =
  | SetModerationTranslationRequestSearchAction
  | SetModerationTranslationRequestResultsAction
  | SetModerationTranslationSelectedRequestsAction
  | SetModerationTranslationTaskSearchAction
  | SetModerationTranslationTaskResultsAction
  | SetModerationTranslationSelectedTasksAction
  | SetModerationTranslationPlaceSearchAction
  | ClearModerationTranslationPlaceSearchAction
  | SetModerationTranslationPlaceResultsAction
  | SetModerationTranslationSelectedPlacesAction
  | SetModerationTranslationRequestAction
  | SetModerationTranslationRequestPageValidAction
  | SetModerationTranslationRequestValidationAction
  | SetModerationTranslationRequestValidationSummaryAction;
