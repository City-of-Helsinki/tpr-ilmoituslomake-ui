import { AnyAction } from "redux";
import { ModerationState } from "./types";
import { MAX_PAGE, SET_PAGE } from "../../types/constants";

const initialState: ModerationState = {
  page: 1,
};

const moderation = (state = initialState, action: AnyAction): ModerationState => {
  switch (action.type) {
    case SET_PAGE: {
      console.log("SET_PAGE", action.payload);
      return {
        ...state,
        page: Math.min(Math.max(action.payload, 1), MAX_PAGE),
      };
    }

    default: {
      return state;
    }
  }
};

export default moderation;
