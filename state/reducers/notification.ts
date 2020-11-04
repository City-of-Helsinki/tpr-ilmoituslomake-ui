import { AnyAction } from "redux";
import { NotificationState } from "./types";
const MAX_PAGE = 5;
import { SET_PAGE, SET_NOTIFICATION_DATA, SET_MESSAGE, SET_SOMETHING_ELSE } from "../actions/types";

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
    case SET_NOTIFICATION_DATA:
      return {
        ...state,
        notification: action.payload,
      };
    case SET_MESSAGE:
      return {
        ...state,
        message: action.payload,
      };
    case SET_SOMETHING_ELSE:
      return {
        ...state,
        thing: { something: { ...state.thing.something, somethingElse: action.payload } },
      };
    default:
      return state;
  }
};

export default notification;
