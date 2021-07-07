import {
  TranslationStatus,
  SET_PAGE_STATUS,
  SET_TRANSLATION_NAME_STATUS,
  SET_TRANSLATION_SHORT_DESCRIPTION_STATUS,
  SET_TRANSLATION_LONG_DESCRIPTION_STATUS,
  SET_TRANSLATION_PHOTO_STATUS,
  SET_TRANSLATION_PHOTO_ALT_TEXT_STATUS,
} from "../../types/constants";
import { KeyValueTranslationStatus } from "../../types/general";
import { PhotoTranslationStatus } from "../../types/translation_status";
import { TranslationStatusAction } from "./translationStatusTypes";

export const setPageStatus = (status: TranslationStatus): TranslationStatusAction => ({
  type: SET_PAGE_STATUS,
  payload: status,
});

export const setTranslationNameStatus = (status: KeyValueTranslationStatus): TranslationStatusAction => ({
  type: SET_TRANSLATION_NAME_STATUS,
  payload: status,
});

export const setTranslationShortDescriptionStatus = (status: KeyValueTranslationStatus): TranslationStatusAction => ({
  type: SET_TRANSLATION_SHORT_DESCRIPTION_STATUS,
  payload: status,
});

export const setTranslationLongDescriptionStatus = (status: KeyValueTranslationStatus): TranslationStatusAction => ({
  type: SET_TRANSLATION_LONG_DESCRIPTION_STATUS,
  payload: status,
});

export const setTranslationPhotoStatus = (index: number, status: PhotoTranslationStatus | KeyValueTranslationStatus): TranslationStatusAction => ({
  type: SET_TRANSLATION_PHOTO_STATUS,
  payload: { index, status },
});

export const setTranslationPhotoAltTextStatus = (index: number, status: KeyValueTranslationStatus): TranslationStatusAction => ({
  type: SET_TRANSLATION_PHOTO_ALT_TEXT_STATUS,
  payload: { index, status },
});
