import { Message } from "../types";
import { NotificationAction, SET_PAGE, SET_MESSAGE, SET_SOMETHING_ELSE } from "./types";

export const setPage = (pageNumber: number): NotificationAction => ({
  type: SET_PAGE,
  payload: pageNumber,
});

export const setMessage = (message: Message): NotificationAction => ({
  type: SET_MESSAGE,
  payload: message,
});

export const setSomethingElse = (somethingElse: string): NotificationAction => ({
  type: SET_SOMETHING_ELSE,
  payload: somethingElse,
});
