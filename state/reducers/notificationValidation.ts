import { AnyAction } from "redux";
import { NotificationValidationState } from "./types";
import {
  SET_PAGE_VALID,
  SET_NOTIFICATION_NAME_VALIDATION,
  SET_NOTIFICATION_SHORT_DESCRIPTION_VALIDATION,
  SET_NOTIFICATION_LONG_DESCRIPTION_VALIDATION,
  SET_NOTIFICATION_TAG_VALIDATION,
  SET_NOTIFICATION_NOTIFIER_VALIDATION,
  SET_NOTIFICATION_ADDRESS_VALIDATION,
  SET_NOTIFICATION_PHOTO_VALIDATION,
} from "../../types/constants";

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
    ontology_ids: true,
    notifier: {
      fullName: true,
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

    case SET_NOTIFICATION_PHOTO_VALIDATION: {
      console.log("SET_NOTIFICATION_PHOTO_VALIDATION", action.payload);
      return {
        ...state,
        notificationValidation: { ...state.notificationValidation, photos: action.payload },
      };
    }

    default: {
      return state;
    }
  }
};

export default notificationValidation;
