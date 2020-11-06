import { AnyAction } from "redux";
import { ModerationState } from "./types";
import { SET_OTHER_THING } from "../../types/constants";

const initialState: ModerationState = {
  some: {
    other: {
      thing: "",
    },
  },
};

const moderation = (state = initialState, action: AnyAction): ModerationState => {
  switch (action.type) {
    case SET_OTHER_THING:
      return {
        ...state,
        some: { other: { ...state.some.other, thing: action.payload } },
      };
    default:
      return state;
  }
};

export default moderation;
