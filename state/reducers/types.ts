import { Message, Thing, OtherThing } from "../types";

export interface NotificationState {
  page: number;
  message: Message;
  thing: Thing;
}

export interface ModerationState {
  some: OtherThing;
}
