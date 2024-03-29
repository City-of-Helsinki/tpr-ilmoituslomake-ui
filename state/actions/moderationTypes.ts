import type { AnyAction } from "redux";
import {
  SET_MODERATION_PLACE_SEARCH,
  CLEAR_MODERATION_PLACE_SEARCH,
  SET_MODERATION_PLACE_RESULTS,
  SET_MODERATION_TASK_SEARCH,
  SET_MODERATION_TASK_RESULTS,
  SET_MODERATION_NAME,
  SET_MODERATION_SHORT_DESCRIPTION,
  SET_MODERATION_LONG_DESCRIPTION,
  SET_MODERATION_TAG,
  SET_MODERATION_MATKO_TAG,
  SET_MODERATION_TAG_OPTIONS,
  SET_MODERATION_MATKO_TAG_OPTIONS,
  SET_MODERATION_EXTRA_KEYWORDS,
  SET_MODERATION_ADDRESS,
  SET_MODERATION_ADDRESS_FOUND,
  SET_MODERATION_LOCATION,
  SET_MODERATION_CONTACT,
  SET_MODERATION_LINK,
  SET_MODERATION_SOCIAL_MEDIA,
  REMOVE_MODERATION_SOCIAL_MEDIA,
  SET_MODERATION_PHOTO,
  REMOVE_MODERATION_PHOTO,
  SET_MODERATION_OPENING_TIMES_ID,
} from "../../types/constants";
import {
  AddressSearchResult,
  KeyValueString,
  MatkoTagOption,
  ModerationPlaceResults,
  ModerationPlaceSearch,
  ModerationTaskSearch,
  ModerationTodoResults,
  Photo,
  SocialMedia,
  TagOption,
} from "../../types/general";

interface SetModerationPlaceSearchAction extends AnyAction {
  type: typeof SET_MODERATION_PLACE_SEARCH;
  payload: ModerationPlaceSearch;
}

interface ClearModerationPlaceSearchAction extends AnyAction {
  type: typeof CLEAR_MODERATION_PLACE_SEARCH;
  payload: undefined;
}

interface SetModerationPlaceResultsAction extends AnyAction {
  type: typeof SET_MODERATION_PLACE_RESULTS;
  payload: ModerationPlaceResults;
}

interface SetModerationTaskSearchAction extends AnyAction {
  type: typeof SET_MODERATION_TASK_SEARCH;
  payload: ModerationTaskSearch;
}

interface SetModerationTaskResultsAction extends AnyAction {
  type: typeof SET_MODERATION_TASK_RESULTS;
  payload: ModerationTodoResults;
}

interface SetModerationNameAction extends AnyAction {
  type: typeof SET_MODERATION_NAME;
  payload: KeyValueString;
}

interface SetModerationShortDescriptionAction extends AnyAction {
  type: typeof SET_MODERATION_SHORT_DESCRIPTION;
  payload: KeyValueString;
}

interface SetModerationLongDescriptionAction extends AnyAction {
  type: typeof SET_MODERATION_LONG_DESCRIPTION;
  payload: KeyValueString;
}

interface SetModerationTagAction extends AnyAction {
  type: typeof SET_MODERATION_TAG;
  payload: number[];
}

interface SetModerationMatkoTagAction extends AnyAction {
  type: typeof SET_MODERATION_MATKO_TAG;
  payload: number[];
}

interface SetModerationExtraKeywordsAction extends AnyAction {
  type: typeof SET_MODERATION_EXTRA_KEYWORDS;
  payload: { language: string; value: string };
}

interface SetModerationTagOptionsAction extends AnyAction {
  type: typeof SET_MODERATION_TAG_OPTIONS;
  payload: TagOption[];
}

interface SetModerationMatkoTagOptionsAction extends AnyAction {
  type: typeof SET_MODERATION_MATKO_TAG_OPTIONS;
  payload: MatkoTagOption[];
}

interface SetModerationAddressAction extends AnyAction {
  type: typeof SET_MODERATION_ADDRESS;
  payload: { language: string; value: KeyValueString };
}

interface SetModerationAddressFoundAction extends AnyAction {
  type: typeof SET_MODERATION_ADDRESS_FOUND;
  payload: AddressSearchResult | undefined;
}

interface SetModerationLocationAction extends AnyAction {
  type: typeof SET_MODERATION_LOCATION;
  payload: [number, number];
}

interface SetModerationContactAction extends AnyAction {
  type: typeof SET_MODERATION_CONTACT;
  payload: KeyValueString;
}

interface SetModerationLinkAction extends AnyAction {
  type: typeof SET_MODERATION_LINK;
  payload: KeyValueString;
}

interface SetModerationSocialMediaAction extends AnyAction {
  type: typeof SET_MODERATION_SOCIAL_MEDIA;
  payload: { index: number; value: SocialMedia };
}

interface RemoveModerationSocialMediaAction extends AnyAction {
  type: typeof REMOVE_MODERATION_SOCIAL_MEDIA;
  payload: number;
}

interface SetModerationPhotoAction extends AnyAction {
  type: typeof SET_MODERATION_PHOTO;
  payload: { index: number; value: Photo };
}

interface RemoveModerationPhotoAction extends AnyAction {
  type: typeof REMOVE_MODERATION_PHOTO;
  payload: number;
}

interface SetModerationOpeningTimesId extends AnyAction {
  type: typeof SET_MODERATION_OPENING_TIMES_ID;
  payload: number;
}

export type ModerationAction =
  | SetModerationPlaceSearchAction
  | ClearModerationPlaceSearchAction
  | SetModerationPlaceResultsAction
  | SetModerationTaskSearchAction
  | SetModerationTaskResultsAction
  | SetModerationNameAction
  | SetModerationShortDescriptionAction
  | SetModerationLongDescriptionAction
  | SetModerationTagAction
  | SetModerationMatkoTagAction
  | SetModerationTagOptionsAction
  | SetModerationMatkoTagOptionsAction
  | SetModerationExtraKeywordsAction
  | SetModerationAddressAction
  | SetModerationAddressFoundAction
  | SetModerationLocationAction
  | SetModerationContactAction
  | SetModerationLinkAction
  | SetModerationSocialMediaAction
  | RemoveModerationSocialMediaAction
  | SetModerationPhotoAction
  | RemoveModerationPhotoAction
  | SetModerationOpeningTimesId;
