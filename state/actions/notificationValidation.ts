import {
  SET_NOTIFICATION_NAME_VALIDATION,
  SET_NOTIFICATION_SHORT_DESCRIPTION_VALIDATION,
  SET_NOTIFICATION_LONG_DESCRIPTION_VALIDATION,
  SET_NOTIFICATION_TAG_VALIDATION,
  SET_NOTIFICATION_NOTIFIER_VALIDATION,
  SET_NOTIFICATION_ADDRESS_VALIDATION,
} from "../../types/constants";
import { NotificationValidationKeyValue } from "../../types/notification_validation";
import { NotificationValidationAction } from "./types";

export const setNotificationNameValidation = (validation: NotificationValidationKeyValue): NotificationValidationAction => ({
  type: SET_NOTIFICATION_NAME_VALIDATION,
  payload: validation,
});

export const setNotificationShortDescriptionValidation = (validation: NotificationValidationKeyValue): NotificationValidationAction => ({
  type: SET_NOTIFICATION_SHORT_DESCRIPTION_VALIDATION,
  payload: validation,
});

export const setNotificationLongDescriptionValidation = (validation: NotificationValidationKeyValue): NotificationValidationAction => ({
  type: SET_NOTIFICATION_LONG_DESCRIPTION_VALIDATION,
  payload: validation,
});

export const setNotificationTagValidation = (validation: boolean): NotificationValidationAction => ({
  type: SET_NOTIFICATION_TAG_VALIDATION,
  payload: validation,
});

export const setNotificationNotifierValidation = (validation: NotificationValidationKeyValue): NotificationValidationAction => ({
  type: SET_NOTIFICATION_NOTIFIER_VALIDATION,
  payload: validation,
});

export const setNotificationAddressValidation = (language: string, validation: NotificationValidationKeyValue): NotificationValidationAction => ({
  type: SET_NOTIFICATION_ADDRESS_VALIDATION,
  payload: { language, validation },
});
