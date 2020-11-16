import { combineReducers } from "redux";
import notification from "./notification";
import notificationValidation from "./notificationValidation";
import moderation from "./moderation";

export const rootReducer = combineReducers({ notification, notificationValidation, moderation });

export type RootState = ReturnType<typeof rootReducer>;
