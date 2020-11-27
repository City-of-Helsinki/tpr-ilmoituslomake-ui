import { SET_MODERATION_PLACE_SEARCH, CLEAR_MODERATION_PLACE_SEARCH } from "../../types/constants";
import { ModerationAction } from "./types";
import { PlaceSearch } from "../../types/general";

export const setModerationPlaceSearch = (placeSearch: PlaceSearch): ModerationAction => ({
  type: SET_MODERATION_PLACE_SEARCH,
  payload: placeSearch,
});

export const clearModerationPlaceSearch = (): ModerationAction => ({
  type: CLEAR_MODERATION_PLACE_SEARCH,
  payload: undefined,
});
