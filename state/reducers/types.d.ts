import { LatLngExpression } from "leaflet";
import { User, NotificationExtra, PlaceSearch, TaskSearch, ModerationTodo, ModerationExtra } from "../../types/general";
import { ModerationStatus } from "../../types/moderation_status";
import { NotificationSchema } from "../../types/notification_schema";
import { NotificationValidation } from "../../types/notification_validation";

export interface NotificationState {
  page: number;
  user?: User;
  center: LatLngExpression;
  zoom: number;
  notificationId: number;
  notificationName: string;
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
  taskResults: ModerationTodo[];
  selectedTaskId: number;
  selectedTask: NotificationSchema;
  modifiedTaskId: number;
  modifiedTask: NotificationSchema;
  moderationExtra: ModerationExtra;
}

export interface ModerationStatusState {
  moderationStatus: ModerationStatus;
}
