import { AnyAction } from "redux";
import {
  SET_PAGE,
  SET_USER,
  SET_NOTIFICATION_DATA,
  SET_NOTIFICATION_EXTRA,
  SET_NOTIFICATION_VALIDATION,
  SET_NOTIFICATION_NAME_VALIDATION,
  SET_NOTIFICATION_SHORT_DESCRIPTION_VALIDATION,
  SET_NOTIFICATION_LONG_DESCRIPTION_VALIDATION,
  SET_NOTIFICATION_TAG_VALIDATION,
  SET_NOTIFICATION_NOTIFIER_VALIDATION,
  SET_NOTIFICATION_ADDRESS_VALIDATION,
} from "../../types/constants";
import { User, NotificationExtra } from "../../types/general";
import { NotificationSchema } from "../../types/notification_schema";
import { NotificationValidation, NotificationValidationKeyValue } from "../../types/notification_validation";

interface SetPageAction extends AnyAction {
  type: typeof SET_PAGE;
  payload: number;
}

interface SetUserAction extends AnyAction {
  type: typeof SET_USER;
  payload: User;
}

interface SetNotificationDataAction extends AnyAction {
  type: typeof SET_NOTIFICATION_DATA;
  payload: NotificationSchema;
}

interface SetNotificationExtraAction extends AnyAction {
  type: typeof SET_NOTIFICATION_EXTRA;
  payload: NotificationExtra;
}

interface SetNotificationValidationAction extends AnyAction {
  type: typeof SET_NOTIFICATION_VALIDATION;
  payload: NotificationValidation;
}

interface SetNotificationNameValidationAction extends AnyAction {
  type: typeof SET_NOTIFICATION_NAME_VALIDATION;
  payload: NotificationValidationKeyValue;
}

interface SetNotificationShortDescriptionValidationAction extends AnyAction {
  type: typeof SET_NOTIFICATION_SHORT_DESCRIPTION_VALIDATION;
  payload: NotificationValidationKeyValue;
}

interface SetNotificationLongDescriptionValidationAction extends AnyAction {
  type: typeof SET_NOTIFICATION_LONG_DESCRIPTION_VALIDATION;
  payload: NotificationValidationKeyValue;
}

interface SetNotificationTagValidationAction extends AnyAction {
  type: typeof SET_NOTIFICATION_TAG_VALIDATION;
  payload: boolean;
}

interface SetNotificationNotifierValidationAction extends AnyAction {
  type: typeof SET_NOTIFICATION_NOTIFIER_VALIDATION;
  payload: NotificationValidationKeyValue;
}

interface SetNotificationAddressValidationAction extends AnyAction {
  type: typeof SET_NOTIFICATION_ADDRESS_VALIDATION;
  payload: { language: string; validation: NotificationValidationKeyValue };
}

interface SetOtherThingAction extends AnyAction {
  type: typeof SET_OTHER_THING;
  payload: string;
}

export type NotificationAction = SetPageAction | SetUserAction | SetNotificationDataAction | SetNotificationExtraAction;

export type NotificationValidationAction =
  | SetNotificationNameValidationAction
  | SetNotificationShortDescriptionValidationAction
  | SetNotificationLongDescriptionValidationAction
  | SetNotificationTagValidationAction
  | SetNotificationNotifierValidationAction
  | SetNotificationAddressValidationAction;

export type ModerationAction = SetOtherThingAction;
