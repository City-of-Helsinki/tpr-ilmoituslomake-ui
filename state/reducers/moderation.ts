import { AnyAction } from "redux";
import { ModerationState } from "./types";
import { SET_MODERATION_PLACE_SEARCH, CLEAR_MODERATION_PLACE_SEARCH } from "../../types/constants";

const initialState: ModerationState = {
  placeSearch: {
    placeName: "",
    language: "",
    address: "",
    district: "",
    tag: "",
    comment: "",
    publishPermission: [],
  },
};

const moderation = (state = initialState, action: AnyAction): ModerationState => {
  switch (action.type) {
    case SET_MODERATION_PLACE_SEARCH: {
      console.log("SET_MODERATION_PLACE_SEARCH", action.payload);
      return {
        ...state,
        placeSearch: action.payload,
      };
    }

    case CLEAR_MODERATION_PLACE_SEARCH: {
      console.log("CLEAR_MODERATION_PLACE_SEARCH", action.payload);
      return {
        ...state,
        placeSearch: initialState.placeSearch,
      };
    }

    default: {
      return state;
    }
  }
};

export default moderation;
