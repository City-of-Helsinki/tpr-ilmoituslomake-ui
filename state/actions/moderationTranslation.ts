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
import { ModerationTranslationAction } from "./moderationTranslationTypes";

export const setModerationTranslationTaskSearch = (taskSearch: TranslationTaskSearch): ModerationTranslationAction => ({
  type: SET_MODERATION_TRANSLATION_TASK_SEARCH,
  payload: taskSearch,
});

export const setModerationTranslationTaskResults = (taskResults: TranslationTodoResults): ModerationTranslationAction => ({
  type: SET_MODERATION_TRANSLATION_TASK_RESULTS,
  payload: taskResults,
});

export const setModerationTranslationSelectedTasks = (taskIds: TranslationSelectedItems): ModerationTranslationAction => ({
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

export const setModerationTranslationSelectedPlaces = (placeIds: TranslationSelectedItems): ModerationTranslationAction => ({
  type: SET_MODERATION_TRANSLATION_SELECTED_PLACES,
  payload: placeIds,
});
