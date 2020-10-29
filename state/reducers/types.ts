import { Message, Thing, OtherThing } from "../types";

export interface NotificationState {
  message: Message;
  thing: Thing;
}

export interface ModerationState {
  some: OtherThing;
}
