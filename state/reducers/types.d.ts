import { LatLngExpression } from "leaflet";
import { User, NotificationExtra } from "../../types/general";
import { NotificationSchema } from "../../types/notification_schema";
import { NotificationValidation } from "../../types/notification_validation";

export interface NotificationState {
  page: number;
  user?: User;
  center: LatLngExpression;
  zoom: number;
  notification: NotificationSchema;
  notificationExtra: NotificationExtra;
}

export interface NotificationValidationState {
  pageValid: true;
  notificationValidation: NotificationValidation;
}

export interface ModerationState {
  page: number;
}
