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
  SET_NOTIFICATION_EXTRA_KEYWORDS,
  SET_NOTIFICATION_NOTIFIER,
  SET_NOTIFICATION_ADDRESS,
  SET_NOTIFICATION_ADDRESS_FOUND,
  SET_NOTIFICATION_ORIGINAL_LOCATION,
  SET_NOTIFICATION_LOCATION,
  SET_NOTIFICATION_CONTACT,
  SET_NOTIFICATION_LINK,
  SET_NOTIFICATION_PHOTO,
  REMOVE_NOTIFICATION_PHOTO,
  SET_NOTIFICATION_COMMENTS,
  SET_NOTIFICATION_TIP,
  SET_SENT_NOTIFICATION,
} from "../../types/constants";
import {
  AddressSearchResult,
  ChangeRequestSchema,
  KeyValueBoolean,
  KeyValueString,
  NotificationExtra,
  NotificationPlaceResults,
  NotificationPlaceSearch,
  Photo,
  TagOption,
} from "../../types/general";
import { NotificationSchema } from "../../types/notification_schema";
import { NotificationAction } from "./notificationTypes";

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

export const setNotificationPlaceResults = (placeResults: NotificationPlaceResults): NotificationAction => ({
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

export const setNotificationExtraKeywords = (value: string): NotificationAction => ({
  type: SET_NOTIFICATION_EXTRA_KEYWORDS,
  payload: value,
});

export const setNotificationNotifier = (keyValue: KeyValueString): NotificationAction => ({
  type: SET_NOTIFICATION_NOTIFIER,
  payload: keyValue,
});

export const setNotificationAddress = (language: string, value: KeyValueString): NotificationAction => ({
  type: SET_NOTIFICATION_ADDRESS,
  payload: { language, value },
});

export const setNotificationAddressFound = (addressFound: AddressSearchResult | undefined): NotificationAction => ({
  type: SET_NOTIFICATION_ADDRESS_FOUND,
  payload: addressFound,
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

export const setSentNotification = (
  notificationId: number,
  notification: NotificationSchema,
  notificationExtra: NotificationExtra
): NotificationAction => ({
  type: SET_SENT_NOTIFICATION,
  payload: { notificationId, notification, notificationExtra },
});
