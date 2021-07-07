import { AnyAction } from "redux";
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

interface SetPageStatusAction extends AnyAction {
  type: typeof SET_PAGE_STATUS;
  payload: TranslationStatus;
}

interface SetTranslationNameStatusAction extends AnyAction {
  type: typeof SET_TRANSLATION_NAME_STATUS;
  payload: KeyValueTranslationStatus;
}

interface SetTranslationShortDescriptionStatusAction extends AnyAction {
  type: typeof SET_TRANSLATION_SHORT_DESCRIPTION_STATUS;
  payload: KeyValueTranslationStatus;
}

interface SetTranslationLongDescriptionStatusAction extends AnyAction {
  type: typeof SET_TRANSLATION_LONG_DESCRIPTION_STATUS;
  payload: KeyValueTranslationStatus;
}

interface SetTranslationPhotoStatusAction extends AnyAction {
  type: typeof SET_TRANSLATION_PHOTO_STATUS;
  payload: { index: number; status: PhotoTranslationStatus | KeyValueTranslationStatus };
}

interface SetTranslationPhotoAltTextStatusAction extends AnyAction {
  type: typeof SET_TRANSLATION_PHOTO_ALT_TEXT_STATUS;
  payload: { index: number; status: KeyValueTranslationStatus };
}

export type TranslationStatusAction =
  | SetPageStatusAction
  | SetTranslationNameStatusAction
  | SetTranslationShortDescriptionStatusAction
  | SetTranslationLongDescriptionStatusAction
  | SetTranslationPhotoStatusAction
  | SetTranslationPhotoAltTextStatusAction;
