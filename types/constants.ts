import { defaultLocale } from "../utils/i18n";

export enum NotifierType {
  Representative = "representative",
  NotRepresentative = "notRepresentative",
}

export enum PhotoSourceType {
  Device = "device",
  Link = "link",
}

export enum PhotoPermission {
  MyHelsinki = "myHelsinki",
  CreativeCommons = "creativeCommons",
}

export enum ModerationStatus {
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

export enum ItemType {
  Unknown = "unknown",
  ChangeRequestChange = "change",
  ChangeRequestAdd = "add",
  ChangeRequestDelete = "delete",
  ModerationTaskCreated = "created",
  ModerationTaskModified = "modified",
}

export enum TaskStatus {
  Unknown = "unknown",
  Open = "open",
  InProgress = "in_progress",
  Closed = "closed",
}

export enum TaskType {
  Unknown = "unknown",
  PlaceChange = "placeChange",
  NewPlace = "newPlace",
  ChangeTip = "changeTip",
  AddTip = "addTip",
  RemoveTip = "removeTip",
  PlaceInfo = "placeInfo",
}

export enum Toast {
  NotAuthenticated = "notAuthenticated",
  ValidationFailed = "validationFailed",
  SaveFailed = "saveFailed",
  SaveSucceeded = "saveSucceeded",
}

export const LANGUAGE_OPTIONS = ["fi", "sv", "en"];
export const MAX_PAGE = 4;
export const SENT_INFO_PAGE = 5;
export const MAX_LENGTH = 100;
export const MAX_LENGTH_SHORT_DESC = 150;
export const MIN_LENGTH_LONG_DESC = 120;
export const MAX_LENGTH_LONG_DESC = 4000;
export const MAX_LENGTH_PHOTO_DESC = 125;
export const MAX_LENGTH_EMAIL = 254;
export const MAX_LENGTH_PHONE = 20;
export const MAX_LENGTH_URL = 2000;
export const MAX_LENGTH_POSTAL_CODE = 5;
export const MAX_PHOTOS = 3;
export const DATETIME_FORMAT = "D.M.YYYY H:mm";
export const TERMS_URL = "https://www.myhelsinki.fi/fi/myhelsinki-places-palvelun-käyttöehdot/";
export const ACCESSIBILITY_URL = "https://www.myhelsinki.fi/fi/saavutettavuusseloste/";
export const CONTACT_URL = "https://hel.fi/helsinki/fi/kaupunki-ja-hallinto/osallistu-ja-vaikuta/ota-yhteytta/ota-yhteytta/";

export const MAP_TILES_URL = "https://tiles.hel.ninja/styles/hel-osm-bright/{z}/{x}/{y}.png";
export const MAP_INITIAL_CENTER = [60.166, 24.942];
export const MAP_INITIAL_ZOOM = 13;
export const MAP_INITIAL_MARKER_ZOOM = 18;
export const MAP_MIN_ZOOM = 10;
export const MAP_MAX_ZOOM = 18;
// export const SEARCH_URL = "https://api.hel.fi/servicemap/v2/search/?format=json";
// export const NEIGHBOURHOOD_URL = "https://api.hel.fi/servicemap/v2/administrative_division/?type=neighborhood";
export const SEARCH_URL = "/helapi/servicemap/v2/search/?format=json";
export const NEIGHBOURHOOD_URL = "/helapi/servicemap/v2/administrative_division/?type=neighborhood";

export const CLEAR_STATE = "CLEAR_STATE";
export const SET_PAGE = "SET_PAGE";
export const SET_PAGE_VALID = "SET_PAGE_VALID";
export const SET_PAGE_STATUS = "SET_PAGE_STATUS";
export const SET_MAP_VIEW = "SET_MAP_VIEW";

export const SET_NOTIFICATION_PLACE_SEARCH = "SET_NOTIFICATION_PLACE_SEARCH";
export const SET_NOTIFICATION_PLACE_RESULTS = "SET_NOTIFICATION_PLACE_RESULTS";
export const SET_NOTIFICATION_INPUT_LANGUAGE = "SET_NOTIFICATION_INPUT_LANGUAGE";
export const SET_NOTIFICATION_NAME = "SET_NOTIFICATION_NAME";
export const SET_NOTIFICATION_SHORT_DESCRIPTION = "SET_NOTIFICATION_SHORT_DESCRIPTION";
export const SET_NOTIFICATION_LONG_DESCRIPTION = "SET_NOTIFICATION_LONG_DESCRIPTION";
export const SET_NOTIFICATION_TAG = "SET_NOTIFICATION_TAG";
export const SET_NOTIFICATION_TAG_OPTIONS = "SET_NOTIFICATION_TAG_OPTIONS";
export const SET_NOTIFICATION_NOTIFIER = "SET_NOTIFICATION_NOTIFIER";
export const SET_NOTIFICATION_ADDRESS = "SET_NOTIFICATION_ADDRESS";
export const SET_NOTIFICATION_ADDRESS_FOUND = "SET_NOTIFICATION_ADDRESS_FOUND";
export const SET_NOTIFICATION_ORIGINAL_LOCATION = "SET_NOTIFICATION_ORIGINAL_LOCATION";
export const SET_NOTIFICATION_LOCATION = "SET_NOTIFICATION_LOCATION";
export const SET_NOTIFICATION_CONTACT = "SET_NOTIFICATION_CONTACT";
export const SET_NOTIFICATION_LINK = "SET_NOTIFICATION_LINK";
export const SET_NOTIFICATION_PHOTO = "SET_NOTIFICATION_PHOTO";
export const REMOVE_NOTIFICATION_PHOTO = "REMOVE_NOTIFICATION_PHOTO";
export const SET_NOTIFICATION_COMMENTS = "SET_NOTIFICATION_COMMENTS";
export const SET_NOTIFICATION_TIP = "SET_NOTIFICATION_TIP";
export const SET_SENT_NOTIFICATION = "SET_SENT_NOTIFICATION";

export const SET_NOTIFICATION_INPUT_LANGUAGE_VALIDATION = "SET_NOTIFICATION_INPUT_LANGUAGE_VALIDATION";
export const SET_NOTIFICATION_NAME_VALIDATION = "SET_NOTIFICATION_NAME_VALIDATION";
export const SET_NOTIFICATION_SHORT_DESCRIPTION_VALIDATION = "SET_NOTIFICATION_SHORT_DESCRIPTION_VALIDATION";
export const SET_NOTIFICATION_LONG_DESCRIPTION_VALIDATION = "SET_NOTIFICATION_LONG_DESCRIPTION_VALIDATION";
export const SET_NOTIFICATION_TAG_VALIDATION = "SET_NOTIFICATION_TAG_VALIDATION";
export const SET_NOTIFICATION_NOTIFIER_VALIDATION = "SET_NOTIFICATION_NOTIFIER_VALIDATION";
export const SET_NOTIFICATION_ADDRESS_VALIDATION = "SET_NOTIFICATION_ADDRESS_VALIDATION";
export const SET_NOTIFICATION_WHOLE_ADDRESS_VALIDATION = "SET_NOTIFICATION_WHOLE_ADDRESS_VALIDATION";
export const SET_NOTIFICATION_LOCATION_VALIDATION = "SET_NOTIFICATION_LOCATION_VALIDATION";
export const SET_NOTIFICATION_CONTACT_VALIDATION = "SET_NOTIFICATION_CONTACT_VALIDATION";
export const SET_NOTIFICATION_LINK_VALIDATION = "SET_NOTIFICATION_LINK_VALIDATION";
export const SET_NOTIFICATION_PHOTO_VALIDATION = "SET_NOTIFICATION_PHOTO_VALIDATION";
export const SET_NOTIFICATION_PHOTO_ALT_TEXT_VALIDATION = "SET_NOTIFICATION_PHOTO_ALT_TEXT_VALIDATION";
export const REMOVE_NOTIFICATION_PHOTO_VALIDATION = "REMOVE_NOTIFICATION_PHOTO_VALIDATION";
export const SET_NOTIFICATION_TIP_VALIDATION = "SET_NOTIFICATION_TIP_VALIDATION";

export const SET_MODERATION_PLACE_SEARCH = "SET_MODERATION_PLACE_SEARCH";
export const CLEAR_MODERATION_PLACE_SEARCH = "CLEAR_MODERATION_PLACE_SEARCH";
export const SET_MODERATION_PLACE_RESULTS = "SET_MODERATION_PLACE_RESULTS";
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
export const SET_MODERATION_PHOTO_ALT_TEXT_STATUS = "SET_MODERATION_PHOTO_ALT_TEXT_STATUS";
export const REMOVE_MODERATION_PHOTO_STATUS = "REMOVE_MODERATION_PHOTO_STATUS";

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
      neighborhood: "",
    },
    sv: {
      street: "",
      postal_code: "",
      post_office: "",
      neighborhood: "",
    },
  },
  phone: "",
  email: "",
  website: {
    fi: "",
    sv: "",
    en: "",
  },
  images: [],
  opening_times: {},
  ontology_ids: [],
  comments: "",
  notifier: {
    notifier_type: "",
    full_name: "",
    email: "",
    phone: "",
  },
};

export const INITIAL_NOTIFICATION_EXTRA = {
  inputLanguages: [defaultLocale],
  photos: [],
  tagOptions: [],
  locationOriginal: [0, 0],
};

export const INITIAL_NOTIFICATION_VALIDATION = {
  inputLanguage: { valid: true },
  name: {
    fi: { valid: true },
    sv: { valid: true },
    en: { valid: true },
  },
  location: { valid: true },
  description: {
    short: {
      fi: { valid: true },
      sv: { valid: true },
      en: { valid: true },
    },
    long: {
      fi: { valid: true },
      sv: { valid: true },
      en: { valid: true },
    },
  },
  address: {
    fi: {
      street: { valid: true },
      postal_code: { valid: true },
      post_office: { valid: true },
    },
    sv: {
      street: { valid: true },
      postal_code: { valid: true },
      post_office: { valid: true },
    },
  },
  wholeAddress: { valid: true },
  phone: { valid: true },
  email: { valid: true },
  website: {
    fi: { valid: true },
    sv: { valid: true },
    en: { valid: true },
  },
  ontology_ids: { valid: true },
  notifier: {
    notifier_type: { valid: true },
    full_name: { valid: true },
    email: { valid: true },
    phone: { valid: true },
  },
  photos: [],
};

export const INITIAL_MODERATION_EXTRA = {
  photosSelected: [],
  photosModified: [],
  tagOptions: [],
  published: false,
  created_at: "",
  updated_at: "",
  taskType: TaskType.Unknown,
  taskStatus: TaskStatus.Unknown,
  userPlaceName: "",
  userComments: "",
  userDetails: "",
  moderator: {
    fullName: "",
    email: "",
  },
};

const getInitialModerationStatus = (moderationStatus: ModerationStatus) => {
  return {
    name: {
      fi: moderationStatus,
      sv: moderationStatus,
      en: moderationStatus,
    },
    location: moderationStatus,
    description: {
      short: {
        fi: moderationStatus,
        sv: moderationStatus,
        en: moderationStatus,
      },
      long: {
        fi: moderationStatus,
        sv: moderationStatus,
        en: moderationStatus,
      },
    },
    address: {
      fi: {
        street: moderationStatus,
        postal_code: moderationStatus,
        post_office: moderationStatus,
        neighborhood: moderationStatus,
      },
      sv: {
        street: moderationStatus,
        postal_code: moderationStatus,
        post_office: moderationStatus,
        neighborhood: moderationStatus,
      },
    },
    phone: moderationStatus,
    email: moderationStatus,
    website: {
      fi: moderationStatus,
      sv: moderationStatus,
      en: moderationStatus,
    },
    ontology_ids: moderationStatus,
    photos: [],
  };
};

export const INITIAL_MODERATION_STATUS = getInitialModerationStatus(ModerationStatus.Unknown);
export const INITIAL_MODERATION_STATUS_EDITED = getInitialModerationStatus(ModerationStatus.Edited);
