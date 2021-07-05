import { AnyAction } from "redux";
import { TranslationState } from "./types";
import { SET_TRANSLATION_TASK_SEARCH, SET_TRANSLATION_TASK_RESULTS } from "../../types/constants";

const initialState: TranslationState = {
  taskSearch: {
    placeName: "",
    request: "",
    requestOptions: [],
    taskStatus: "",
    groupByRequest: false,
    searchDone: false,
  },
  taskResults: {
    results: [],
    count: 0,
  },
};

const translation = (state = initialState, action: AnyAction): TranslationState => {
  switch (action.type) {
    case SET_TRANSLATION_TASK_SEARCH: {
      console.log("SET_TRANSLATION_TASK_SEARCH", action.payload);
      return {
        ...state,
        taskSearch: action.payload,
      };
    }

    case SET_TRANSLATION_TASK_RESULTS: {
      console.log("SET_TRANSLATION_TASK_RESULTS", action.payload);
      return {
        ...state,
        taskResults: action.payload,
      };
    }

    default: {
      return state;
    }
  }
};

export default translation;
