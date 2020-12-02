import {
  SET_MODERATION_PLACE_SEARCH,
  CLEAR_MODERATION_PLACE_SEARCH,
  SET_MODERATION_TASK_SEARCH,
  SET_MODERATION_NAME,
  SET_MODERATION_SHORT_DESCRIPTION,
  SET_MODERATION_LONG_DESCRIPTION,
} from "../../types/constants";
import { ModerationAction } from "./types";
import { KeyValueString, PlaceSearch, TaskSearch } from "../../types/general";

export const setModerationPlaceSearch = (placeSearch: PlaceSearch): ModerationAction => ({
  type: SET_MODERATION_PLACE_SEARCH,
  payload: placeSearch,
});

export const clearModerationPlaceSearch = (): ModerationAction => ({
  type: CLEAR_MODERATION_PLACE_SEARCH,
  payload: undefined,
});

export const setModerationTaskSearch = (taskSearch: TaskSearch): ModerationAction => ({
  type: SET_MODERATION_TASK_SEARCH,
  payload: taskSearch,
});

export const setModerationName = (keyValue: KeyValueString): ModerationAction => ({
  type: SET_MODERATION_NAME,
  payload: keyValue,
});

export const setModerationShortDescription = (keyValue: KeyValueString): ModerationAction => ({
  type: SET_MODERATION_SHORT_DESCRIPTION,
  payload: keyValue,
});

export const setModerationLongDescription = (keyValue: KeyValueString): ModerationAction => ({
  type: SET_MODERATION_LONG_DESCRIPTION,
  payload: keyValue,
});
