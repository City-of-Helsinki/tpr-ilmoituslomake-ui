import { LatLngExpression } from "leaflet";
import { ModerationStatus } from "../../types/constants";
import {
  User,
  NotificationExtra,
  NotificationPlaceSearch,
  NotificationPlaceResult,
  ModerationPlaceSearch,
  TaskSearch,
  ChangeRequestSchema,
  ModerationTodoResult,
  ModerationExtra,
} from "../../types/general";
import { ModerationStatusSchema } from "../../types/moderation_status";
import { NotificationSchema } from "../../types/notification_schema";
import { NotificationValidationSchema } from "../../types/notification_validation";

export interface NotificationState {
  page: number;
  user?: User;
  center: LatLngExpression;
  zoom: number;
  placeSearch: NotificationPlaceSearch;
  placeResults: NotificationPlaceResult[];
  notificationId: number;
  notificationName: string;
  notification: NotificationSchema;
  notificationExtra: NotificationExtra;
}

export interface NotificationValidationState {
  pageValid: true;
  notificationValidation: NotificationValidationSchema;
}

// TODO - add place result type
export interface ModerationState {
  placeSearch: ModerationPlaceSearch;
  placeResults: string[];
  taskSearch: TaskSearch;
  taskResults: ModerationTodoResult[];
  selectedTaskId: number;
  selectedTask: NotificationSchema;
  modifiedTaskId: number;
  modifiedTask: NotificationSchema;
  moderationExtra: ModerationExtra;
}

export interface ModerationStatusState {
  pageStatus: ModerationStatus;
  moderationStatus: ModerationStatusSchema;
}
