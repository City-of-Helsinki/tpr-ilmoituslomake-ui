import { User, OtherThing } from "../../types/general";
import { NotificationSchema } from "../../types/notification_schema";

export interface NotificationState {
  page: number;
  user?: User;
  notification: NotificationSchema;
}

export interface ModerationState {
  some: OtherThing;
}
