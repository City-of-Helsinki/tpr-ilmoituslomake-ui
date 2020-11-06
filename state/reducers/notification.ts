import { AnyAction } from "redux";
import { NotificationState } from "./types";
import { MAX_PAGE, SET_PAGE, SET_USER, SET_NOTIFICATION_DATA } from "../../types/constants";

const initialState: NotificationState = {
  page: 1,
  notification: {
    name: "",
    street_address: "",
    postal_address: "",
  },
  message: {
    text: "",
  },
  thing: {
    something: {
      somethingElse: "",
    },
  },
};

const notification = (state = initialState, action: AnyAction): NotificationState => {
  switch (action.type) {
    case SET_PAGE:
      return {
        ...state,
        page: Math.min(Math.max(action.payload, 1), MAX_PAGE),
      };
    case SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    case SET_NOTIFICATION_DATA:
      return {
        ...state,
        notification: action.payload,
      };
    default:
      return state;
  }
};

export default notification;
