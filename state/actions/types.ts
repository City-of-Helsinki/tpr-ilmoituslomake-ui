import { AnyAction } from "redux";
import { Message } from "../types";

export const SET_PAGE = "SET_PAGE";
export const SET_MESSAGE = "SET_MESSAGE";
export const SET_SOMETHING_ELSE = "SET_SOMETHING_ELSE";
export const SET_OTHER_THING = "SET_OTHER_THING";

interface SetPageAction extends AnyAction {
  type: typeof SET_PAGE;
  payload: number;
}

interface SetMessageAction extends AnyAction {
  type: typeof SET_MESSAGE;
  payload: Message;
}

interface SetSomethingElseAction extends AnyAction {
  type: typeof SET_SOMETHING_ELSE;
  payload: string;
}

interface SetOtherThingAction extends AnyAction {
  type: typeof SET_OTHER_THING;
  payload: string;
}

export type NotificationAction = SetPageAction | SetMessageAction | SetSomethingElseAction;
export type ModerationAction = SetOtherThingAction;
