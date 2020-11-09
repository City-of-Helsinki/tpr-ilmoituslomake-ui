import { AnyAction } from "redux";
import { NotificationState } from "./types";
import { MAX_PAGE, SET_PAGE, SET_USER, SET_NOTIFICATION_DATA, SET_NOTIFICATION_EXTRA } from "../../types/constants";

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
    notifier: {
      fullName: "",
      email: "",
      phone: "",
    },
  },
};

const notification = (state = initialState, action: AnyAction): NotificationState => {
  switch (action.type) {
    case SET_PAGE:
      return {
        ...state,
        page: Math.min(Math.max(action.payload, 1), MAX_PAGE),
      };
    case SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    case SET_NOTIFICATION_DATA:
      return {
        ...state,
        notification: action.payload,
      };
    case SET_NOTIFICATION_EXTRA:
      return {
        ...state,
        notificationExtra: action.payload,
      };
    default:
      return state;
  }
};

export default notification;
