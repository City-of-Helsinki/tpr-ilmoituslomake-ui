import { AnyAction } from "redux";
import { NotificationState } from "./types";
import { SET_MESSAGE, SET_SOMETHING_ELSE } from "../actions/types";

const initialState: NotificationState = {
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
