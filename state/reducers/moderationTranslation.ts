import { AnyAction } from "redux";
import { ModerationTranslationState } from "./types";
import {
  SET_MODERATION_TRANSLATION_TASK_RESULTS,
  SET_MODERATION_TRANSLATION_TASK_SEARCH,
  SET_MODERATION_TRANSLATION_SELECTED_TASKS,
} from "../../types/constants";

const initialState: ModerationTranslationState = {
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
  selectedTasks: {
    selectedIds: [],
    isAllSelected: false,
  },
};

const moderationTranslation = (state = initialState, action: AnyAction): ModerationTranslationState => {
  switch (action.type) {
    case SET_MODERATION_TRANSLATION_TASK_SEARCH: {
      console.log("SET_MODERATION_TRANSLATION_TASK_SEARCH", action.payload);
      return {
        ...state,
        taskSearch: action.payload,
      };
    }

    case SET_MODERATION_TRANSLATION_TASK_RESULTS: {
      console.log("SET_MODERATION_TRANSLATION_TASK_RESULTS", action.payload);
      return {
        ...state,
        taskResults: action.payload,
      };
    }

    case SET_MODERATION_TRANSLATION_SELECTED_TASKS: {
      console.log("SET_MODERATION_TRANSLATION_SELECTED_TASKS", action.payload);
      return {
        ...state,
        selectedTasks: action.payload,
      };
    }

    default: {
      return state;
    }
  }
};

export default moderationTranslation;
