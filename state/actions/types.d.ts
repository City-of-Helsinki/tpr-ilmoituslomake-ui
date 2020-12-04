import { AnyAction } from "redux";
import { LatLngExpression } from "leaflet";
import {
  SET_PAGE,
  SET_PAGE_VALID,
  SET_USER,
  SET_MAP_VIEW,
  SET_NOTIFICATION_INPUT_LANGUAGE,
  SET_NOTIFICATION_NAME,
  SET_NOTIFICATION_SHORT_DESCRIPTION,
  SET_NOTIFICATION_LONG_DESCRIPTION,
  SET_NOTIFICATION_TAG,
  SET_NOTIFICATION_TAG_OPTIONS,
  SET_NOTIFICATION_NOTIFIER,
  SET_NOTIFICATION_ADDRESS,
  SET_NOTIFICATION_LOCATION,
  SET_NOTIFICATION_CONTACT,
  SET_NOTIFICATION_LINK,
  SET_NOTIFICATION_PHOTO,
  REMOVE_NOTIFICATION_PHOTO,
  SET_NOTIFICATION_PRICE,
  SET_NOTIFICATION_PAYMENT,
  SET_NOTIFICATION_COMMENTS,
  SET_NOTIFICATION_NAME_VALIDATION,
  SET_NOTIFICATION_SHORT_DESCRIPTION_VALIDATION,
  SET_NOTIFICATION_LONG_DESCRIPTION_VALIDATION,
  SET_NOTIFICATION_TAG_VALIDATION,
  SET_NOTIFICATION_NOTIFIER_VALIDATION,
  SET_NOTIFICATION_ADDRESS_VALIDATION,
  SET_NOTIFICATION_CONTACT_VALIDATION,
  SET_NOTIFICATION_LINK_VALIDATION,
  SET_NOTIFICATION_PHOTO_VALIDATION,
  SET_MODERATION_PLACE_SEARCH,
  CLEAR_MODERATION_PLACE_SEARCH,
  SET_MODERATION_TASK_SEARCH,
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
  SET_MODERATION_CONTACT_STATUS,
  SET_MODERATION_LINK_STATUS,
  SET_MODERATION_PHOTO_STATUS,
} from "../../types/constants";
import { User, KeyValueString, KeyValueBoolean, Photo, TagOption, PlaceSearch, TaskSearch } from "../../types/general";
import { PhotoValidation } from "../../types/notification_validation";
import { PhotoStatus } from "../../types/moderation_status";

interface SetPageAction extends AnyAction {
  type: typeof SET_PAGE;
  payload: number;
}

interface SetUserAction extends AnyAction {
  type: typeof SET_USER;
  payload: User;
}

interface SetMapViewAction extends AnyAction {
  type: typeof SET_MAP_VIEW;
  payload: { center: LatLngExpression; zoom: number };
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

interface SetNotificationPriceAction extends AnyAction {
  type: typeof SET_NOTIFICATION_PRICE;
  payload: KeyValueString;
}

interface SetNotificationPaymentAction extends AnyAction {
  type: typeof SET_NOTIFICATION_PAYMENT;
  payload: KeyValueBoolean;
}

interface SetNotificationCommentsAction extends AnyAction {
  type: typeof SET_NOTIFICATION_COMMENTS;
  payload: string;
}

export type NotificationAction =
  | SetPageAction
  | SetUserAction
  | SetMapViewAction
  | SetNotificationInputLanguage
  | SetNotificationNameAction
  | SetNotificationShortDescriptionAction
  | SetNotificationLongDescriptionAction
  | SetNotificationTagAction
  | SetNotificationTagOptionsAction
  | SetNotificationNotifierAction
  | SetNotificationAddressAction
  | SetNotificationLocationAction
  | SetNotificationContactAction
  | SetNotificationLinkAction
  | SetNotificationPhotoAction
  | RemoveNotificationPhotoAction
  | SetNotificationPriceAction
  | SetNotificationPaymentAction
  | SetNotificationCommentsAction;

interface SetPageValidAction extends AnyAction {
  type: typeof SET_PAGE_VALID;
  payload: boolean;
}

interface SetNotificationNameValidationAction extends AnyAction {
  type: typeof SET_NOTIFICATION_NAME_VALIDATION;
  payload: KeyValueBoolean;
}

interface SetNotificationShortDescriptionValidationAction extends AnyAction {
  type: typeof SET_NOTIFICATION_SHORT_DESCRIPTION_VALIDATION;
  payload: KeyValueBoolean;
}

interface SetNotificationLongDescriptionValidationAction extends AnyAction {
  type: typeof SET_NOTIFICATION_LONG_DESCRIPTION_VALIDATION;
  payload: KeyValueBoolean;
}

interface SetNotificationTagValidationAction extends AnyAction {
  type: typeof SET_NOTIFICATION_TAG_VALIDATION;
  payload: boolean;
}

interface SetNotificationNotifierValidationAction extends AnyAction {
  type: typeof SET_NOTIFICATION_NOTIFIER_VALIDATION;
  payload: KeyValueBoolean;
}

interface SetNotificationAddressValidationAction extends AnyAction {
  type: typeof SET_NOTIFICATION_ADDRESS_VALIDATION;
  payload: { language: string; validation: KeyValueBoolean };
}

interface SetNotificationContactValidationAction extends AnyAction {
  type: typeof SET_NOTIFICATION_CONTACT_VALIDATION;
  payload: KeyValueBoolean;
}

interface SetNotificationLinkValidationAction extends AnyAction {
  type: typeof SET_NOTIFICATION_LINK_VALIDATION;
  payload: KeyValueBoolean;
}

interface SetNotificationPhotoValidationAction extends AnyAction {
  type: typeof SET_NOTIFICATION_PHOTO_VALIDATION;
  payload: PhotoValidation[];
}

export type NotificationValidationAction =
  | SetPageValidAction
  | SetNotificationNameValidationAction
  | SetNotificationShortDescriptionValidationAction
  | SetNotificationLongDescriptionValidationAction
  | SetNotificationTagValidationAction
  | SetNotificationNotifierValidationAction
  | SetNotificationAddressValidationAction
  | SetNotificationContactValidationAction
  | SetNotificationLinkValidationAction
  | SetNotificationPhotoUrlValidationAction;

interface SetModerationPlaceSearchAction extends AnyAction {
  type: typeof SET_MODERATION_PLACE_SEARCH;
  payload: PlaceSearch;
}

interface ClearModerationPlaceSearchAction extends AnyAction {
  type: typeof CLEAR_MODERATION_PLACE_SEARCH;
  payload: undefined;
}

interface SetModerationTaskSearchAction extends AnyAction {
  type: typeof SET_MODERATION_TASK_SEARCH;
  payload: TaskSearch;
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
  | SetModerationTaskSearchAction
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

interface SetModerationNameStatusAction extends AnyAction {
  type: typeof SET_MODERATION_NAME_STATUS;
  payload: Status;
}

interface SetModerationShortDescriptionStatusAction extends AnyAction {
  type: typeof SET_MODERATION_SHORT_DESCRIPTION_STATUS;
  payload: Status;
}

interface SetModerationLongDescriptionStatusAction extends AnyAction {
  type: typeof SET_MODERATION_LONG_DESCRIPTION_STATUS;
  payload: Status;
}

interface SetModerationTagStatusAction extends AnyAction {
  type: typeof SET_MODERATION_TAG_STATUS;
  payload: Status;
}

interface SetModerationAddressStatusAction extends AnyAction {
  type: typeof SET_MODERATION_ADDRESS_STATUS;
  payload: { language: string; status: Status };
}

interface SetModerationContactStatusAction extends AnyAction {
  type: typeof SET_MODERATION_CONTACT_STATUS;
  payload: Status;
}

interface SetModerationLinkStatusAction extends AnyAction {
  type: typeof SET_MODERATION_LINK_STATUS;
  payload: Status;
}

interface SetModerationPhotoStatusAction extends AnyAction {
  type: typeof SET_MODERATION_PHOTO_STATUS;
  payload: PhotoStatus[];
}

export type ModerationStatusAction =
  | SetModerationNameStatusAction
  | SetModerationShortDescriptionStatusAction
  | SetModerationLongDescriptionStatusAction
  | SetModerationTagStatusAction
  | SetModerationAddressStatusAction
  | SetModerationContactStatusAction
  | SetModerationLinkStatusAction
  | SetModerationPhotoUrlStatusAction;
