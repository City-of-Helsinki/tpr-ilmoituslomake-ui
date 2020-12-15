import {
  SET_PAGE_VALID,
  SET_NOTIFICATION_NAME_VALIDATION,
  SET_NOTIFICATION_SHORT_DESCRIPTION_VALIDATION,
  SET_NOTIFICATION_LONG_DESCRIPTION_VALIDATION,
  SET_NOTIFICATION_TAG_VALIDATION,
  SET_NOTIFICATION_NOTIFIER_VALIDATION,
  SET_NOTIFICATION_ADDRESS_VALIDATION,
  SET_NOTIFICATION_CONTACT_VALIDATION,
  SET_NOTIFICATION_LINK_VALIDATION,
  SET_NOTIFICATION_PHOTO_VALIDATION,
  SET_NOTIFICATION_PHOTO_DESCRIPTION_VALIDATION,
  REMOVE_NOTIFICATION_PHOTO_VALIDATION,
} from "../../types/constants";
import { KeyValueBoolean } from "../../types/general";
import { PhotoValidation } from "../../types/notification_validation";
import { NotificationValidationAction } from "./types";

export const setPageValid = (valid: boolean): NotificationValidationAction => ({
  type: SET_PAGE_VALID,
  payload: valid,
});

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

export const setNotificationContactValidation = (validation: KeyValueBoolean): NotificationValidationAction => ({
  type: SET_NOTIFICATION_CONTACT_VALIDATION,
  payload: validation,
});

export const setNotificationLinkValidation = (validation: KeyValueBoolean): NotificationValidationAction => ({
  type: SET_NOTIFICATION_LINK_VALIDATION,
  payload: validation,
});

export const setNotificationPhotoValidation = (index: number, validation: PhotoValidation | KeyValueBoolean): NotificationValidationAction => ({
  type: SET_NOTIFICATION_PHOTO_VALIDATION,
  payload: { index, validation },
});

export const setNotificationPhotoDescriptionValidation = (index: number, validation: KeyValueBoolean): NotificationValidationAction => ({
  type: SET_NOTIFICATION_PHOTO_DESCRIPTION_VALIDATION,
  payload: { index, validation },
});

export const removeNotificationPhotoValidation = (index: number): NotificationValidationAction => ({
  type: REMOVE_NOTIFICATION_PHOTO_VALIDATION,
  payload: index,
});
