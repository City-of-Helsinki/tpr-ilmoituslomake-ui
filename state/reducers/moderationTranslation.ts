import { AnyAction } from "redux";
import { ModerationTranslationState } from "./types";
import {
  SET_MODERATION_TRANSLATION_TASK_RESULTS,
  SET_MODERATION_TRANSLATION_TASK_SEARCH,
  SET_MODERATION_TRANSLATION_SELECTED_TASKS,
  SET_MODERATION_TRANSLATION_PLACE_SEARCH,
  CLEAR_MODERATION_TRANSLATION_PLACE_SEARCH,
  SET_MODERATION_TRANSLATION_PLACE_RESULTS,
  SET_MODERATION_TRANSLATION_SELECTED_PLACES,
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
  placeSearch: {
    placeName: "",
    language: "",
    address: "",
    district: "",
    ontologyIds: [],
    matkoIds: [],
    comment: "",
    searchDone: false,
  },
  placeResults: {
    results: [],
    count: 0,
  },
  selectedPlaces: {
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

    case SET_MODERATION_TRANSLATION_PLACE_SEARCH: {
      console.log("SET_MODERATION_TRANSLATION_PLACE_SEARCH", action.payload);
      return {
        ...state,
        placeSearch: action.payload,
      };
    }

    case CLEAR_MODERATION_TRANSLATION_PLACE_SEARCH: {
      console.log("CLEAR_MODERATION_TRANSLATION_PLACE_SEARCH", action.payload);
      return {
        ...state,
        placeSearch: initialState.placeSearch,
      };
    }

    case SET_MODERATION_TRANSLATION_PLACE_RESULTS: {
      console.log("SET_MODERATION_TRANSLATION_PLACE_RESULTS", action.payload);
      return {
        ...state,
        placeResults: action.payload || [],
      };
    }

    case SET_MODERATION_TRANSLATION_SELECTED_PLACES: {
      console.log("SET_MODERATION_TRANSLATION_SELECTED_PLACES", action.payload);
      return {
        ...state,
        selectedPlaces: action.payload,
      };
    }

    default: {
      return state;
    }
  }
};

export default moderationTranslation;
