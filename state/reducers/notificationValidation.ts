import type { AnyAction } from "redux";
import { NotificationValidationState } from "./types";
import {
  MAX_PHOTOS,
  SET_PAGE_VALID,
  SET_NOTIFICATION_INPUT_LANGUAGE_VALIDATION,
  SET_NOTIFICATION_NAME_VALIDATION,
  SET_NOTIFICATION_SHORT_DESCRIPTION_VALIDATION,
  SET_NOTIFICATION_LONG_DESCRIPTION_VALIDATION,
  SET_NOTIFICATION_TAG_VALIDATION,
  SET_NOTIFICATION_NOTIFIER_VALIDATION,
  SET_NOTIFICATION_ADDRESS_VALIDATION,
  SET_NOTIFICATION_WHOLE_ADDRESS_VALIDATION,
  SET_NOTIFICATION_LOCATION_VALIDATION,
  SET_NOTIFICATION_CONTACT_VALIDATION,
  SET_NOTIFICATION_LINK_VALIDATION,
  SET_NOTIFICATION_SOCIAL_MEDIA_VALIDATION,
  REMOVE_NOTIFICATION_SOCIAL_MEDIA_VALIDATION,
  SET_NOTIFICATION_PHOTO_VALIDATION,
  SET_NOTIFICATION_PHOTO_ALT_TEXT_VALIDATION,
  REMOVE_NOTIFICATION_PHOTO_VALIDATION,
  SET_NOTIFICATION_TIP_VALIDATION,
  SET_NOTIFICATION_VALIDATION_SUMMARY,
  SET_NOTIFICATION_TIP_VALIDATION_SUMMARY,
} from "../../types/constants";
import { PhotoValidation, SocialMediaValidation } from "../../types/notification_validation";
import { INITIAL_NOTIFICATION_VALIDATION } from "../../types/initial";

const initialState: NotificationValidationState = {
  pageValid: true,
  notificationValidation: INITIAL_NOTIFICATION_VALIDATION,
  tipValidation: {
    target: { valid: true },
    item_type: { valid: true },
    user_place_name: { valid: true },
    user_comments: { valid: true },
    user_details: { valid: true },
  },
  validationSummary: {},
  tipValidationSummary: {},
};

const notificationValidation = (state: NotificationValidationState | undefined, action: AnyAction): NotificationValidationState => {
  if (!state) {
    state = initialState;
  }

  switch (action.type) {
    case SET_PAGE_VALID: {
      console.log("SET_PAGE_VALID", action.payload);
      return {
        ...state,
        pageValid: action.payload,
      };
    }

    case SET_NOTIFICATION_INPUT_LANGUAGE_VALIDATION: {
      console.log("SET_NOTIFICATION_INPUT_LANGUAGE_VALIDATION", action.payload);
      return {
        ...state,
        notificationValidation: { ...state.notificationValidation, inputLanguage: action.payload },
      };
    }

    case SET_NOTIFICATION_NAME_VALIDATION: {
      console.log("SET_NOTIFICATION_NAME_VALIDATION", action.payload);
      return {
        ...state,
        notificationValidation: { ...state.notificationValidation, name: { ...state.notificationValidation.name, ...action.payload } },
      };
    }

    case SET_NOTIFICATION_SHORT_DESCRIPTION_VALIDATION: {
      console.log("SET_NOTIFICATION_SHORT_DESCRIPTION_VALIDATION", action.payload);
      return {
        ...state,
        notificationValidation: {
          ...state.notificationValidation,
          description: {
            ...state.notificationValidation.description,
            short: { ...state.notificationValidation.description.short, ...action.payload },
          },
        },
      };
    }

    case SET_NOTIFICATION_LONG_DESCRIPTION_VALIDATION: {
      console.log("SET_NOTIFICATION_LONG_DESCRIPTION_VALIDATION", action.payload);
      return {
        ...state,
        notificationValidation: {
          ...state.notificationValidation,
          description: {
            ...state.notificationValidation.description,
            long: { ...state.notificationValidation.description.long, ...action.payload },
          },
        },
      };
    }

    case SET_NOTIFICATION_TAG_VALIDATION: {
      console.log("SET_NOTIFICATION_TAG_VALIDATION", action.payload);
      return {
        ...state,
        notificationValidation: { ...state.notificationValidation, ontology_ids: action.payload },
      };
    }

    case SET_NOTIFICATION_NOTIFIER_VALIDATION: {
      console.log("SET_NOTIFICATION_NOTIFIER_VALIDATION", action.payload);
      return {
        ...state,
        notificationValidation: { ...state.notificationValidation, notifier: { ...state.notificationValidation.notifier, ...action.payload } },
      };
    }

    case SET_NOTIFICATION_ADDRESS_VALIDATION: {
      console.log("SET_NOTIFICATION_ADDRESS_VALIDATION", action.payload);
      const { fi, sv } = state.notificationValidation.address;
      return {
        ...state,
        notificationValidation: {
          ...state.notificationValidation,
          address: {
            ...state.notificationValidation.address,
            [action.payload.language]: { ...(action.payload.language === "sv" ? sv : fi), ...action.payload.validation },
          },
        },
      };
    }

    case SET_NOTIFICATION_WHOLE_ADDRESS_VALIDATION: {
      console.log("SET_NOTIFICATION_WHOLE_ADDRESS_VALIDATION", action.payload);
      return {
        ...state,
        notificationValidation: { ...state.notificationValidation, wholeAddress: action.payload },
      };
    }

    case SET_NOTIFICATION_LOCATION_VALIDATION: {
      console.log("SET_NOTIFICATION_LOCATION_VALIDATION", action.payload);
      return {
        ...state,
        notificationValidation: { ...state.notificationValidation, location: action.payload },
      };
    }

    case SET_NOTIFICATION_CONTACT_VALIDATION: {
      console.log("SET_NOTIFICATION_CONTACT_VALIDATION", action.payload);
      return {
        ...state,
        notificationValidation: {
          ...state.notificationValidation,
          businessid: action.payload.businessid ?? state.notificationValidation.businessid,
          phone: action.payload.phone ?? state.notificationValidation.phone,
          email: action.payload.email ?? state.notificationValidation.email,
        },
      };
    }

    case SET_NOTIFICATION_LINK_VALIDATION: {
      console.log("SET_NOTIFICATION_LINK_VALIDATION", action.payload);
      return {
        ...state,
        notificationValidation: { ...state.notificationValidation, website: { ...state.notificationValidation.website, ...action.payload } },
      };
    }

    case SET_NOTIFICATION_SOCIAL_MEDIA_VALIDATION: {
      console.log("SET_NOTIFICATION_SOCIAL_MEDIA_VALIDATION", action.payload);

      // If index -1 is specified, add the social media item to the array
      // Otherwise combine the field validation with the existing social media item validation in the array
      const socialMediaItems = [
        ...state.notificationValidation.social_media.reduce(
          (acc: SocialMediaValidation[], socialMediaItemValid, index) => [
            ...acc,
            action.payload.index === index ? { ...socialMediaItemValid, ...action.payload.validation } : socialMediaItemValid,
          ],
          []
        ),
        ...(action.payload.index === -1 ? [action.payload.validation] : []),
      ];

      return {
        ...state,
        notificationValidation: { ...state.notificationValidation, social_media: socialMediaItems },
      };
    }

    case REMOVE_NOTIFICATION_SOCIAL_MEDIA_VALIDATION: {
      console.log("REMOVE_NOTIFICATION_SOCIAL_MEDIA_VALIDATION", action.payload);

      // Remove the social media item at the specified index
      const socialMediaItems = state.notificationValidation.social_media.reduce(
        (acc: SocialMediaValidation[], socialMediaValid, index) => (action.payload === index ? acc : [...acc, socialMediaValid]),
        []
      );

      return {
        ...state,
        notificationValidation: { ...state.notificationValidation, social_media: socialMediaItems },
      };
    }

    case SET_NOTIFICATION_PHOTO_VALIDATION: {
      console.log("SET_NOTIFICATION_PHOTO_VALIDATION", action.payload);

      // If index -1 is specified, add the photo to the array
      // Otherwise combine the field validation with the existing photo validation in the array
      const photos = [
        ...state.notificationValidation.photos.reduce(
          (acc: PhotoValidation[], photoValid, index) => [
            ...acc,
            action.payload.index === index ? { ...photoValid, ...action.payload.validation } : photoValid,
          ],
          []
        ),
        ...(action.payload.index === -1 && state.notificationValidation.photos.length < MAX_PHOTOS ? [action.payload.validation] : []),
      ];

      return {
        ...state,
        notificationValidation: { ...state.notificationValidation, photos },
      };
    }

    case SET_NOTIFICATION_PHOTO_ALT_TEXT_VALIDATION: {
      console.log("SET_NOTIFICATION_PHOTO_ALT_TEXT_VALIDATION", action.payload);

      // Combine the field validation with the existing photo alt-text validation in the array
      const photos = [
        ...state.notificationValidation.photos.reduce(
          (acc: PhotoValidation[], photoValid, index) => [
            ...acc,
            action.payload.index === index ? { ...photoValid, altText: { ...photoValid.altText, ...action.payload.validation } } : photoValid,
          ],
          []
        ),
      ];

      return {
        ...state,
        notificationValidation: { ...state.notificationValidation, photos },
      };
    }

    case REMOVE_NOTIFICATION_PHOTO_VALIDATION: {
      console.log("REMOVE_NOTIFICATION_PHOTO_VALIDATION", action.payload);

      // Remove the photo at the specified index
      const photos = state.notificationValidation.photos.reduce(
        (acc: PhotoValidation[], photoValid, index) => (action.payload === index ? acc : [...acc, photoValid]),
        []
      );

      return {
        ...state,
        notificationValidation: { ...state.notificationValidation, photos },
      };
    }

    case SET_NOTIFICATION_TIP_VALIDATION: {
      console.log("SET_NOTIFICATION_TIP_VALIDATION", action.payload);
      return {
        ...state,
        tipValidation: { ...state.tipValidation, ...action.payload },
      };
    }

    case SET_NOTIFICATION_VALIDATION_SUMMARY: {
      console.log("SET_NOTIFICATION_VALIDATION_SUMMARY", action.payload);
      return {
        ...state,
        validationSummary: action.payload,
      };
    }

    case SET_NOTIFICATION_TIP_VALIDATION_SUMMARY: {
      console.log("SET_NOTIFICATION_TIP_VALIDATION_SUMMARY", action.payload);
      return {
        ...state,
        tipValidationSummary: action.payload,
      };
    }

    default: {
      return state;
    }
  }
};

export default notificationValidation;
