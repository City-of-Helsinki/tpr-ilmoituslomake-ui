import { defaultLocale } from "../utils/i18n";

export enum PhotoSourceType {
  Device = "device",
  Link = "link",
}

export enum Status {
  Unknown = "unknown",
  Edited = "edited",
  Approved = "approved",
  Rejected = "rejected",
}

export enum TaskCategory {
  Unknown = "unknown",
  ChangeRequest = "change_request",
  ModerationTask = "moderation_task",
}

export enum TaskStatus {
  Unknown = "unknown",
  Open = "open",
  InProgress = "in_progress",
}

export enum TaskType {
  Unknown = "unknown",
  Change = "change",
  New = "new",
  Tip = "tip",
}

export const LANGUAGE_OPTIONS = ["fi", "sv", "en"];
export const MAX_PAGE = 4;
export const MAX_LENGTH_SHORT_DESC = 150;
export const MIN_LENGTH_LONG_DESC = 120;
export const MAX_LENGTH_LONG_DESC = 4000;
export const MAX_LENGTH_PHOTO_DESC = 125;
export const MAX_PHOTOS = 3;

export const MAP_TILES_URL = "https://tiles.hel.ninja/styles/hel-osm-bright/{z}/{x}/{y}.png";
export const MAP_INITIAL_CENTER = [60.166, 24.942];
export const MAP_INITIAL_ZOOM = 13;
export const MAP_MIN_ZOOM = 10;
export const MAP_MAX_ZOOM = 18;
export const SEARCH_URL = "https://api.hel.fi/servicemap/v2/search/?format=json";

export const SET_PAGE = "SET_PAGE";
export const SET_PAGE_VALID = "SET_PAGE_VALID";
export const SET_USER = "SET_USER";
export const SET_MAP_VIEW = "SET_MAP_VIEW";

export const SET_NOTIFICATION_INPUT_LANGUAGE = "SET_NOTIFICATION_INPUT_LANGUAGE";
export const SET_NOTIFICATION_NAME = "SET_NOTIFICATION_NAME";
export const SET_NOTIFICATION_SHORT_DESCRIPTION = "SET_NOTIFICATION_SHORT_DESCRIPTION";
export const SET_NOTIFICATION_LONG_DESCRIPTION = "SET_NOTIFICATION_LONG_DESCRIPTION";
export const SET_NOTIFICATION_TAG = "SET_NOTIFICATION_TAG";
export const SET_NOTIFICATION_TAG_OPTIONS = "SET_NOTIFICATION_TAG_OPTIONS";
export const SET_NOTIFICATION_NOTIFIER = "SET_NOTIFICATION_NOTIFIER";
export const SET_NOTIFICATION_ADDRESS = "SET_NOTIFICATION_ADDRESS";
export const SET_NOTIFICATION_LOCATION = "SET_NOTIFICATION_LOCATION";
export const SET_NOTIFICATION_CONTACT = "SET_NOTIFICATION_CONTACT";
export const SET_NOTIFICATION_LINK = "SET_NOTIFICATION_LINK";
export const SET_NOTIFICATION_PHOTO = "SET_NOTIFICATION_PHOTO";
export const REMOVE_NOTIFICATION_PHOTO = "REMOVE_NOTIFICATION_PHOTO";
export const SET_NOTIFICATION_COMMENTS = "SET_NOTIFICATION_COMMENTS";

export const SET_NOTIFICATION_NAME_VALIDATION = "SET_NOTIFICATION_NAME_VALIDATION";
export const SET_NOTIFICATION_SHORT_DESCRIPTION_VALIDATION = "SET_NOTIFICATION_SHORT_DESCRIPTION_VALIDATION";
export const SET_NOTIFICATION_LONG_DESCRIPTION_VALIDATION = "SET_NOTIFICATION_LONG_DESCRIPTION_VALIDATION";
export const SET_NOTIFICATION_TAG_VALIDATION = "SET_NOTIFICATION_TAG_VALIDATION";
export const SET_NOTIFICATION_NOTIFIER_VALIDATION = "SET_NOTIFICATION_NOTIFIER_VALIDATION";
export const SET_NOTIFICATION_ADDRESS_VALIDATION = "SET_NOTIFICATION_ADDRESS_VALIDATION";
export const SET_NOTIFICATION_CONTACT_VALIDATION = "SET_NOTIFICATION_CONTACT_VALIDATION";
export const SET_NOTIFICATION_LINK_VALIDATION = "SET_NOTIFICATION_LINK_VALIDATION";
export const SET_NOTIFICATION_PHOTO_VALIDATION = "SET_NOTIFICATION_PHOTO_VALIDATION";
export const SET_NOTIFICATION_PHOTO_DESCRIPTION_VALIDATION = "SET_NOTIFICATION_PHOTO_DESCRIPTION_VALIDATION";
export const REMOVE_NOTIFICATION_PHOTO_VALIDATION = "REMOVE_NOTIFICATION_PHOTO_VALIDATION";

export const SET_MODERATION_PLACE_SEARCH = "SET_MODERATION_PLACE_SEARCH";
export const CLEAR_MODERATION_PLACE_SEARCH = "CLEAR_MODERATION_PLACE_SEARCH";
export const SET_MODERATION_TASK_SEARCH = "SET_MODERATION_TASK_SEARCH";
export const SET_MODERATION_TASK_RESULTS = "SET_MODERATION_TASK_RESULTS";
export const SET_MODERATION_NAME = "SET_MODERATION_NAME";
export const SET_MODERATION_SHORT_DESCRIPTION = "SET_MODERATION_SHORT_DESCRIPTION";
export const SET_MODERATION_LONG_DESCRIPTION = "SET_MODERATION_LONG_DESCRIPTION";
export const SET_MODERATION_TAG = "SET_MODERATION_TAG";
export const SET_MODERATION_TAG_OPTIONS = "SET_MODERATION_TAG_OPTIONS";
export const SET_MODERATION_ADDRESS = "SET_MODERATION_ADDRESS";
export const SET_MODERATION_LOCATION = "SET_MODERATION_LOCATION";
export const SET_MODERATION_CONTACT = "SET_MODERATION_CONTACT";
export const SET_MODERATION_LINK = "SET_MODERATION_LINK";
export const SET_MODERATION_PHOTO = "SET_MODERATION_PHOTO";
export const REMOVE_MODERATION_PHOTO = "REMOVE_MODERATION_PHOTO";

export const SET_MODERATION_NAME_STATUS = "SET_MODERATION_NAME_STATUS";
export const SET_MODERATION_SHORT_DESCRIPTION_STATUS = "SET_MODERATION_SHORT_DESCRIPTION_STATUS";
export const SET_MODERATION_LONG_DESCRIPTION_STATUS = "SET_MODERATION_LONG_DESCRIPTION_STATUS";
export const SET_MODERATION_TAG_STATUS = "SET_MODERATION_TAG_STATUS";
export const SET_MODERATION_ADDRESS_STATUS = "SET_MODERATION_ADDRESS_STATUS";
export const SET_MODERATION_LOCATION_STATUS = "SET_MODERATION_LOCATION_STATUS";
export const SET_MODERATION_CONTACT_STATUS = "SET_MODERATION_CONTACT_STATUS";
export const SET_MODERATION_LINK_STATUS = "SET_MODERATION_LINK_STATUS";
export const SET_MODERATION_PHOTO_STATUS = "SET_MODERATION_PHOTO_STATUS";

export const INITIAL_NOTIFICATION = {
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
};

export const INITIAL_NOTIFICATION_EXTRA = {
  inputLanguages: [defaultLocale],
  notifier: {
    fullName: "",
    email: "",
    phone: "",
  },
  photos: [],
  tagOptions: [],
};

export const INITIAL_MODERATION_EXTRA = {
  photos: [],
  tagOptions: [],
  taskType: TaskType.Unknown,
  status: TaskStatus.Unknown,
  moderator: {
    fullName: "",
    email: "",
  },
};
