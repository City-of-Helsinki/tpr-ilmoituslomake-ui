import { combineReducers } from "redux";
import type { AnyAction } from "redux";
import general from "./general";
import notification from "./notification";
import notificationValidation from "./notificationValidation";
import moderation from "./moderation";
import moderationStatus from "./moderationStatus";
import moderationTranslation from "./moderationTranslation";
import translation from "./translation";
import { CLEAR_STATE } from "../../types/constants";

const appReducer = combineReducers({
  general,
  notification,
  notificationValidation,
  moderation,
  moderationStatus,
  translation,
  moderationTranslation,
});

export type RootState = ReturnType<typeof appReducer>;

export const rootReducer = (state: RootState | undefined, action: AnyAction): RootState => {
  if (action.type === CLEAR_STATE) {
    // Return to initial state
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};
