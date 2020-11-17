import { User, NotificationExtra, OtherThing } from "../../types/general";
import { NotificationSchema } from "../../types/notification_schema";
import { NotificationValidation } from "../../types/notification_validation";

export interface NotificationState {
  page: number;
  user?: User;
  notification: NotificationSchema;
  notificationExtra: NotificationExtra;
}

export interface NotificationValidationState {
  pageValid: true;
  notificationValidation: NotificationValidation;
}

export interface ModerationState {
  some: OtherThing;
}
