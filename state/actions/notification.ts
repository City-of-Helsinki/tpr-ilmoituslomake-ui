import { SET_PAGE, SET_USER, SET_NOTIFICATION_DATA } from "../../types/constants";
import { User } from "../../types/general";
import { NotificationSchema } from "../../types/notification_schema";
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
