import { AnyAction } from "redux";
import { NotificationValidationState } from "./types";
import {
  MAX_PHOTOS,
  SET_PAGE_VALID,
  SET_NOTIFICATION_NAME_VALIDATION,
  SET_NOTIFICATION_SHORT_DESCRIPTION_VALIDATION,
  SET_NOTIFICATION_LONG_DESCRIPTION_VALIDATION,
  SET_NOTIFICATION_TAG_VALIDATION,
  SET_NOTIFICATION_NOTIFIER_VALIDATION,
  SET_NOTIFICATION_ADDRESS_VALIDATION,
  SET_NOTIFICATION_CONTACT_VALIDATION,
  SET_NOTIFICATION_LINK_VALIDATION,
  SET_NOTIFICATION_PHOTO_VALIDATION,
  SET_NOTIFICATION_PHOTO_ALT_TEXT_VALIDATION,
  REMOVE_NOTIFICATION_PHOTO_VALIDATION,
} from "../../types/constants";
import { PhotoValidation } from "../../types/notification_validation";

const initialState: NotificationValidationState = {
  pageValid: true,
  notificationValidation: {
    name: {
      fi: true,
      sv: true,
      en: true,
    },
    description: {
      short: {
        fi: true,
        sv: true,
        en: true,
      },
      long: {
        fi: true,
        sv: true,
        en: true,
      },
    },
    address: {
      fi: {
        street: true,
        postal_code: true,
        post_office: true,
      },
      sv: {
        street: true,
        postal_code: true,
        post_office: true,
      },
    },
    phone: true,
    email: true,
    website: {
      fi: true,
      sv: true,
      en: true,
    },
    ontology_ids: true,
    notifier: {
      notifier_type: true,
      full_name: true,
      email: true,
      phone: true,
    },
    photos: [],
  },
};

const notificationValidation = (state = initialState, action: AnyAction): NotificationValidationState => {
  switch (action.type) {
    case SET_PAGE_VALID: {
      console.log("SET_PAGE_VALID", action.payload);
      return {
        ...state,
        pageValid: action.payload,
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

    case SET_NOTIFICATION_CONTACT_VALIDATION: {
      console.log("SET_NOTIFICATION_CONTACT_VALIDATION", action.payload);
      return {
        ...state,
        notificationValidation: {
          ...state.notificationValidation,
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

    default: {
      return state;
    }
  }
};

export default notificationValidation;
