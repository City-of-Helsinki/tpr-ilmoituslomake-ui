import { AnyAction } from "redux";
import { LatLngExpression } from "leaflet";
import { NotificationState } from "./types";
import {
  MAX_PAGE,
  MAP_INITIAL_ZOOM,
  SET_PAGE,
  SET_USER,
  SET_MAP_VIEW,
  SET_NOTIFICATION_INPUT_LANGUAGE,
  SET_NOTIFICATION_NAME,
  SET_NOTIFICATION_SHORT_DESCRIPTION,
  SET_NOTIFICATION_LONG_DESCRIPTION,
  SET_NOTIFICATION_TAG,
  SET_NOTIFICATION_NOTIFIER,
  SET_NOTIFICATION_ADDRESS,
  SET_NOTIFICATION_LOCATION,
  SET_NOTIFICATION_CONTACT,
  SET_NOTIFICATION_LINK,
  SET_NOTIFICATION_PHOTO,
  REMOVE_NOTIFICATION_PHOTO,
  SET_NOTIFICATION_PRICE,
  SET_NOTIFICATION_PAYMENT,
  SET_NOTIFICATION_COMMENTS,
  MAP_INITIAL_CENTER,
} from "../../types/constants";
import { Photo } from "../../types/general";
import { defaultLocale } from "../../utils/i18n";

const initialState: NotificationState = {
  page: 1,
  center: MAP_INITIAL_CENTER as LatLngExpression,
  zoom: MAP_INITIAL_ZOOM,
  notification: {
    organization: {},
    name: {
      fi: "",
      sv: "",
      en: "",
    },
    location: [0, 0],
    description: {
      short: {
        fi: "",
        sv: "",
        en: "",
      },
      long: {
        fi: "",
        sv: "",
        en: "",
      },
    },
    address: {
      fi: {
        street: "",
        postal_code: "",
        post_office: "",
      },
      sv: {
        street: "",
        postal_code: "",
        post_office: "",
      },
    },
    phone: "",
    email: "",
    website: {
      fi: "",
      sv: "",
      en: "",
    },
    images: {},
    opening_times: {},
    price: {
      fi: "",
      sv: "",
      en: "",
    },
    payment_options: [],
    ontology_ids: [],
    comments: "",
  },
  notificationExtra: {
    inputLanguages: [defaultLocale],
    notifier: {
      fullName: "",
      email: "",
      phone: "",
    },
    photos: [],
  },
};

const notification = (state = initialState, action: AnyAction): NotificationState => {
  switch (action.type) {
    case SET_PAGE: {
      console.log("SET_PAGE", action.payload);
      return {
        ...state,
        page: Math.min(Math.max(action.payload, 1), MAX_PAGE),
      };
    }

    case SET_USER: {
      console.log("SET_USER", action.payload);
      return {
        ...state,
        user: action.payload,
        // Also update the notifier values with the login user details if not already set
        notificationExtra: {
          ...state.notificationExtra,
          notifier: {
            ...state.notificationExtra.notifier,
            fullName: state.notificationExtra.notifier.fullName || `${action.payload.first_name} ${action.payload.last_name}`.trim(),
            email: state.notificationExtra.notifier.email || action.payload.email,
          },
        },
      };
    }

    case SET_MAP_VIEW: {
      console.log("SET_MAP_VIEW", action.payload);
      return {
        ...state,
        center: action.payload.center ?? state.notification.center,
        zoom: action.payload.zoom ?? state.notification.zoom,
      };
    }

    case SET_NOTIFICATION_INPUT_LANGUAGE: {
      console.log("SET_NOTIFICATION_INPUT_LANGUAGE", action.payload);
      const [key, checked] = Object.entries(action.payload)[0];
      return {
        ...state,
        notificationExtra: {
          ...state.notificationExtra,
          inputLanguages: [...state.notificationExtra.inputLanguages.filter((o) => o !== key), ...(checked ? [key] : [])],
        },
      };
    }

    case SET_NOTIFICATION_NAME: {
      console.log("SET_NOTIFICATION_NAME", action.payload);
      return {
        ...state,
        notification: { ...state.notification, name: { ...state.notification.name, ...action.payload } },
      };
    }

    case SET_NOTIFICATION_SHORT_DESCRIPTION: {
      console.log("SET_NOTIFICATION_SHORT_DESCRIPTION", action.payload);
      return {
        ...state,
        notification: {
          ...state.notification,
          description: {
            ...state.notification.description,
            short: { ...state.notification.description.short, ...action.payload },
          },
        },
      };
    }

    case SET_NOTIFICATION_LONG_DESCRIPTION: {
      console.log("SET_NOTIFICATION_LONG_DESCRIPTION", action.payload);
      return {
        ...state,
        notification: {
          ...state.notification,
          description: {
            ...state.notification.description,
            long: { ...state.notification.description.long, ...action.payload },
          },
        },
      };
    }

    case SET_NOTIFICATION_TAG: {
      console.log("SET_NOTIFICATION_TAG", action.payload);
      return {
        ...state,
        notification: { ...state.notification, ontology_ids: action.payload },
      };
    }

    case SET_NOTIFICATION_NOTIFIER: {
      console.log("SET_NOTIFICATION_NOTIFIER", action.payload);
      return {
        ...state,
        notificationExtra: { ...state.notificationExtra, notifier: { ...state.notificationExtra.notifier, ...action.payload } },
      };
    }

    case SET_NOTIFICATION_ADDRESS: {
      console.log("SET_NOTIFICATION_ADDRESS", action.payload);
      const { fi, sv } = state.notification.address;
      return {
        ...state,
        notification: {
          ...state.notification,
          address: {
            ...state.notification.address,
            [action.payload.language]: { ...(action.payload.language === "sv" ? sv : fi), ...action.payload.value },
          },
        },
      };
    }

    case SET_NOTIFICATION_LOCATION: {
      console.log("SET_NOTIFICATION_LOCATION", action.payload);
      return {
        ...state,
        notification: { ...state.notification, location: action.payload },
      };
    }

    case SET_NOTIFICATION_CONTACT: {
      console.log("SET_NOTIFICATION_CONTACT", action.payload);
      return {
        ...state,
        notification: {
          ...state.notification,
          phone: action.payload.phone ?? state.notification.phone,
          email: action.payload.email ?? state.notification.email,
        },
      };
    }

    case SET_NOTIFICATION_LINK: {
      console.log("SET_NOTIFICATION_LINK", action.payload);
      return {
        ...state,
        notification: { ...state.notification, website: { ...state.notification.website, ...action.payload } },
      };
    }

    case SET_NOTIFICATION_PHOTO: {
      console.log("SET_NOTIFICATION_PHOTO", action.payload);

      // If index -1 is specified, add the photo to the array
      // Otherwise combine the field value with the existing photo in the array
      const photos = [
        ...state.notificationExtra.photos.reduce((acc: Photo[], photo, index) => {
          return [...acc, action.payload.index === index ? { ...photo, ...action.payload.value } : photo];
        }, []),
        ...(action.payload.index === -1 ? [action.payload.value] : []),
      ];

      return {
        ...state,
        notificationExtra: { ...state.notificationExtra, photos },
      };
    }

    case REMOVE_NOTIFICATION_PHOTO: {
      console.log("REMOVE_NOTIFICATION_PHOTO", action.payload);

      // Remove the photo at the specified index
      const photos = state.notificationExtra.photos.reduce((acc: Photo[], photo, index) => {
        return action.payload === index ? acc : [...acc, photo];
      }, []);

      return {
        ...state,
        notificationExtra: { ...state.notificationExtra, photos },
      };
    }

    case SET_NOTIFICATION_PRICE: {
      console.log("SET_NOTIFICATION_PRICE", action.payload);
      return {
        ...state,
        notification: { ...state.notification, price: { ...state.notification.price, ...action.payload } },
      };
    }

    case SET_NOTIFICATION_PAYMENT: {
      console.log("SET_NOTIFICATION_PAYMENT", action.payload);
      const [key, checked] = Object.entries(action.payload)[0];
      return {
        ...state,
        notification: {
          ...state.notification,
          payment_options: [...state.notification.payment_options.filter((o) => o.name !== key), ...(checked ? [{ name: key }] : [])],
        },
      };
    }

    case SET_NOTIFICATION_COMMENTS: {
      console.log("SET_NOTIFICATION_COMMENTS", action.payload);
      return {
        ...state,
        notification: { ...state.notification, comments: action.payload },
      };
    }

    default: {
      return state;
    }
  }
};

export default notification;
