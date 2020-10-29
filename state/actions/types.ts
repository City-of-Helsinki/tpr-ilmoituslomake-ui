import { AnyAction } from "redux";
import { Message } from "../types";

export const SET_MESSAGE = "SET_MESSAGE";
export const SET_SOMETHING_ELSE = "SET_SOMETHING_ELSE";
export const SET_OTHER_THING = "SET_OTHER_THING";

interface SetMessageAction extends AnyAction {
  type: typeof SET_MESSAGE;
  payload: Message;
}

interface SetSomethingElse extends AnyAction {
  type: typeof SET_SOMETHING_ELSE;
  payload: string;
}

interface SetOtherThing extends AnyAction {
  type: typeof SET_OTHER_THING;
  payload: string;
}

export type NotificationAction = SetMessageAction | SetSomethingElse;
export type ModerationAction = SetOtherThing;
