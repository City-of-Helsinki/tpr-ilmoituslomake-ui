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
import { ModerationStatusAction } from "./moderationStatusTypes";

export const setPageStatus = (status: ModerationStatus): ModerationStatusAction => ({
  type: SET_PAGE_STATUS,
  payload: status,
});

export const setModerationNameStatus = (status: KeyValueStatus): ModerationStatusAction => ({
  type: SET_MODERATION_NAME_STATUS,
  payload: status,
});

export const setModerationShortDescriptionStatus = (status: KeyValueStatus): ModerationStatusAction => ({
  type: SET_MODERATION_SHORT_DESCRIPTION_STATUS,
  payload: status,
});

export const setModerationLongDescriptionStatus = (status: KeyValueStatus): ModerationStatusAction => ({
  type: SET_MODERATION_LONG_DESCRIPTION_STATUS,
  payload: status,
});

export const setModerationTagStatus = (status: ModerationStatus): ModerationStatusAction => ({
  type: SET_MODERATION_TAG_STATUS,
  payload: status,
});

export const setModerationMatkoTagStatus = (status: ModerationStatus): ModerationStatusAction => ({
  type: SET_MODERATION_MATKO_TAG_STATUS,
  payload: status,
});

export const setModerationExtraKeywordsStatus = (status: ModerationStatus): ModerationStatusAction => ({
  type: SET_MODERATION_EXTRA_KEYWORDS_STATUS,
  payload: status,
});

export const setModerationAddressStatus = (language: string, status: KeyValueStatus): ModerationStatusAction => ({
  type: SET_MODERATION_ADDRESS_STATUS,
  payload: { language, status },
});

export const setModerationLocationStatus = (status: ModerationStatus): ModerationStatusAction => ({
  type: SET_MODERATION_LOCATION_STATUS,
  payload: status,
});

export const setModerationContactStatus = (status: KeyValueStatus): ModerationStatusAction => ({
  type: SET_MODERATION_CONTACT_STATUS,
  payload: status,
});

export const setModerationLinkStatus = (status: KeyValueStatus): ModerationStatusAction => ({
  type: SET_MODERATION_LINK_STATUS,
  payload: status,
});

export const setModerationPhotoStatus = (index: number, status: PhotoStatus | KeyValueStatus): ModerationStatusAction => ({
  type: SET_MODERATION_PHOTO_STATUS,
  payload: { index, status },
});

export const setModerationPhotoAltTextStatus = (index: number, status: KeyValueStatus): ModerationStatusAction => ({
  type: SET_MODERATION_PHOTO_ALT_TEXT_STATUS,
  payload: { index, status },
});

export const removeModerationPhotoStatus = (index: number): ModerationStatusAction => ({
  type: REMOVE_MODERATION_PHOTO_STATUS,
  payload: index,
});
