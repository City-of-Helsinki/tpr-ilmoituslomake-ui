import { AnyAction } from "redux";
import { NotificationState } from "./types";
import { SET_PAGE, SET_MESSAGE, SET_SOMETHING_ELSE } from "../actions/types";

const MAX_PAGE = 5;

const initialState: NotificationState = {
  page: 1,
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
