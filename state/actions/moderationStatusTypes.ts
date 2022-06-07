import type { AnyAction } from "redux";
import {
  ModerationStatus,
  SET_PAGE_STATUS,
  SET_MODERATION_NAME_STATUS,
  SET_MODERATION_SHORT_DESCRIPTION_STATUS,
  SET_MODERATION_LONG_DESCRIPTION_STATUS,
  SET_MODERATION_TAG_STATUS,
  SET_MODERATION_MATKO_TAG_STATUS,
  SET_MODERATION_EXTRA_KEYWORDS_STATUS,
  SET_MODERATION_ADDRESS_STATUS,
  SET_MODERATION_LOCATION_STATUS,
  SET_MODERATION_CONTACT_STATUS,
  SET_MODERATION_LINK_STATUS,
  SET_MODERATION_PHOTO_STATUS,
  SET_MODERATION_PHOTO_ALT_TEXT_STATUS,
  REMOVE_MODERATION_PHOTO_STATUS,
} from "../../types/constants";
import { KeyValueStatus } from "../../types/general";
import { PhotoStatus } from "../../types/moderation_status";

interface SetPageStatusAction extends AnyAction {
  type: typeof SET_PAGE_STATUS;
  payload: ModerationStatus;
}

interface SetModerationNameStatusAction extends AnyAction {
  type: typeof SET_MODERATION_NAME_STATUS;
  payload: KeyValueStatus;
}

interface SetModerationShortDescriptionStatusAction extends AnyAction {
  type: typeof SET_MODERATION_SHORT_DESCRIPTION_STATUS;
  payload: KeyValueStatus;
}

interface SetModerationLongDescriptionStatusAction extends AnyAction {
  type: typeof SET_MODERATION_LONG_DESCRIPTION_STATUS;
  payload: KeyValueStatus;
}

interface SetModerationTagStatusAction extends AnyAction {
  type: typeof SET_MODERATION_TAG_STATUS;
  payload: ModerationStatus;
}

interface SetModerationMatkoTagStatusAction extends AnyAction {
  type: typeof SET_MODERATION_MATKO_TAG_STATUS;
  payload: ModerationStatus;
}

interface SetModerationExtraKeywordsStatusAction extends AnyAction {
  type: typeof SET_MODERATION_EXTRA_KEYWORDS_STATUS;
  payload: KeyValueStatus;
}

interface SetModerationAddressStatusAction extends AnyAction {
  type: typeof SET_MODERATION_ADDRESS_STATUS;
  payload: { language: string; status: KeyValueStatus };
}

interface SetModerationLocationStatusAction extends AnyAction {
  type: typeof SET_MODERATION_LOCATION_STATUS;
  payload: ModerationStatus;
}

interface SetModerationContactStatusAction extends AnyAction {
  type: typeof SET_MODERATION_CONTACT_STATUS;
  payload: KeyValueStatus;
}

interface SetModerationLinkStatusAction extends AnyAction {
  type: typeof SET_MODERATION_LINK_STATUS;
  payload: KeyValueStatus;
}

interface SetModerationPhotoStatusAction extends AnyAction {
  type: typeof SET_MODERATION_PHOTO_STATUS;
  payload: { index: number; status: PhotoStatus | KeyValueStatus };
}

interface SetModerationPhotoAltTextStatusAction extends AnyAction {
  type: typeof SET_MODERATION_PHOTO_ALT_TEXT_STATUS;
  payload: { index: number; status: KeyValueStatus };
}

interface RemoveModerationPhotoStatusAction extends AnyAction {
  type: typeof REMOVE_MODERATION_PHOTO_STATUS;
  payload: number;
}

export type ModerationStatusAction =
  | SetPageStatusAction
  | SetModerationNameStatusAction
  | SetModerationShortDescriptionStatusAction
  | SetModerationLongDescriptionStatusAction
  | SetModerationTagStatusAction
  | SetModerationMatkoTagStatusAction
  | SetModerationExtraKeywordsStatusAction
  | SetModerationAddressStatusAction
  | SetModerationLocationStatusAction
  | SetModerationContactStatusAction
  | SetModerationLinkStatusAction
  | SetModerationPhotoStatusAction
  | SetModerationPhotoAltTextStatusAction
  | RemoveModerationPhotoStatusAction;
