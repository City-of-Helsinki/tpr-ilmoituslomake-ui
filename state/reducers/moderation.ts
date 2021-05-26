import { AnyAction } from "redux";
import { ModerationState } from "./types";
import {
  TaskType,
  SET_MODERATION_PLACE_SEARCH,
  CLEAR_MODERATION_PLACE_SEARCH,
  SET_MODERATION_PLACE_RESULTS,
  SET_MODERATION_TASK_SEARCH,
  SET_MODERATION_TASK_RESULTS,
  SET_MODERATION_NAME,
  SET_MODERATION_SHORT_DESCRIPTION,
  SET_MODERATION_LONG_DESCRIPTION,
  SET_MODERATION_TAG,
  SET_MODERATION_TAG_OPTIONS,
  SET_MODERATION_EXTRA_KEYWORDS,
  SET_MODERATION_ADDRESS,
  SET_MODERATION_LOCATION,
  SET_MODERATION_CONTACT,
  SET_MODERATION_LINK,
  SET_MODERATION_PHOTO,
  REMOVE_MODERATION_PHOTO,
  INITIAL_NOTIFICATION,
  INITIAL_MODERATION_EXTRA,
} from "../../types/constants";
import { Photo } from "../../types/general";

const initialState: ModerationState = {
  placeSearch: {
    placeName: "",
    language: "",
    address: "",
    district: "",
    ontologyIds: [],
    comment: "",
  },
  placeResults: {
    results: [],
    count: 0,
  },
  taskSearch: {
    placeName: "",
    taskType: TaskType.Unknown,
  },
  taskResults: [],
  selectedTaskId: 0,
  selectedTask: { ...INITIAL_NOTIFICATION, location: [0, 0] },
  modifiedTaskId: 0,
  modifiedTask: { ...INITIAL_NOTIFICATION, location: [0, 0] },
  moderationExtra: INITIAL_MODERATION_EXTRA,
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

    case SET_MODERATION_PLACE_RESULTS: {
      console.log("SET_MODERATION_PLACE_RESULTS", action.payload);
      return {
        ...state,
        placeResults: action.payload || [],
      };
    }

    case SET_MODERATION_TASK_SEARCH: {
      console.log("SET_MODERATION_TASK_SEARCH", action.payload);
      return {
        ...state,
        taskSearch: action.payload,
      };
    }

    case SET_MODERATION_TASK_RESULTS: {
      console.log("SET_MODERATION_TASK_RESULTS", action.payload);
      return {
        ...state,
        taskResults: action.payload || [],
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

    case SET_MODERATION_TAG: {
      console.log("SET_MODERATION_TAG", action.payload);
      return {
        ...state,
        modifiedTask: { ...state.modifiedTask, ontology_ids: action.payload },
      };
    }

    case SET_MODERATION_TAG_OPTIONS: {
      console.log("SET_MODERATION_TAG_OPTIONS", action.payload);
      return {
        ...state,
        moderationExtra: { ...state.moderationExtra, tagOptions: action.payload },
      };
    }

    case SET_MODERATION_EXTRA_KEYWORDS: {
      console.log("SET_MODERATION_EXTRA_KEYWORDS", action.payload);
      return {
        ...state,
        modifiedTask: {
          ...state.modifiedTask,
          extra_keywords: action.payload
            .split(",")
            .map((extra: string) => extra.trim())
            .filter((extra: string) => extra.length > 0),
        },
        moderationExtra: { ...state.moderationExtra, extraKeywordsTextModified: action.payload },
      };
    }

    case SET_MODERATION_ADDRESS: {
      console.log("SET_MODERATION_ADDRESS", action.payload);
      const { fi, sv } = state.modifiedTask.address;
      return {
        ...state,
        modifiedTask: {
          ...state.modifiedTask,
          address: {
            ...state.modifiedTask.address,
            [action.payload.language]: { ...(action.payload.language === "sv" ? sv : fi), ...action.payload.value },
          },
        },
      };
    }

    case SET_MODERATION_LOCATION: {
      console.log("SET_MODERATION_LOCATION", action.payload);
      return {
        ...state,
        modifiedTask: { ...state.modifiedTask, location: action.payload },
      };
    }

    case SET_MODERATION_CONTACT: {
      console.log("SET_MODERATION_CONTACT", action.payload);
      return {
        ...state,
        modifiedTask: {
          ...state.modifiedTask,
          phone: action.payload.phone ?? state.modifiedTask.phone,
          email: action.payload.email ?? state.modifiedTask.email,
        },
      };
    }

    case SET_MODERATION_LINK: {
      console.log("SET_MODERATION_LINK", action.payload);
      return {
        ...state,
        modifiedTask: { ...state.modifiedTask, website: { ...state.modifiedTask.website, ...action.payload } },
      };
    }

    case SET_MODERATION_PHOTO: {
      console.log("SET_MODERATION_PHOTO", action.payload);

      // If index -1 is specified, add the photo to both arrays
      // Otherwise combine the field value with the existing photo in the modified array
      const photosUuids = [...state.moderationExtra.photosUuids, ...(action.payload.index === -1 ? [action.payload.value.uuid] : [])];
      const photosSelected = [...state.moderationExtra.photosSelected, ...(action.payload.index === -1 ? [action.payload.value] : [])];
      const photosModified = [
        ...state.moderationExtra.photosModified.reduce((acc: Photo[], photo, index) => {
          return [...acc, action.payload.index === index ? { ...photo, ...action.payload.value } : photo];
        }, []),
        ...(action.payload.index === -1 ? [action.payload.value] : []),
      ];

      return {
        ...state,
        moderationExtra: { ...state.moderationExtra, photosUuids, photosSelected, photosModified },
      };
    }

    case REMOVE_MODERATION_PHOTO: {
      console.log("REMOVE_MODERATION_PHOTO", action.payload);

      // Remove the photo at the specified index
      const photosUuids = state.moderationExtra.photosUuids.reduce((acc: string[], uuid, index) => {
        return action.payload === index ? acc : [...acc, uuid];
      }, []);
      const photosSelected = state.moderationExtra.photosSelected.reduce((acc: Photo[], photo, index) => {
        return action.payload === index ? acc : [...acc, photo];
      }, []);
      const photosModified = state.moderationExtra.photosModified.reduce((acc: Photo[], photo, index) => {
        return action.payload === index ? acc : [...acc, photo];
      }, []);

      return {
        ...state,
        moderationExtra: { ...state.moderationExtra, photosUuids, photosSelected, photosModified },
      };
    }

    default: {
      return state;
    }
  }
};

export default moderation;
