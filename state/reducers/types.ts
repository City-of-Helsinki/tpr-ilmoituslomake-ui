import { LatLngExpression } from "leaflet";
import { ModerationStatus } from "../../types/constants";
import {
  User,
  NotificationExtra,
  NotificationPlaceSearch,
  NotificationPlaceResults,
  ChangeRequestSchema,
  ChangeRequestValidationSchema,
  ModerationPlaceSearch,
  TaskSearch,
  ModerationTodoResult,
  ModerationExtra,
} from "../../types/general";
import { ModerationStatusSchema } from "../../types/moderation_status";
import { NotificationSchema } from "../../types/notification_schema";
import { NotificationValidationSchema } from "../../types/notification_validation";

export interface GeneralState {
  user?: User;
}

export interface NotificationState {
  page: number;
  center: LatLngExpression;
  zoom: number;
  placeSearch: NotificationPlaceSearch;
  placeResults: NotificationPlaceResults;
  tip: ChangeRequestSchema;
  notificationId: number;
  notification: NotificationSchema;
  notificationExtra: NotificationExtra;
}

export interface NotificationValidationState {
  pageValid: boolean;
  notificationValidation: NotificationValidationSchema;
  tipValidation: ChangeRequestValidationSchema;
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
