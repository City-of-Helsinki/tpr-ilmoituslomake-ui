import { AnyAction } from "redux";
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

interface SetPageAction extends AnyAction {
  type: typeof SET_PAGE;
  payload: number;
}

interface SetMapViewAction extends AnyAction {
  type: typeof SET_MAP_VIEW;
  payload: { center: LatLngExpression; zoom: number };
}

interface SetNotificationPlaceSearchAction extends AnyAction {
  type: typeof SET_NOTIFICATION_PLACE_SEARCH;
  payload: NotificationPlaceSearch;
}

interface SetNotificationPlaceResultsAction extends AnyAction {
  type: typeof SET_NOTIFICATION_PLACE_RESULTS;
  payload: NotificationPlaceResults;
}

interface SetNotificationInputLanguage extends AnyAction {
  type: typeof SET_NOTIFICATION_INPUT_LANGUAGE;
  payload: KeyValueBoolean;
}

interface SetNotificationNameAction extends AnyAction {
  type: typeof SET_NOTIFICATION_NAME;
  payload: KeyValueString;
}

interface SetNotificationShortDescriptionAction extends AnyAction {
  type: typeof SET_NOTIFICATION_SHORT_DESCRIPTION;
  payload: KeyValueString;
}

interface SetNotificationLongDescriptionAction extends AnyAction {
  type: typeof SET_NOTIFICATION_LONG_DESCRIPTION;
  payload: KeyValueString;
}

interface SetNotificationTagAction extends AnyAction {
  type: typeof SET_NOTIFICATION_TAG;
  payload: number[];
}

interface SetNotificationTagOptionsAction extends AnyAction {
  type: typeof SET_NOTIFICATION_TAG_OPTIONS;
  payload: TagOption[];
}

interface SetNotificationExtraKeywordsAction extends AnyAction {
  type: typeof SET_NOTIFICATION_EXTRA_KEYWORDS;
  payload: { language: string; value: string };
}

interface SetNotificationNotifierAction extends AnyAction {
  type: typeof SET_NOTIFICATION_NOTIFIER;
  payload: KeyValueString;
}

interface SetNotificationAddressAction extends AnyAction {
  type: typeof SET_NOTIFICATION_ADDRESS;
  payload: { language: string; value: KeyValueString };
}

interface SetNotificationAddressFoundAction extends AnyAction {
  type: typeof SET_NOTIFICATION_ADDRESS_FOUND;
  payload: AddressSearchResult | undefined;
}

interface SetNotificationOriginalLocationAction extends AnyAction {
  type: typeof SET_NOTIFICATION_ORIGINAL_LOCATION;
  payload: [number, number];
}

interface SetNotificationLocationAction extends AnyAction {
  type: typeof SET_NOTIFICATION_LOCATION;
  payload: [number, number];
}

interface SetNotificationContactAction extends AnyAction {
  type: typeof SET_NOTIFICATION_CONTACT;
  payload: KeyValueString;
}

interface SetNotificationLinkAction extends AnyAction {
  type: typeof SET_NOTIFICATION_LINK;
  payload: KeyValueString;
}

interface SetNotificationPhotoAction extends AnyAction {
  type: typeof SET_NOTIFICATION_PHOTO;
  payload: { index: number; value: Photo };
}

interface RemoveNotificationPhotoAction extends AnyAction {
  type: typeof REMOVE_NOTIFICATION_PHOTO;
  payload: number;
}

interface SetNotificationCommentsAction extends AnyAction {
  type: typeof SET_NOTIFICATION_COMMENTS;
  payload: string;
}

interface SetNotificationTipAction extends AnyAction {
  type: typeof SET_NOTIFICATION_TIP;
  payload: ChangeRequestSchema;
}

interface SetSentNotificationAction extends AnyAction {
  type: typeof SET_SENT_NOTIFICATION;
  payload: { notificationId: number; notification: NotificationSchema; notificationExtra: NotificationExtra; openingTimesId: number };
}

export type NotificationAction =
  | SetPageAction
  | SetMapViewAction
  | SetNotificationPlaceSearchAction
  | SetNotificationPlaceResultsAction
  | SetNotificationInputLanguage
  | SetNotificationNameAction
  | SetNotificationShortDescriptionAction
  | SetNotificationLongDescriptionAction
  | SetNotificationTagAction
  | SetNotificationTagOptionsAction
  | SetNotificationExtraKeywordsAction
  | SetNotificationNotifierAction
  | SetNotificationAddressAction
  | SetNotificationAddressFoundAction
  | SetNotificationOriginalLocationAction
  | SetNotificationLocationAction
  | SetNotificationContactAction
  | SetNotificationLinkAction
  | SetNotificationPhotoAction
  | RemoveNotificationPhotoAction
  | SetNotificationCommentsAction
  | SetNotificationTipAction
  | SetSentNotificationAction;
