import { AnyAction } from "redux";
import { NotificationState } from "./types";
import { MAX_PAGE, SET_PAGE, SET_USER, SET_NOTIFICATION_DATA, SET_NOTIFICATION_EXTRA } from "../../types/constants";
import { defaultLocale } from "../../utils/i18n";

const initialState: NotificationState = {
  page: 1,
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

    case SET_NOTIFICATION_DATA: {
      console.log("SET_NOTIFICATION_DATA", action.payload);
      return {
        ...state,
        notification: action.payload,
      };
    }

    case SET_NOTIFICATION_EXTRA: {
      console.log("SET_NOTIFICATION_EXTRA", action.payload);
      return {
        ...state,
        notificationExtra: action.payload,
      };
    }

    default: {
      return state;
    }
  }
};

export default notification;
