import { combineReducers } from "redux";
import notification from "./notification";
import notificationValidation from "./notificationValidation";
import moderation from "./moderation";
import moderationStatus from "./moderationStatus";

export const rootReducer = combineReducers({ notification, notificationValidation, moderation, moderationStatus });

export type RootState = ReturnType<typeof rootReducer>;
