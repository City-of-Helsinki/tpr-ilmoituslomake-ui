import {
  SET_MODERATION_PLACE_SEARCH,
  CLEAR_MODERATION_PLACE_SEARCH,
  SET_MODERATION_PLACE_RESULTS,
  SET_MODERATION_TASK_SEARCH,
  SET_MODERATION_TASK_RESULTS,
  SET_MODERATION_NAME,
  SET_MODERATION_SHORT_DESCRIPTION,
  SET_MODERATION_LONG_DESCRIPTION,
  SET_MODERATION_TAG,
  SET_MODERATION_MATKO_TAG,
  SET_MODERATION_TAG_OPTIONS,
  SET_MODERATION_MATKO_TAG_OPTIONS,
  SET_MODERATION_EXTRA_KEYWORDS,
  SET_MODERATION_ADDRESS,
  SET_MODERATION_LOCATION,
  SET_MODERATION_CONTACT,
  SET_MODERATION_LINK,
  SET_MODERATION_PHOTO,
  REMOVE_MODERATION_PHOTO,
} from "../../types/constants";
import { ModerationAction } from "./types";
import {
  KeyValueString,
  MatkoTagOption,
  ModerationPlaceResults,
  ModerationPlaceSearch,
  ModerationTodoResult,
  Photo,
  TagOption,
  TaskSearch,
} from "../../types/general";

export const setModerationPlaceSearch = (placeSearch: ModerationPlaceSearch): ModerationAction => ({
  type: SET_MODERATION_PLACE_SEARCH,
  payload: placeSearch,
});

export const clearModerationPlaceSearch = (): ModerationAction => ({
  type: CLEAR_MODERATION_PLACE_SEARCH,
  payload: undefined,
});

export const setModerationPlaceResults = (placeResults: ModerationPlaceResults): ModerationAction => ({
  type: SET_MODERATION_PLACE_RESULTS,
  payload: placeResults,
});

export const setModerationTaskSearch = (taskSearch: TaskSearch): ModerationAction => ({
  type: SET_MODERATION_TASK_SEARCH,
  payload: taskSearch,
});

export const setModerationTaskResults = (taskResults: ModerationTodoResult[]): ModerationAction => ({
  type: SET_MODERATION_TASK_RESULTS,
  payload: taskResults,
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

export const setModerationTag = (values: number[]): ModerationAction => ({
  type: SET_MODERATION_TAG,
  payload: values,
});

export const setModerationMatkoTag = (values: number[]): ModerationAction => ({
  type: SET_MODERATION_MATKO_TAG,
  payload: values,
});

export const setModerationTagOptions = (options: TagOption[]): ModerationAction => ({
  type: SET_MODERATION_TAG_OPTIONS,
  payload: options,
});

export const setModerationMatkoTagOptions = (options: MatkoTagOption[]): ModerationAction => ({
  type: SET_MODERATION_MATKO_TAG_OPTIONS,
  payload: options,
});

export const setModerationExtraKeywords = (value: string): ModerationAction => ({
  type: SET_MODERATION_EXTRA_KEYWORDS,
  payload: value,
});

export const setModerationAddress = (language: string, value: KeyValueString): ModerationAction => ({
  type: SET_MODERATION_ADDRESS,
  payload: { language, value },
});

export const setModerationLocation = (coordinates: [number, number]): ModerationAction => ({
  type: SET_MODERATION_LOCATION,
  payload: coordinates,
});

export const setModerationContact = (keyValue: KeyValueString): ModerationAction => ({
  type: SET_MODERATION_CONTACT,
  payload: keyValue,
});

export const setModerationLink = (keyValue: KeyValueString): ModerationAction => ({
  type: SET_MODERATION_LINK,
  payload: keyValue,
});

export const setModerationPhoto = (index: number, value: Photo): ModerationAction => ({
  type: SET_MODERATION_PHOTO,
  payload: { index, value },
});

export const removeModerationPhoto = (index: number): ModerationAction => ({
  type: REMOVE_MODERATION_PHOTO,
  payload: index,
});
