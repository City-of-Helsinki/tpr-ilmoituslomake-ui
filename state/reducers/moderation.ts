import { AnyAction } from "redux";
import { ModerationState } from "./types";
import {
  SET_MODERATION_PLACE_SEARCH,
  CLEAR_MODERATION_PLACE_SEARCH,
  SET_MODERATION_TASK_SEARCH,
  SET_MODERATION_NAME,
  SET_MODERATION_SHORT_DESCRIPTION,
  SET_MODERATION_LONG_DESCRIPTION,
  INITIAL_NOTIFICATION,
  INITIAL_NOTIFICATION_EXTRA,
} from "../../types/constants";

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
  taskSearch: {
    placeName: "",
    taskType: "",
  },
  selectedTask: { ...INITIAL_NOTIFICATION, location: [0, 0] },
  selectedTaskExtra: INITIAL_NOTIFICATION_EXTRA,
  modifiedTask: { ...INITIAL_NOTIFICATION, location: [0, 0] },
  modifiedTaskExtra: INITIAL_NOTIFICATION_EXTRA,
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

    case SET_MODERATION_TASK_SEARCH: {
      console.log("SET_MODERATION_TASK_SEARCH", action.payload);
      return {
        ...state,
        taskSearch: action.payload,
      };
    }

    case SET_MODERATION_NAME: {
      console.log("SET_MODERATION_NAME", action.payload);
      return {
        ...state,
        modifiedTask: { ...state.modifiedTask, name: { ...state.modifiedTask.name, ...action.payload } },
      };
    }

    case SET_MODERATION_SHORT_DESCRIPTION: {
      console.log("SET_MODERATION_SHORT_DESCRIPTION", action.payload);
      return {
        ...state,
        modifiedTask: {
          ...state.modifiedTask,
          description: {
            ...state.modifiedTask.description,
            short: { ...state.modifiedTask.description.short, ...action.payload },
          },
        },
      };
    }

    case SET_MODERATION_LONG_DESCRIPTION: {
      console.log("SET_MODERATION_LONG_DESCRIPTION", action.payload);
      return {
        ...state,
        modifiedTask: {
          ...state.modifiedTask,
          description: {
            ...state.modifiedTask.description,
            long: { ...state.modifiedTask.description.long, ...action.payload },
          },
        },
      };
    }

    default: {
      return state;
    }
  }
};

export default moderation;
