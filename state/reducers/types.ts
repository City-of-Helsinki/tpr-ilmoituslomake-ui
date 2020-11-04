import { Message, Thing, OtherThing } from "../types";
import { NotificationSchema } from "../../types/notification_schema";

export interface NotificationState {
  page: number;
  notification: NotificationSchema;
  message: Message;
  thing: Thing;
}

export interface ModerationState {
  some: OtherThing;
}
