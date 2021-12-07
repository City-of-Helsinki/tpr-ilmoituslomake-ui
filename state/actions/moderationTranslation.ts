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
import { ModerationTranslationAction } from "./moderationTranslationTypes";

export const setModerationTranslationRequestSearch = (requestSearch: ModerationTranslationRequestTaskSearch): ModerationTranslationAction => ({
  type: SET_MODERATION_TRANSLATION_REQUEST_SEARCH,
  payload: requestSearch,
});

export const setModerationTranslationRequestResults = (requestResults: ModerationTranslationRequestResults): ModerationTranslationAction => ({
  type: SET_MODERATION_TRANSLATION_REQUEST_RESULTS,
  payload: requestResults,
});

export const setModerationTranslationSelectedRequests = (requestIds: ModerationTranslationSelectedItems): ModerationTranslationAction => ({
  type: SET_MODERATION_TRANSLATION_SELECTED_REQUESTS,
  payload: requestIds,
});

export const setModerationTranslationTaskSearch = (taskSearch: ModerationTranslationRequestTaskSearch): ModerationTranslationAction => ({
  type: SET_MODERATION_TRANSLATION_TASK_SEARCH,
  payload: taskSearch,
});

export const setModerationTranslationTaskResults = (taskResults: ModerationTranslationTaskResults): ModerationTranslationAction => ({
  type: SET_MODERATION_TRANSLATION_TASK_RESULTS,
  payload: taskResults,
});

export const setModerationTranslationSelectedTasks = (taskIds: ModerationTranslationSelectedItems): ModerationTranslationAction => ({
  type: SET_MODERATION_TRANSLATION_SELECTED_TASKS,
  payload: taskIds,
});

export const setModerationTranslationPlaceSearch = (placeSearch: ModerationPlaceSearch): ModerationTranslationAction => ({
  type: SET_MODERATION_TRANSLATION_PLACE_SEARCH,
  payload: placeSearch,
});

export const clearModerationTranslationPlaceSearch = (): ModerationTranslationAction => ({
  type: CLEAR_MODERATION_TRANSLATION_PLACE_SEARCH,
  payload: undefined,
});

export const setModerationTranslationPlaceResults = (placeResults: ModerationPlaceResults): ModerationTranslationAction => ({
  type: SET_MODERATION_TRANSLATION_PLACE_RESULTS,
  payload: placeResults,
});

export const setModerationTranslationSelectedPlaces = (placeIds: ModerationTranslationSelectedItems): ModerationTranslationAction => ({
  type: SET_MODERATION_TRANSLATION_SELECTED_PLACES,
  payload: placeIds,
});

export const setModerationTranslationRequest = (requestDetail: ModerationTranslationRequest): ModerationTranslationAction => ({
  type: SET_MODERATION_TRANSLATION_REQUEST,
  payload: requestDetail,
});

export const setModerationTranslationRequestPageValid = (valid: boolean): ModerationTranslationAction => ({
  type: SET_MODERATION_TRANSLATION_REQUEST_PAGE_VALID,
  payload: valid,
});

export const setModerationTranslationRequestValidation = (validation: KeyValueValidation): ModerationTranslationAction => ({
  type: SET_MODERATION_TRANSLATION_REQUEST_VALIDATION,
  payload: validation,
});

export const setModerationTranslationRequestValidationSummary = (validation: KeyValueValidation): ModerationTranslationAction => ({
  type: SET_MODERATION_TRANSLATION_REQUEST_VALIDATION_SUMMARY,
  payload: validation,
});
