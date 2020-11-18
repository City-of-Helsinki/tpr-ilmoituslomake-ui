import { AnyAction } from "redux";
import {
  SET_PAGE,
  SET_PAGE_VALID,
  SET_USER,
  SET_NOTIFICATION_INPUT_LANGUAGE,
  SET_NOTIFICATION_NAME,
  SET_NOTIFICATION_SHORT_DESCRIPTION,
  SET_NOTIFICATION_LONG_DESCRIPTION,
  SET_NOTIFICATION_TAG,
  SET_NOTIFICATION_NOTIFIER,
  SET_NOTIFICATION_ADDRESS,
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
} from "../../types/constants";
import { User, KeyValueString, KeyValueBoolean, Photo } from "../../types/general";
import { PhotoValidation } from "../../types/notification_validation";

interface SetPageAction extends AnyAction {
  type: typeof SET_PAGE;
  payload: number;
}

interface SetUserAction extends AnyAction {
  type: typeof SET_USER;
  payload: User;
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
  payload: string[];
}

interface SetNotificationNotifierAction extends AnyAction {
  type: typeof SET_NOTIFICATION_NOTIFIER;
  payload: KeyValueString;
}

interface SetNotificationAddressAction extends AnyAction {
  type: typeof SET_NOTIFICATION_ADDRESS;
  payload: { language: string; value: KeyValueString };
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
  | SetNotificationInputLanguage
  | SetNotificationNameAction
  | SetNotificationShortDescriptionAction
  | SetNotificationLongDescriptionAction
  | SetNotificationTagAction
  | SetNotificationNotifierAction
  | SetNotificationAddressAction
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

interface SetOtherThingAction extends AnyAction {
  type: typeof SET_OTHER_THING;
  payload: string;
}

export type ModerationAction = SetOtherThingAction;
