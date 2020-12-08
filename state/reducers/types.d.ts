import { LatLngExpression } from "leaflet";
import { User, NotificationExtra, PlaceSearch, TaskSearch, ModerationTask } from "../../types/general";
import { ModerationStatus } from "../../types/moderation_status";
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
  placeSearch: PlaceSearch;
  taskSearch: TaskSearch;
  taskResults: ModerationTask[];
  selectedTaskId: number;
  selectedTask: NotificationSchema;
  selectedTaskExtra: NotificationExtra;
  modifiedTask: NotificationSchema;
  modifiedTaskExtra: NotificationExtra;
}

export interface ModerationStatusState {
  moderationStatus: ModerationStatus;
}
