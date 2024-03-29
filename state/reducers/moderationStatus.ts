import type { AnyAction } from "redux";
import { ModerationStatusState } from "./types";
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
  SET_MODERATION_SOCIAL_MEDIA_STATUS,
  REMOVE_MODERATION_SOCIAL_MEDIA_STATUS,
  SET_MODERATION_PHOTO_STATUS,
  SET_MODERATION_PHOTO_ALT_TEXT_STATUS,
  REMOVE_MODERATION_PHOTO_STATUS,
  SET_MODERATION_OPENING_TIMES_STATUS,
} from "../../types/constants";
import { PhotoStatus, SocialMediaStatus } from "../../types/moderation_status";
import { INITIAL_MODERATION_STATUS } from "../../types/initial";

const initialState: ModerationStatusState = {
  pageStatus: ModerationStatus.Unknown,
  moderationStatus: INITIAL_MODERATION_STATUS,
};

const moderationStatus = (state: ModerationStatusState | undefined, action: AnyAction): ModerationStatusState => {
  if (!state) {
    state = initialState;
  }

  switch (action.type) {
    case SET_PAGE_STATUS: {
      console.log("SET_PAGE_STATUS", action.payload);
      return {
        ...state,
        pageStatus: action.payload,
      };
    }

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

    case SET_MODERATION_MATKO_TAG_STATUS: {
      console.log("SET_MODERATION_MATKO_TAG_STATUS", action.payload);
      return {
        ...state,
        moderationStatus: { ...state.moderationStatus, matko_ids: action.payload },
      };
    }

    case SET_MODERATION_EXTRA_KEYWORDS_STATUS: {
      console.log("SET_MODERATION_EXTRA_KEYWORDS_STATUS", action.payload);
      return {
        ...state,
        moderationStatus: { ...state.moderationStatus, extra_keywords: { ...state.moderationStatus.extra_keywords, ...action.payload } },
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
          businessid: action.payload.businessid ?? state.moderationStatus.businessid,
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

    case SET_MODERATION_SOCIAL_MEDIA_STATUS: {
      console.log("SET_MODERATION_SOCIAL_MEDIA_STATUS", action.payload);

      // If index -1 is specified, add the social media item to the array
      // Otherwise combine the field status with the existing social media item status in the array
      const socialMediaItems = [
        ...state.moderationStatus.socialMedia.reduce(
          (acc: SocialMediaStatus[], socialMediaStatus, index) => [
            ...acc,
            action.payload.index === index ? { ...socialMediaStatus, ...action.payload.status } : socialMediaStatus,
          ],
          []
        ),
        ...(action.payload.index === -1 ? [action.payload.status] : []),
      ];

      return {
        ...state,
        moderationStatus: { ...state.moderationStatus, socialMedia: socialMediaItems },
      };
    }

    case REMOVE_MODERATION_SOCIAL_MEDIA_STATUS: {
      console.log("REMOVE_MODERATION_SOCIAL_MEDIA_STATUS", action.payload);

      // Remove the social media item at the specified index
      const socialMediaItems = state.moderationStatus.socialMedia.reduce((acc: SocialMediaStatus[], socialMediaStatus, index) => {
        return action.payload === index ? acc : [...acc, socialMediaStatus];
      }, []);

      return {
        ...state,
        moderationStatus: { ...state.moderationStatus, socialMedia: socialMediaItems },
      };
    }

    case SET_MODERATION_PHOTO_STATUS: {
      console.log("SET_MODERATION_PHOTO_STATUS", action.payload);

      // If index -1 is specified, add the photo to the array
      // Otherwise combine the field status with the existing photo status in the array
      const photos = [
        ...state.moderationStatus.photos.reduce(
          (acc: PhotoStatus[], photoStatus, index) => [
            ...acc,
            action.payload.index === index ? { ...photoStatus, ...action.payload.status } : photoStatus,
          ],
          []
        ),
        ...(action.payload.index === -1 ? [action.payload.status] : []),
      ];

      return {
        ...state,
        moderationStatus: { ...state.moderationStatus, photos },
      };
    }

    case SET_MODERATION_PHOTO_ALT_TEXT_STATUS: {
      console.log("SET_MODERATION_PHOTO_ALT_TEXT_STATUS", action.payload);

      // Combine the field status with the existing photo alt-text status in the array
      const photos = [
        ...state.moderationStatus.photos.reduce(
          (acc: PhotoStatus[], photoStatus, index) => [
            ...acc,
            action.payload.index === index ? { ...photoStatus, altText: { ...photoStatus.altText, ...action.payload.status } } : photoStatus,
          ],
          []
        ),
      ];

      return {
        ...state,
        moderationStatus: { ...state.moderationStatus, photos },
      };
    }

    case REMOVE_MODERATION_PHOTO_STATUS: {
      console.log("REMOVE_MODERATION_PHOTO_STATUS", action.payload);

      // Remove the photo at the specified index
      const photos = state.moderationStatus.photos.reduce((acc: PhotoStatus[], photoStatus, index) => {
        return action.payload === index ? acc : [...acc, photoStatus];
      }, []);

      return {
        ...state,
        moderationStatus: { ...state.moderationStatus, photos },
      };
    }

    case SET_MODERATION_OPENING_TIMES_STATUS: {
      console.log("SET_MODERATION_OPENING_TIMES_STATUS", action.payload);
      return {
        ...state,
        moderationStatus: {
          ...state.moderationStatus,
          openingTimes: action.payload,
        },
      };
    }

    default: {
      return state;
    }
  }
};

export default moderationStatus;
