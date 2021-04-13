import { LatLngExpression } from "leaflet";
import {
  SET_PAGE,
  SET_MAP_VIEW,
  SET_NOTIFICATION_PLACE_SEARCH,
  SET_NOTIFICATION_PLACE_RESULTS,
  SET_NOTIFICATION_INPUT_LANGUAGE,
  SET_NOTIFICATION_NAME,
  SET_NOTIFICATION_SHORT_DESCRIPTION,
  SET_NOTIFICATION_LONG_DESCRIPTION,
  SET_NOTIFICATION_TAG,
  SET_NOTIFICATION_TAG_OPTIONS,
  SET_NOTIFICATION_NOTIFIER,
  SET_NOTIFICATION_ADDRESS,
  SET_NOTIFICATION_ORIGINAL_LOCATION,
  SET_NOTIFICATION_LOCATION,
  SET_NOTIFICATION_CONTACT,
  SET_NOTIFICATION_LINK,
  SET_NOTIFICATION_PHOTO,
  REMOVE_NOTIFICATION_PHOTO,
  SET_NOTIFICATION_COMMENTS,
  SET_NOTIFICATION_TIP,
} from "../../types/constants";
import {
  KeyValueString,
  KeyValueBoolean,
  Photo,
  TagOption,
  NotificationPlaceSearch,
  NotificationPlaceResult,
  ChangeRequestSchema,
} from "../../types/general";
import { NotificationAction } from "./types";

export const setPage = (pageNumber: number): NotificationAction => ({
  type: SET_PAGE,
  payload: pageNumber,
});

export const setMapView = (center: LatLngExpression, zoom: number): NotificationAction => ({
  type: SET_MAP_VIEW,
  payload: { center, zoom },
});

export const setNotificationPlaceSearch = (placeSearch: NotificationPlaceSearch): NotificationAction => ({
  type: SET_NOTIFICATION_PLACE_SEARCH,
  payload: placeSearch,
});

export const setNotificationPlaceResults = (placeResults: NotificationPlaceResult[]): NotificationAction => ({
  type: SET_NOTIFICATION_PLACE_RESULTS,
  payload: placeResults,
});

export const setNotificationInputLanguage = (keyValue: KeyValueBoolean): NotificationAction => ({
  type: SET_NOTIFICATION_INPUT_LANGUAGE,
  payload: keyValue,
});

export const setNotificationName = (keyValue: KeyValueString): NotificationAction => ({
  type: SET_NOTIFICATION_NAME,
  payload: keyValue,
});

export const setNotificationShortDescription = (keyValue: KeyValueString): NotificationAction => ({
  type: SET_NOTIFICATION_SHORT_DESCRIPTION,
  payload: keyValue,
});

export const setNotificationLongDescription = (keyValue: KeyValueString): NotificationAction => ({
  type: SET_NOTIFICATION_LONG_DESCRIPTION,
  payload: keyValue,
});

export const setNotificationTag = (values: number[]): NotificationAction => ({
  type: SET_NOTIFICATION_TAG,
  payload: values,
});

export const setNotificationTagOptions = (options: TagOption[]): NotificationAction => ({
  type: SET_NOTIFICATION_TAG_OPTIONS,
  payload: options,
});

export const setNotificationNotifier = (keyValue: KeyValueString): NotificationAction => ({
  type: SET_NOTIFICATION_NOTIFIER,
  payload: keyValue,
});

export const setNotificationAddress = (language: string, value: KeyValueString): NotificationAction => ({
  type: SET_NOTIFICATION_ADDRESS,
  payload: { language, value },
});

export const setNotificationOriginalLocation = (coordinates: [number, number]): NotificationAction => ({
  type: SET_NOTIFICATION_ORIGINAL_LOCATION,
  payload: coordinates,
});

export const setNotificationLocation = (coordinates: [number, number]): NotificationAction => ({
  type: SET_NOTIFICATION_LOCATION,
  payload: coordinates,
});

export const setNotificationContact = (keyValue: KeyValueString): NotificationAction => ({
  type: SET_NOTIFICATION_CONTACT,
  payload: keyValue,
});

export const setNotificationLink = (keyValue: KeyValueString): NotificationAction => ({
  type: SET_NOTIFICATION_LINK,
  payload: keyValue,
});

export const setNotificationPhoto = (index: number, value: Photo): NotificationAction => ({
  type: SET_NOTIFICATION_PHOTO,
  payload: { index, value },
});

export const removeNotificationPhoto = (index: number): NotificationAction => ({
  type: REMOVE_NOTIFICATION_PHOTO,
  payload: index,
});

export const setNotificationComments = (value: string): NotificationAction => ({
  type: SET_NOTIFICATION_COMMENTS,
  payload: value,
});

export const setNotificationTip = (tip: ChangeRequestSchema): NotificationAction => ({
  type: SET_NOTIFICATION_TIP,
  payload: tip,
});
