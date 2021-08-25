import { LatLngExpression } from "leaflet";
import { ModerationStatus, TranslationStatus } from "../../types/constants";
import {
  ChangeRequestSchema,
  ChangeRequestValidationSchema,
  ModerationExtra,
  ModerationPlaceResults,
  ModerationPlaceSearch,
  ModerationTaskSearch,
  ModerationTodoResults,
  ModerationTranslationRequest,
  ModerationTranslationRequestResults,
  ModerationTranslationRequestTaskSearch,
  ModerationTranslationRequestValidation,
  ModerationTranslationSelectedItems,
  ModerationTranslationTaskResults,
  NotificationExtra,
  NotificationPlaceResults,
  NotificationPlaceSearch,
  TranslationExtra,
  TranslationTaskSearch,
  TranslationTaskValidation,
  TranslationTodoResults,
  User,
} from "../../types/general";
import { ModerationStatusSchema } from "../../types/moderation_status";
import { NotificationSchema } from "../../types/notification_schema";
import { NotificationValidationSchema } from "../../types/notification_validation";
import { TranslationSchema } from "../../types/translation_schema";
import { TranslationStatusSchema } from "../../types/translation_status";

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

export interface TranslationState {
  taskSearch: TranslationTaskSearch;
  taskResults: TranslationTodoResults;
  selectedTaskId: number;
  selectedTask: NotificationSchema;
  translatedTaskId: number;
  translatedTask: TranslationSchema;
  translationExtra: TranslationExtra;
  taskPageValid: boolean;
  taskValidation: TranslationTaskValidation;
}

export interface TranslationStatusState {
  pageStatus: TranslationStatus;
  translationStatus: TranslationStatusSchema;
}

export interface ModerationState {
  placeSearch: ModerationPlaceSearch;
  placeResults: ModerationPlaceResults;
  taskSearch: ModerationTaskSearch;
  taskResults: ModerationTodoResults;
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

export interface ModerationTranslationState {
  requestSearch: ModerationTranslationRequestTaskSearch;
  requestResults: ModerationTranslationRequestResults;
  selectedRequests: ModerationTranslationSelectedItems;
  taskSearch: ModerationTranslationRequestTaskSearch;
  taskResults: ModerationTranslationTaskResults;
  selectedTasks: ModerationTranslationSelectedItems;
  placeSearch: ModerationPlaceSearch;
  placeResults: ModerationPlaceResults;
  selectedPlaces: ModerationTranslationSelectedItems;
  requestDetail: ModerationTranslationRequest;
  requestPageValid: boolean;
  requestValidation: ModerationTranslationRequestValidation;
}
