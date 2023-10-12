import type { AnyAction } from "redux";
import {
  SET_PAGE_VALID,
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
  SET_NOTIFICATION_SOCIAL_MEDIA_VALIDATION,
  REMOVE_NOTIFICATION_SOCIAL_MEDIA_VALIDATION,
  SET_NOTIFICATION_PHOTO_VALIDATION,
  SET_NOTIFICATION_PHOTO_ALT_TEXT_VALIDATION,
  REMOVE_NOTIFICATION_PHOTO_VALIDATION,
  SET_NOTIFICATION_TIP_VALIDATION,
  SET_NOTIFICATION_VALIDATION_SUMMARY,
  SET_NOTIFICATION_TIP_VALIDATION_SUMMARY,
} from "../../types/constants";
import { KeyValueValidation, Validation } from "../../types/general";
import { PhotoValidation, SocialMediaValidation } from "../../types/notification_validation";

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

interface SetNotificationSocialMediaValidationAction extends AnyAction {
  type: typeof SET_NOTIFICATION_SOCIAL_MEDIA_VALIDATION;
  payload: { index: number; validation: SocialMediaValidation | KeyValueValidation };
}

interface RemoveNotificationSocialMediaValidationAction extends AnyAction {
  type: typeof REMOVE_NOTIFICATION_SOCIAL_MEDIA_VALIDATION;
  payload: number;
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

interface SetNotificationValidationSummaryAction extends AnyAction {
  type: typeof SET_NOTIFICATION_VALIDATION_SUMMARY;
  payload: KeyValueValidation;
}

interface SetNotificationTipValidationSummaryAction extends AnyAction {
  type: typeof SET_NOTIFICATION_TIP_VALIDATION_SUMMARY;
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
  | SetNotificationSocialMediaValidationAction
  | RemoveNotificationSocialMediaValidationAction
  | SetNotificationPhotoValidationAction
  | SetNotificationPhotoAltTextValidationAction
  | RemoveNotificationPhotoValidationAction
  | SetNotificationTipValidationAction
  | SetNotificationValidationSummaryAction
  | SetNotificationTipValidationSummaryAction;
