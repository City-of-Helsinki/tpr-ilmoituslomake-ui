import { AnyAction } from "redux";
import { TranslationStatusState } from "./types";
import {
  TranslationStatus,
  SET_PAGE_STATUS,
  SET_TRANSLATION_NAME_STATUS,
  SET_TRANSLATION_SHORT_DESCRIPTION_STATUS,
  SET_TRANSLATION_LONG_DESCRIPTION_STATUS,
  SET_TRANSLATION_PHOTO_STATUS,
  SET_TRANSLATION_PHOTO_ALT_TEXT_STATUS,
  INITIAL_TRANSLATION_STATUS,
} from "../../types/constants";
import { PhotoTranslationStatus } from "../../types/translation_status";

const initialState: TranslationStatusState = {
  pageStatus: TranslationStatus.Unknown,
  translationStatus: INITIAL_TRANSLATION_STATUS,
};

const translationStatus = (state = initialState, action: AnyAction): TranslationStatusState => {
  switch (action.type) {
    case SET_PAGE_STATUS: {
      console.log("SET_PAGE_STATUS", action.payload);
      return {
        ...state,
        pageStatus: action.payload,
      };
    }

    case SET_TRANSLATION_NAME_STATUS: {
      console.log("SET_TRANSLATION_NAME_STATUS", action.payload);
      return {
        ...state,
        translationStatus: { ...state.translationStatus, name: { ...state.translationStatus.name, ...action.payload } },
      };
    }

    case SET_TRANSLATION_SHORT_DESCRIPTION_STATUS: {
      console.log("SET_TRANSLATION_SHORT_DESCRIPTION_STATUS", action.payload);
      return {
        ...state,
        translationStatus: {
          ...state.translationStatus,
          description: {
            ...state.translationStatus.description,
            short: { ...state.translationStatus.description.short, ...action.payload },
          },
        },
      };
    }

    case SET_TRANSLATION_LONG_DESCRIPTION_STATUS: {
      console.log("SET_TRANSLATION_LONG_DESCRIPTION_STATUS", action.payload);
      return {
        ...state,
        translationStatus: {
          ...state.translationStatus,
          description: {
            ...state.translationStatus.description,
            long: { ...state.translationStatus.description.long, ...action.payload },
          },
        },
      };
    }

    case SET_TRANSLATION_PHOTO_STATUS: {
      console.log("SET_TRANSLATION_PHOTO_STATUS", action.payload);

      // Combine the field status with the existing photo status in the array
      const photos = [
        ...state.translationStatus.photos.reduce(
          (acc: PhotoTranslationStatus[], photoStatus, index) => [
            ...acc,
            action.payload.index === index ? { ...photoStatus, ...action.payload.status } : photoStatus,
          ],
          []
        ),
      ];

      return {
        ...state,
        translationStatus: { ...state.translationStatus, photos },
      };
    }

    case SET_TRANSLATION_PHOTO_ALT_TEXT_STATUS: {
      console.log("SET_TRANSLATION_PHOTO_ALT_TEXT_STATUS", action.payload);

      // Combine the field status with the existing photo alt-text status in the array
      const photos = [
        ...state.translationStatus.photos.reduce(
          (acc: PhotoTranslationStatus[], photoStatus, index) => [
            ...acc,
            action.payload.index === index ? { ...photoStatus, altText: { ...photoStatus.altText, ...action.payload.status } } : photoStatus,
          ],
          []
        ),
      ];

      return {
        ...state,
        translationStatus: { ...state.translationStatus, photos },
      };
    }

    default: {
      return state;
    }
  }
};

export default translationStatus;
