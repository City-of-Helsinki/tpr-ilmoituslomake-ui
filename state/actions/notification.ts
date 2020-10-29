import { Message } from "../types";
import { NotificationAction, SET_MESSAGE, SET_SOMETHING_ELSE } from "./types";

export const setMessage = (message: Message): NotificationAction => ({
  type: SET_MESSAGE,
  payload: message,
});

export const setSomethingElse = (somethingElse: string): NotificationAction => ({
  type: SET_SOMETHING_ELSE,
  payload: somethingElse,
});
