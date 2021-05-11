import { AnyAction } from "redux";
import { LatLngExpression } from "leaflet";
import {
  ModerationStatus,
  SET_PAGE,
  SET_PAGE_VALID,
  SET_PAGE_STATUS,
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
  SET_NOTIFICATION_INPUT_LANGUAGE_VALIDATION,
  SET_NOTIFICATION_NAME_VALIDATION,
  SET_NOTIFICATION_SHORT_DESCRIPTION_VALIDATION,
  SET_NOTIFICATION_LONG_DESCRIPTION_VALIDATION,
  SET_NOTIFICATION_TAG_VALIDATION,
  SET_NOTIFICATION_NOTIFIER_VALIDATION,
  SET_NOTIFICATION_ADDRESS_VALIDATION,
  SET_NOTIFICATION_WHOLE_ADDRESS_VALIDATION,
  SET_NOTIFICATION_LOCATION_VALIDATION,
  SET_NOTIFICATION_CONTACT_VALIDATION,
  SET_NOTIFICATION_LINK_VALIDATION,
  SET_NOTIFICATION_PHOTO_VALIDATION,
  SET_NOTIFICATION_PHOTO_ALT_TEXT_VALIDATION,
  REMOVE_NOTIFICATION_PHOTO_VALIDATION,
  SET_NOTIFICATION_TIP_VALIDATION,
  SET_MODERATION_PLACE_SEARCH,
  CLEAR_MODERATION_PLACE_SEARCH,
  SET_MODERATION_PLACE_RESULTS,
  SET_MODERATION_TASK_SEARCH,
  SET_MODERATION_TASK_RESULTS,
  SET_MODERATION_NAME,
  SET_MODERATION_SHORT_DESCRIPTION,
  SET_MODERATION_LONG_DESCRIPTION,
  SET_MODERATION_TAG,
  SET_MODERATION_TAG_OPTIONS,
  SET_MODERATION_ADDRESS,
  SET_MODERATION_LOCATION,
  SET_MODERATION_CONTACT,
  SET_MODERATION_LINK,
  SET_MODERATION_PHOTO,
  REMOVE_MODERATION_PHOTO,
  SET_MODERATION_NAME_STATUS,
  SET_MODERATION_SHORT_DESCRIPTION_STATUS,
  SET_MODERATION_LONG_DESCRIPTION_STATUS,
  SET_MODERATION_TAG_STATUS,
  SET_MODERATION_ADDRESS_STATUS,
  SET_MODERATION_LOCATION_STATUS,
  SET_MODERATION_CONTACT_STATUS,
  SET_MODERATION_LINK_STATUS,
  SET_MODERATION_PHOTO_STATUS,
  SET_MODERATION_PHOTO_ALT_TEXT_STATUS,
  REMOVE_MODERATION_PHOTO_STATUS,
} from "../../types/constants";
import {
  AddressSearchResult,
  ChangeRequestSchema,
  KeyValueBoolean,
  KeyValueStatus,
  KeyValueString,
  KeyValueValidation,
  ModerationPlaceResults,
  ModerationPlaceSearch,
  ModerationTodoResult,
  NotificationExtra,
  NotificationPlaceResults,
  NotificationPlaceSearch,
  Photo,
  TagOption,
  TaskSearch,
  Validation,
} from "../../types/general";
import { NotificationSchema } from "../../types/notification_schema";
import { PhotoValidation } from "../../types/notification_validation";

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
  payload: { notificationId: number; notification: NotificationSchema; notificationExtra: NotificationExtra };
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

interface SetPageValidAction extends AnyAction {
  type: typeof SET_PAGE_VALID;
  payload: boolean;
}

interface SetNotificationInputLanguageValidationAction extends AnyAction {
  type: typeof SET_NOTIFICATION_INPUT_LANGUAGE_VALIDATION;
  payload: Validation;
}

interface SetNotificationNameValidationAction extends AnyAction {
  type: typeof SET_NOTIFICATION_NAME_VALIDATION;
  payload: KeyValueValidation;
}

interface SetNotificationShortDescriptionValidationAction extends AnyAction {
  type: typeof SET_NOTIFICATION_SHORT_DESCRIPTION_VALIDATION;
  payload: KeyValueValidation;
}

interface SetNotificationLongDescriptionValidationAction extends AnyAction {
  type: typeof SET_NOTIFICATION_LONG_DESCRIPTION_VALIDATION;
  payload: KeyValueValidation;
}

interface SetNotificationTagValidationAction extends AnyAction {
  type: typeof SET_NOTIFICATION_TAG_VALIDATION;
  payload: Validation;
}

interface SetNotificationNotifierValidationAction extends AnyAction {
  type: typeof SET_NOTIFICATION_NOTIFIER_VALIDATION;
  payload: KeyValueValidation;
}

interface SetNotificationAddressValidationAction extends AnyAction {
  type: typeof SET_NOTIFICATION_ADDRESS_VALIDATION;
  payload: { language: string; validation: KeyValueValidation };
}

interface SetNotificationWholeAddressValidationAction extends AnyAction {
  type: typeof SET_NOTIFICATION_WHOLE_ADDRESS_VALIDATION;
  payload: Validation;
}

interface SetNotificationLocationValidationAction extends AnyAction {
  type: typeof SET_NOTIFICATION_LOCATION_VALIDATION;
  payload: Validation;
}

interface SetNotificationContactValidationAction extends AnyAction {
  type: typeof SET_NOTIFICATION_CONTACT_VALIDATION;
  payload: KeyValueValidation;
}

interface SetNotificationLinkValidationAction extends AnyAction {
  type: typeof SET_NOTIFICATION_LINK_VALIDATION;
  payload: KeyValueValidation;
}

interface SetNotificationPhotoValidationAction extends AnyAction {
  type: typeof SET_NOTIFICATION_PHOTO_VALIDATION;
  payload: { index: number; validation: PhotoValidation | KeyValueValidation };
}

interface SetNotificationPhotoAltTextValidationAction extends AnyAction {
  type: typeof SET_NOTIFICATION_PHOTO_ALT_TEXT_VALIDATION;
  payload: { index: number; validation: KeyValueValidation };
}

interface RemoveNotificationPhotoValidationAction extends AnyAction {
  type: typeof REMOVE_NOTIFICATION_PHOTO_VALIDATION;
  payload: number;
}

interface SetNotificationTipValidationAction extends AnyAction {
  type: typeof SET_NOTIFICATION_TIP_VALIDATION;
  payload: KeyValueValidation;
}

export type NotificationValidationAction =
  | SetPageValidAction
  | SetNotificationInputLanguageValidationAction
  | SetNotificationNameValidationAction
  | SetNotificationShortDescriptionValidationAction
  | SetNotificationLongDescriptionValidationAction
  | SetNotificationTagValidationAction
  | SetNotificationNotifierValidationAction
  | SetNotificationAddressValidationAction
  | SetNotificationWholeAddressValidationAction
  | SetNotificationLocationValidationAction
  | SetNotificationContactValidationAction
  | SetNotificationLinkValidationAction
  | SetNotificationPhotoValidationAction
  | SetNotificationPhotoAltTextValidationAction
  | RemoveNotificationPhotoValidationAction
  | SetNotificationTipValidationAction;

interface SetModerationPlaceSearchAction extends AnyAction {
  type: typeof SET_MODERATION_PLACE_SEARCH;
  payload: ModerationPlaceSearch;
}

interface ClearModerationPlaceSearchAction extends AnyAction {
  type: typeof CLEAR_MODERATION_PLACE_SEARCH;
  payload: undefined;
}

interface SetModerationPlaceResultsAction extends AnyAction {
  type: typeof SET_MODERATION_PLACE_RESULTS;
  payload: ModerationPlaceResults;
}

interface SetModerationTaskSearchAction extends AnyAction {
  type: typeof SET_MODERATION_TASK_SEARCH;
  payload: TaskSearch;
}

interface SetModerationTaskResultsAction extends AnyAction {
  type: typeof SET_MODERATION_TASK_RESULTS;
  payload: ModerationTodoResult[];
}

interface SetModerationNameAction extends AnyAction {
  type: typeof SET_MODERATION_NAME;
  payload: KeyValueString;
}

interface SetModerationShortDescriptionAction extends AnyAction {
  type: typeof SET_MODERATION_SHORT_DESCRIPTION;
  payload: KeyValueString;
}

interface SetModerationLongDescriptionAction extends AnyAction {
  type: typeof SET_MODERATION_LONG_DESCRIPTION;
  payload: KeyValueString;
}

interface SetModerationTagAction extends AnyAction {
  type: typeof SET_MODERATION_TAG;
  payload: number[];
}

interface SetModerationTagOptionsAction extends AnyAction {
  type: typeof SET_MODERATION_TAG_OPTIONS;
  payload: TagOption[];
}

interface SetModerationAddressAction extends AnyAction {
  type: typeof SET_MODERATION_ADDRESS;
  payload: { language: string; value: KeyValueString };
}

interface SetModerationLocationAction extends AnyAction {
  type: typeof SET_MODERATION_LOCATION;
  payload: [number, number];
}

interface SetModerationContactAction extends AnyAction {
  type: typeof SET_MODERATION_CONTACT;
  payload: KeyValueString;
}

interface SetModerationLinkAction extends AnyAction {
  type: typeof SET_MODERATION_LINK;
  payload: KeyValueString;
}

interface SetModerationPhotoAction extends AnyAction {
  type: typeof SET_MODERATION_PHOTO;
  payload: { index: number; value: Photo };
}

interface RemoveModerationPhotoAction extends AnyAction {
  type: typeof REMOVE_MODERATION_PHOTO;
  payload: number;
}

export type ModerationAction =
  | SetModerationPlaceSearchAction
  | ClearModerationPlaceSearchAction
  | SetModerationPlaceResultsAction
  | SetModerationTaskSearchAction
  | SetModerationTaskResultsAction
  | SetModerationNameAction
  | SetModerationShortDescriptionAction
  | SetModerationLongDescriptionAction
  | SetModerationTagAction
  | SetModerationTagOptionsAction
  | SetModerationAddressAction
  | SetModerationLocationAction
  | SetModerationContactAction
  | SetModerationLinkAction
  | SetModerationPhotoAction
  | RemoveModerationPhotoAction;

interface SetPageStatusAction extends AnyAction {
  type: typeof SET_PAGE_STATUS;
  payload: ModerationStatus;
}

interface SetModerationNameStatusAction extends AnyAction {
  type: typeof SET_MODERATION_NAME_STATUS;
  payload: KeyValueStatus;
}

interface SetModerationShortDescriptionStatusAction extends AnyAction {
  type: typeof SET_MODERATION_SHORT_DESCRIPTION_STATUS;
  payload: KeyValueStatus;
}

interface SetModerationLongDescriptionStatusAction extends AnyAction {
  type: typeof SET_MODERATION_LONG_DESCRIPTION_STATUS;
  payload: KeyValueStatus;
}

interface SetModerationTagStatusAction extends AnyAction {
  type: typeof SET_MODERATION_TAG_STATUS;
  payload: ModerationStatus;
}

interface SetModerationAddressStatusAction extends AnyAction {
  type: typeof SET_MODERATION_ADDRESS_STATUS;
  payload: { language: string; status: KeyValueStatus };
}

interface SetModerationLocationStatusAction extends AnyAction {
  type: typeof SET_MODERATION_LOCATION_STATUS;
  payload: ModerationStatus;
}

interface SetModerationContactStatusAction extends AnyAction {
  type: typeof SET_MODERATION_CONTACT_STATUS;
  payload: KeyValueStatus;
}

interface SetModerationLinkStatusAction extends AnyAction {
  type: typeof SET_MODERATION_LINK_STATUS;
  payload: KeyValueStatus;
}

interface SetModerationPhotoStatusAction extends AnyAction {
  type: typeof SET_MODERATION_PHOTO_STATUS;
  payload: { index: number; status: KeyValueStatus };
}

interface SetModerationPhotoAltTextStatusAction extends AnyAction {
  type: typeof SET_MODERATION_PHOTO_ALT_TEXT_STATUS;
  payload: { index: number; status: KeyValueStatus };
}

interface RemoveModerationPhotoStatusAction extends AnyAction {
  type: typeof REMOVE_MODERATION_PHOTO_STATUS;
  payload: number;
}

export type ModerationStatusAction =
  | SetPageStatusAction
  | SetModerationNameStatusAction
  | SetModerationShortDescriptionStatusAction
  | SetModerationLongDescriptionStatusAction
  | SetModerationTagStatusAction
  | SetModerationAddressStatusAction
  | SetModerationLocationStatusAction
  | SetModerationContactStatusAction
  | SetModerationLinkStatusAction
  | SetModerationPhotoStatusAction
  | SetModerationPhotoAltTextStatusAction
  | RemoveModerationPhotoStatusAction;
