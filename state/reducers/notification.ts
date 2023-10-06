import type { AnyAction } from "redux";
import { LatLngExpression } from "leaflet";
import { NotificationState } from "./types";
import {
  ItemType,
  // MAX_PAGE,
  MAX_PHOTOS,
  MAP_INITIAL_CENTER,
  MAP_INITIAL_ZOOM,
  SET_PAGE,
  SET_MAP_VIEW,
  SET_NOTIFICATION_PLACE_SEARCH,
  SET_NOTIFICATION_PLACE_RESULTS,
  SET_NOTIFICATION_TIP,
  SET_NOTIFICATION_INPUT_LANGUAGE,
  SET_NOTIFICATION_NAME,
  SET_NOTIFICATION_SHORT_DESCRIPTION,
  SET_NOTIFICATION_LONG_DESCRIPTION,
  SET_NOTIFICATION_TAG,
  SET_NOTIFICATION_TAG_OPTIONS,
  SET_NOTIFICATION_EXTRA_KEYWORDS,
  SET_NOTIFICATION_NOTIFIER,
  SET_NOTIFICATION_ADDRESS,
  SET_NOTIFICATION_ADDRESS_FOUND,
  SET_NOTIFICATION_ORIGINAL_LOCATION,
  SET_NOTIFICATION_LOCATION,
  SET_NOTIFICATION_CONTACT,
  SET_NOTIFICATION_LINK,
  SET_NOTIFICATION_PHOTO,
  REMOVE_NOTIFICATION_PHOTO,
  SET_NOTIFICATION_COMMENTS,
  SET_NOTIFICATION_SENDING,
  SET_SENT_NOTIFICATION,
} from "../../types/constants";
import { Photo } from "../../types/general";
import { INITIAL_NOTIFICATION, INITIAL_NOTIFICATION_EXTRA } from "../../types/initial";

const initialState: NotificationState = {
  page: 1,
  center: MAP_INITIAL_CENTER as LatLngExpression,
  zoom: MAP_INITIAL_ZOOM,
  placeSearch: {
    placeName: "",
    ownPlacesOnly: false,
    searchDone: false,
  },
  placeResults: {
    results: [],
    count: 0,
  },
  tip: {
    target: 0,
    item_type: ItemType.ChangeRequestAdd,
    user_place_name: "",
    user_comments: "",
    user_details: "",
  },
  notificationId: 0,
  notification: { ...INITIAL_NOTIFICATION, location: [0, 0] },
  notificationExtra: { ...INITIAL_NOTIFICATION_EXTRA, locationOriginal: [0, 0] },
  isSending: {
    notification: false,
    tip: false,
  },
};

const notification = (state: NotificationState | undefined, action: AnyAction): NotificationState => {
  if (!state) {
    state = initialState;
  }

  switch (action.type) {
    case SET_PAGE: {
      console.log("SET_PAGE", action.payload);
      return {
        ...state,
        // page: Math.min(Math.max(action.payload, 1), MAX_PAGE),
        page: action.payload,
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

    case SET_NOTIFICATION_PLACE_SEARCH: {
      console.log("SET_NOTIFICATION_PLACE_SEARCH", action.payload);
      return {
        ...state,
        placeSearch: action.payload,
      };
    }

    case SET_NOTIFICATION_PLACE_RESULTS: {
      console.log("SET_NOTIFICATION_PLACE_RESULTS", action.payload);
      return {
        ...state,
        placeResults: action.payload,
      };
    }

    case SET_NOTIFICATION_TIP: {
      console.log("SET_NOTIFICATION_TIP", action.payload);
      return {
        ...state,
        tip: action.payload,
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

    case SET_NOTIFICATION_TAG_OPTIONS: {
      console.log("SET_NOTIFICATION_TAG_OPTIONS", action.payload);
      return {
        ...state,
        notificationExtra: { ...state.notificationExtra, tagOptions: action.payload },
      };
    }

    case SET_NOTIFICATION_EXTRA_KEYWORDS: {
      console.log("SET_NOTIFICATION_EXTRA_KEYWORDS", action.payload);
      return {
        ...state,
        notification: {
          ...state.notification,
          extra_keywords: {
            ...state.notification.extra_keywords,
            [action.payload.language]: action.payload.value
              .split(",")
              .map((extra: string) => extra.trim())
              .filter((extra: string) => extra.length > 0),
          },
        },
        notificationExtra: {
          ...state.notificationExtra,
          extraKeywordsText: {
            ...state.notificationExtra.extraKeywordsText,
            [action.payload.language]: action.payload.value,
          },
        },
      };
    }

    case SET_NOTIFICATION_NOTIFIER: {
      console.log("SET_NOTIFICATION_NOTIFIER", action.payload);
      return {
        ...state,
        notification: { ...state.notification, notifier: { ...state.notification.notifier, ...action.payload } },
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

    case SET_NOTIFICATION_ADDRESS_FOUND: {
      console.log("SET_NOTIFICATION_ADDRESS_FOUND", action.payload);
      return {
        ...state,
        notificationExtra: { ...state.notificationExtra, addressFound: action.payload },
      };
    }

    case SET_NOTIFICATION_ORIGINAL_LOCATION: {
      console.log("SET_NOTIFICATION_ORIGINAL_LOCATION", action.payload);
      return {
        ...state,
        notificationExtra: { ...state.notificationExtra, locationOriginal: action.payload },
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
          businessid: action.payload.businessid ?? state.notification.businessid,
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
        ...state.notificationExtra.photos.reduce(
          (acc: Photo[], photo, index) => [...acc, action.payload.index === index ? { ...photo, ...action.payload.value } : photo],
          []
        ),
        ...(action.payload.index === -1 && state.notificationExtra.photos.length < MAX_PHOTOS ? [action.payload.value] : []),
      ];

      return {
        ...state,
        notificationExtra: { ...state.notificationExtra, photos },
      };
    }

    case REMOVE_NOTIFICATION_PHOTO: {
      console.log("REMOVE_NOTIFICATION_PHOTO", action.payload);

      // Remove the photo at the specified index
      const photos = state.notificationExtra.photos.reduce((acc: Photo[], photo, index) => (action.payload === index ? acc : [...acc, photo]), []);

      return {
        ...state,
        notificationExtra: { ...state.notificationExtra, photos },
      };
    }

    case SET_NOTIFICATION_COMMENTS: {
      console.log("SET_NOTIFICATION_COMMENTS", action.payload);
      return {
        ...state,
        notification: { ...state.notification, comments: action.payload },
      };
    }

    case SET_NOTIFICATION_SENDING: {
      console.log("SET_NOTIFICATION_SENDING", action.payload);
      const [key, sending] = Object.entries(action.payload)[0];
      return {
        ...state,
        isSending: { ...state.isSending, [key]: sending },
      };
    }

    case SET_SENT_NOTIFICATION: {
      console.log("SET_SENT_NOTIFICATION", action.payload);
      return {
        ...state,
        notificationId: action.payload.notificationId,
        notification: action.payload.notification,
        notificationExtra: action.payload.notificationExtra,
      };
    }

    default: {
      return state;
    }
  }
};

export default notification;
