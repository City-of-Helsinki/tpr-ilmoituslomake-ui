import { AnyAction } from "redux";
import { TranslationState } from "./types";
import {
  INITIAL_TRANSLATION,
  INITIAL_TRANSLATION_EXTRA,
  SET_TRANSLATION_TASK_RESULTS,
  SET_TRANSLATION_TASK_SEARCH,
  SET_TRANSLATION_NAME,
  SET_TRANSLATION_SHORT_DESCRIPTION,
  SET_TRANSLATION_LONG_DESCRIPTION,
  SET_TRANSLATION_PHOTO,
  INITIAL_NOTIFICATION,
} from "../../types/constants";
import { PhotoTranslation } from "../../types/general";

const initialState: TranslationState = {
  taskSearch: {
    placeName: "",
    request: "",
    searchDone: false,
  },
  taskResults: {
    results: [],
    count: 0,
  },
  selectedTaskId: 0,
  selectedTask: { ...INITIAL_NOTIFICATION, location: [0, 0] },
  translatedTaskId: 0,
  translatedTask: { ...INITIAL_TRANSLATION, location: [0, 0] },
  translationExtra: INITIAL_TRANSLATION_EXTRA,
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

    case SET_TRANSLATION_NAME: {
      console.log("SET_TRANSLATION_NAME", action.payload);
      return {
        ...state,
        translatedTask: { ...state.translatedTask, name: { ...state.translatedTask.name, ...action.payload } },
      };
    }

    case SET_TRANSLATION_SHORT_DESCRIPTION: {
      console.log("SET_TRANSLATION_SHORT_DESCRIPTION", action.payload);
      return {
        ...state,
        translatedTask: {
          ...state.translatedTask,
          description: {
            ...state.translatedTask.description,
            short: { ...state.translatedTask.description.short, ...action.payload },
          },
        },
      };
    }

    case SET_TRANSLATION_LONG_DESCRIPTION: {
      console.log("SET_TRANSLATION_LONG_DESCRIPTION", action.payload);
      return {
        ...state,
        translatedTask: {
          ...state.translatedTask,
          description: {
            ...state.translatedTask.description,
            long: { ...state.translatedTask.description.long, ...action.payload },
          },
        },
      };
    }

    case SET_TRANSLATION_PHOTO: {
      console.log("SET_TRANSLATION_PHOTO", action.payload);

      // Combine the field value with the existing photo in the array
      const photosTranslated = [
        ...state.translationExtra.photosTranslated.reduce(
          (acc: PhotoTranslation[], photo, index) => [...acc, action.payload.index === index ? { ...photo, ...action.payload.value } : photo],
          []
        ),
      ];

      return {
        ...state,
        translationExtra: { ...state.translationExtra, photosTranslated },
      };
    }

    default: {
      return state;
    }
  }
};

export default translation;
