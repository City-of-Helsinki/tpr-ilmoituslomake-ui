import { AnyAction, combineReducers } from "redux";
import general from "./general";
import notification from "./notification";
import notificationValidation from "./notificationValidation";
import moderation from "./moderation";
import moderationStatus from "./moderationStatus";
import translation from "./translation";
import translationStatus from "./translationStatus";
import { CLEAR_STATE } from "../../types/constants";

const appReducer = combineReducers({ general, notification, notificationValidation, moderation, moderationStatus, translation, translationStatus });

export type RootState = ReturnType<typeof appReducer>;

export const rootReducer = (state: RootState | undefined, action: AnyAction): RootState => {
  if (action.type === CLEAR_STATE) {
    // Return to initial state
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};
