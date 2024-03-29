import type { AnyAction } from "redux";
import { ModerationTranslationState } from "./types";
import {
  TaskType,
  SET_MODERATION_TRANSLATION_REQUEST_SEARCH,
  SET_MODERATION_TRANSLATION_REQUEST_RESULTS,
  SET_MODERATION_TRANSLATION_SELECTED_REQUESTS,
  SET_MODERATION_TRANSLATION_TASK_SEARCH,
  SET_MODERATION_TRANSLATION_TASK_RESULTS,
  SET_MODERATION_TRANSLATION_SELECTED_TASKS,
  SET_MODERATION_TRANSLATION_PLACE_SEARCH,
  CLEAR_MODERATION_TRANSLATION_PLACE_SEARCH,
  SET_MODERATION_TRANSLATION_PLACE_RESULTS,
  SET_MODERATION_TRANSLATION_SELECTED_PLACES,
  SET_MODERATION_TRANSLATION_REQUEST,
  SET_MODERATION_TRANSLATION_REQUEST_PAGE_VALID,
  SET_MODERATION_TRANSLATION_REQUEST_VALIDATION,
  SET_MODERATION_TRANSLATION_REQUEST_VALIDATION_SUMMARY,
} from "../../types/constants";

const initialState: ModerationTranslationState = {
  requestSearch: {
    placeName: "",
    request: "",
    searchDone: false,
  },
  requestResults: {
    results: [],
    count: 0,
  },
  selectedRequests: {
    selectedIds: [],
    isAllSelected: false,
  },
  taskSearch: {
    placeName: "",
    request: "",
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
  requestDetail: {
    id: 0,
    request: "",
    tasks: [],
    language: {
      from: "",
      to: "",
    },
    message: "",
    /*
    translator: {
      name: "",
      email: "",
    },
    */
    translator: "",
    taskType: TaskType.Unknown,
  },
  translators: [],
  requestPageValid: true,
  requestValidation: {
    tasks: { valid: true },
    translator: { valid: true },
    language: { valid: true },
    message: { valid: true },
  },
  requestValidationSummary: {},
};

const moderationTranslation = (state: ModerationTranslationState | undefined, action: AnyAction): ModerationTranslationState => {
  if (!state) {
    state = initialState;
  }

  switch (action.type) {
    case SET_MODERATION_TRANSLATION_REQUEST_SEARCH: {
      console.log("SET_MODERATION_TRANSLATION_REQUEST_SEARCH", action.payload);
      return {
        ...state,
        requestSearch: action.payload,
      };
    }

    case SET_MODERATION_TRANSLATION_REQUEST_RESULTS: {
      console.log("SET_MODERATION_TRANSLATION_REQUEST_RESULTS", action.payload);
      return {
        ...state,
        requestResults: action.payload,
      };
    }

    case SET_MODERATION_TRANSLATION_SELECTED_REQUESTS: {
      console.log("SET_MODERATION_TRANSLATION_SELECTED_REQUESTS", action.payload);
      return {
        ...state,
        selectedRequests: action.payload,
      };
    }

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

    case SET_MODERATION_TRANSLATION_REQUEST: {
      console.log("SET_MODERATION_TRANSLATION_REQUEST", action.payload);
      return {
        ...state,
        requestDetail: action.payload,
      };
    }

    case SET_MODERATION_TRANSLATION_REQUEST_PAGE_VALID: {
      console.log("SET_MODERATION_TRANSLATION_REQUEST_PAGE_VALID", action.payload);
      return {
        ...state,
        requestPageValid: action.payload,
      };
    }

    case SET_MODERATION_TRANSLATION_REQUEST_VALIDATION: {
      console.log("SET_MODERATION_TRANSLATION_REQUEST_VALIDATION", action.payload);
      return {
        ...state,
        requestValidation: { ...state.requestValidation, ...action.payload },
      };
    }

    case SET_MODERATION_TRANSLATION_REQUEST_VALIDATION_SUMMARY: {
      console.log("SET_MODERATION_TRANSLATION_REQUEST_VALIDATION_SUMMARY", action.payload);
      return {
        ...state,
        requestValidationSummary: action.payload,
      };
    }

    default: {
      return state;
    }
  }
};

export default moderationTranslation;
