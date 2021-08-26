import { AnyAction } from "redux";
import { TranslationState } from "./types";
import {
  SET_TRANSLATION_TASK_RESULTS,
  SET_TRANSLATION_TASK_SEARCH,
  SET_TRANSLATION_NAME,
  SET_TRANSLATION_SHORT_DESCRIPTION,
  SET_TRANSLATION_LONG_DESCRIPTION,
  SET_TRANSLATION_PHOTO,
  SET_TRANSLATION_TASK_PAGE_VALID,
  SET_TRANSLATION_TASK_VALIDATION,
  SET_TRANSLATION_TASK_PHOTO_VALIDATION,
} from "../../types/constants";
import { PhotoTranslation, TranslationTaskPhotoValidation } from "../../types/general";
import { INITIAL_NOTIFICATION, INITIAL_TRANSLATION, INITIAL_TRANSLATION_EXTRA } from "../../types/initial";

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
  taskPageValid: true,
  taskValidation: {
    name: { valid: true },
    descriptionShort: { valid: true },
    descriptionLong: { valid: true },
    photos: [],
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

    case SET_TRANSLATION_TASK_PAGE_VALID: {
      console.log("SET_TRANSLATION_TASK_PAGE_VALID", action.payload);
      return {
        ...state,
        taskPageValid: action.payload,
      };
    }

    case SET_TRANSLATION_TASK_VALIDATION: {
      console.log("SET_TRANSLATION_TASK_VALIDATION", action.payload);
      return {
        ...state,
        taskValidation: { ...state.taskValidation, ...action.payload },
      };
    }

    case SET_TRANSLATION_TASK_PHOTO_VALIDATION: {
      console.log("SET_TRANSLATION_TASK_PHOTO_VALIDATION", action.payload);

      // Combine the field validation with the existing photo validation in the array
      const photos = [
        ...state.taskValidation.photos.reduce(
          (acc: TranslationTaskPhotoValidation[], photoValid, index) => [
            ...acc,
            action.payload.index === index ? { ...photoValid, ...action.payload.value } : photoValid,
          ],
          []
        ),
      ];

      return {
        ...state,
        taskValidation: { ...state.taskValidation, photos },
      };
    }

    default: {
      return state;
    }
  }
};

export default translation;
