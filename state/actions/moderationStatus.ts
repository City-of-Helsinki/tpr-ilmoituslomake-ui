import {
  ModerationStatus,
  SET_MODERATION_NAME_STATUS,
  SET_MODERATION_SHORT_DESCRIPTION_STATUS,
  SET_MODERATION_LONG_DESCRIPTION_STATUS,
  SET_MODERATION_TAG_STATUS,
  SET_MODERATION_ADDRESS_STATUS,
  SET_MODERATION_LOCATION_STATUS,
  SET_MODERATION_CONTACT_STATUS,
  SET_MODERATION_LINK_STATUS,
  SET_MODERATION_PHOTO_STATUS,
} from "../../types/constants";
import { KeyValueStatus } from "../../types/general";
import { PhotoStatus } from "../../types/moderation_status";
import { ModerationStatusAction } from "./types";

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

export const setModerationPhotoStatus = (status: PhotoStatus[]): ModerationStatusAction => ({
  type: SET_MODERATION_PHOTO_STATUS,
  payload: status,
});
