import { SET_PAGE, SET_USER, SET_NOTIFICATION_DATA, SET_NOTIFICATION_EXTRA, SET_NOTIFICATION_VALIDATION } from "../../types/constants";
import { User, NotificationExtra } from "../../types/general";
import { NotificationSchema } from "../../types/notification_schema";
import { NotificationValidation } from "../../types/notification_validation";
import { NotificationAction } from "./types";

export const setPage = (pageNumber: number): NotificationAction => ({
  type: SET_PAGE,
  payload: pageNumber,
});

export const setUser = (user: User): NotificationAction => ({
  type: SET_USER,
  payload: user,
});

export const setNotificationData = (notification: NotificationSchema): NotificationAction => ({
  type: SET_NOTIFICATION_DATA,
  payload: notification,
});

export const setNotificationExtra = (notificationExtra: NotificationExtra): NotificationAction => ({
  type: SET_NOTIFICATION_EXTRA,
  payload: notificationExtra,
});

export const setNotificationValidation = (notificationValidation: NotificationValidation): NotificationAction => ({
  type: SET_NOTIFICATION_VALIDATION,
  payload: notificationValidation,
});
