import { AnyAction } from "redux";
import { User, NotificationExtra } from "../../types/general";
import { NotificationSchema } from "../../types/notification_schema";
import { NotificationValidation } from "../../types/notification_validation";

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

interface SetOtherThingAction extends AnyAction {
  type: typeof SET_OTHER_THING;
  payload: string;
}

export type NotificationAction =
  | SetPageAction
  | SetUserAction
  | SetNotificationDataAction
  | SetNotificationExtraAction
  | SetNotificationValidationAction;
export type ModerationAction = SetOtherThingAction;
