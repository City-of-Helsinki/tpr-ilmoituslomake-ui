import { AnyAction } from "redux";
import { ModerationStatusState } from "./types";
import {
  SET_MODERATION_NAME_STATUS,
  SET_MODERATION_SHORT_DESCRIPTION_STATUS,
  SET_MODERATION_LONG_DESCRIPTION_STATUS,
  SET_MODERATION_TAG_STATUS,
  SET_MODERATION_ADDRESS_STATUS,
  SET_MODERATION_LOCATION_STATUS,
  SET_MODERATION_CONTACT_STATUS,
  SET_MODERATION_LINK_STATUS,
  SET_MODERATION_PHOTO_STATUS,
  INITIAL_MODERATION_STATUS,
} from "../../types/constants";

const initialState: ModerationStatusState = {
  moderationStatus: INITIAL_MODERATION_STATUS,
};

const moderationStatus = (state = initialState, action: AnyAction): ModerationStatusState => {
  switch (action.type) {
    case SET_MODERATION_NAME_STATUS: {
      console.log("SET_MODERATION_NAME_STATUS", action.payload);
      return {
        ...state,
        moderationStatus: { ...state.moderationStatus, name: { ...state.moderationStatus.name, ...action.payload } },
      };
    }

    case SET_MODERATION_SHORT_DESCRIPTION_STATUS: {
      console.log("SET_MODERATION_SHORT_DESCRIPTION_STATUS", action.payload);
      return {
        ...state,
        moderationStatus: {
          ...state.moderationStatus,
          description: {
            ...state.moderationStatus.description,
            short: { ...state.moderationStatus.description.short, ...action.payload },
          },
        },
      };
    }

    case SET_MODERATION_LONG_DESCRIPTION_STATUS: {
      console.log("SET_MODERATION_LONG_DESCRIPTION_STATUS", action.payload);
      return {
        ...state,
        moderationStatus: {
          ...state.moderationStatus,
          description: {
            ...state.moderationStatus.description,
            long: { ...state.moderationStatus.description.long, ...action.payload },
          },
        },
      };
    }

    case SET_MODERATION_TAG_STATUS: {
      console.log("SET_MODERATION_TAG_STATUS", action.payload);
      return {
        ...state,
        moderationStatus: { ...state.moderationStatus, ontology_ids: action.payload },
      };
    }

    case SET_MODERATION_ADDRESS_STATUS: {
      console.log("SET_MODERATION_ADDRESS_STATUS", action.payload);
      const { fi, sv } = state.moderationStatus.address;
      return {
        ...state,
        moderationStatus: {
          ...state.moderationStatus,
          address: {
            ...state.moderationStatus.address,
            [action.payload.language]: { ...(action.payload.language === "sv" ? sv : fi), ...action.payload.status },
          },
        },
      };
    }

    case SET_MODERATION_LOCATION_STATUS: {
      console.log("SET_MODERATION_LOCATION_STATUS", action.payload);
      return {
        ...state,
        moderationStatus: {
          ...state.moderationStatus,
          location: action.payload,
        },
      };
    }

    case SET_MODERATION_CONTACT_STATUS: {
      console.log("SET_MODERATION_CONTACT_STATUS", action.payload);
      return {
        ...state,
        moderationStatus: {
          ...state.moderationStatus,
          phone: action.payload.phone ?? state.moderationStatus.phone,
          email: action.payload.email ?? state.moderationStatus.email,
        },
      };
    }

    case SET_MODERATION_LINK_STATUS: {
      console.log("SET_MODERATION_LINK_STATUS", action.payload);
      return {
        ...state,
        moderationStatus: { ...state.moderationStatus, website: { ...state.moderationStatus.website, ...action.payload } },
      };
    }

    case SET_MODERATION_PHOTO_STATUS: {
      console.log("SET_MODERATION_PHOTO_STATUS", action.payload);
      return {
        ...state,
        moderationStatus: { ...state.moderationStatus, photos: action.payload },
      };
    }

    default: {
      return state;
    }
  }
};

export default moderationStatus;
