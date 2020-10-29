import { combineReducers } from "redux";
import notification from "./notification";
import moderation from "./moderation";

export const rootReducer = combineReducers({ notification, moderation });

export type RootState = ReturnType<typeof rootReducer>;
