import {
  SET_NOTIFICATION_NAME_VALIDATION,
  SET_NOTIFICATION_SHORT_DESCRIPTION_VALIDATION,
  SET_NOTIFICATION_LONG_DESCRIPTION_VALIDATION,
  SET_NOTIFICATION_TAG_VALIDATION,
  SET_NOTIFICATION_NOTIFIER_VALIDATION,
  SET_NOTIFICATION_ADDRESS_VALIDATION,
  SET_NOTIFICATION_PHOTO_VALIDATION,
} from "../../types/constants";
import { KeyValueBoolean } from "../../types/general";
import { PhotoValidation } from "../../types/notification_validation";
import { NotificationValidationAction } from "./types";

export const setNotificationNameValidation = (validation: KeyValueBoolean): NotificationValidationAction => ({
  type: SET_NOTIFICATION_NAME_VALIDATION,
  payload: validation,
});

export const setNotificationShortDescriptionValidation = (validation: KeyValueBoolean): NotificationValidationAction => ({
  type: SET_NOTIFICATION_SHORT_DESCRIPTION_VALIDATION,
  payload: validation,
});

export const setNotificationLongDescriptionValidation = (validation: KeyValueBoolean): NotificationValidationAction => ({
  type: SET_NOTIFICATION_LONG_DESCRIPTION_VALIDATION,
  payload: validation,
});

export const setNotificationTagValidation = (validation: boolean): NotificationValidationAction => ({
  type: SET_NOTIFICATION_TAG_VALIDATION,
  payload: validation,
});

export const setNotificationNotifierValidation = (validation: KeyValueBoolean): NotificationValidationAction => ({
  type: SET_NOTIFICATION_NOTIFIER_VALIDATION,
  payload: validation,
});

export const setNotificationAddressValidation = (language: string, validation: KeyValueBoolean): NotificationValidationAction => ({
  type: SET_NOTIFICATION_ADDRESS_VALIDATION,
  payload: { language, validation },
});

export const setNotificationPhotoValidation = (validation: PhotoValidation[]): NotificationValidationAction => ({
  type: SET_NOTIFICATION_PHOTO_VALIDATION,
  payload: validation,
});
