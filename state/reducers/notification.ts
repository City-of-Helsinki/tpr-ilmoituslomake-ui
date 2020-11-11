import { AnyAction } from "redux";
import { NotificationState } from "./types";
import { MAX_PAGE, SET_PAGE, SET_USER, SET_NOTIFICATION_DATA, SET_NOTIFICATION_EXTRA, SET_NOTIFICATION_VALIDATION } from "../../types/constants";

const initialState: NotificationState = {
  page: 1,
  notification: {
    organization: {},
    name: {
      fi: "",
    },
    location: [0, 0],
    description: {
      short: {
        fi: "",
      },
      long: {
        fi: "",
      },
    },
    address: {
      fi: {
        street: "",
        postal_code: "",
        post_office: "",
      },
    },
    phone: "",
    email: "",
    website: {
      fi: "",
    },
    images: {},
    opening_times: {},
    price: {
      fi: "",
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
  notificationValidation: {},
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
    case SET_NOTIFICATION_VALIDATION:
      return {
        ...state,
        notificationValidation: action.payload,
      };
    default:
      return state;
  }
};

export default notification;
