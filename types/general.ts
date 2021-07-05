import { ModerationStatus, TaskStatus, TaskType } from "./constants";
import { NotificationSchema } from "./notification_schema";
import { TranslationSchema } from "./translation_schema";

export interface User {
  authenticated: boolean;
  username: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_translator: boolean;
  email: string;
}

export interface KeyValueString {
  [key: string]: string;
}

export interface KeyValueBoolean {
  [key: string]: boolean;
}

export interface Validation {
  valid: boolean;
  message?: string;
}

export interface KeyValueValidation {
  [key: string]: Validation;
}

export interface KeyValueStatus {
  [key: string]: ModerationStatus;
}

export type OptionType = {
  id: string | number;
  label: string;
};

export interface PhotoSchema {
  uuid: string;
  source_type: string;
  url: string;
  alt_text: {
    fi: string;
    sv: string;
    en: string;
    [key: string]: unknown;
  };
  permission: string;
  source: string;
  [key: string]: unknown;
}

export interface Photo {
  uuid: string;
  sourceType: string;
  url: string;
  altText: {
    fi: string;
    sv: string;
    en: string;
    [key: string]: unknown;
  };
  permission?: string;
  source: string;
  new?: boolean;
  base64?: string;
  preview?: string;
  [key: string]: unknown;
}

export interface TagOption {
  id: number;
  ontologyword: {
    fi: string;
    sv: string;
    en: string;
    [key: string]: unknown;
  };
}

export interface MatkoTagOption {
  id: number;
  matkoword: {
    fi: string;
    sv: string;
    en: string;
    [key: string]: unknown;
  };
}

export interface AddressSearchResult {
  street: string;
  postalCode: string;
  postOffice: string;
}

export interface NotificationExtra {
  inputLanguages: string[];
  photos: Photo[];
  tagOptions: TagOption[];
  extraKeywordsText: string;
  locationOriginal: [number, number];
  addressFound?: AddressSearchResult;
}

export interface NotificationPlaceSearch {
  placeName: string;
  ownPlacesOnly: boolean;
  searchDone: boolean;
}

export interface NotificationPlaceResult {
  id: number;
  data: NotificationSchema;
  is_notifier: boolean;
  updated_at: string;
}

export interface NotificationPlaceResults {
  results: NotificationPlaceResult[];
  count: number;
  next?: string;
}

export interface TranslationTaskSearch {
  placeName: string;
  request: string;
  requestOptions: OptionType[];
  taskStatus: string;
  groupByRequest: boolean;
  searchDone: boolean;
}

export interface TranslationTaskResult {
  id: number;
  request: string;
  target: {
    id: number;
    name: {
      fi: string;
      sv: string;
      en: string;
    };
  };
  category: string;
  item_type: string;
  status: string;
  moderator: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
  created_at: string;
  updated_at: string;
  created: Date;
  updated: Date;
  taskType: TaskType;
  taskStatus: TaskStatus;
}

export interface TranslationTaskResults {
  results: TranslationTaskResult[];
  count: number;
  next?: string;
}

export interface ChangeRequestSchema {
  target: number;
  item_type: string;
  user_place_name: string;
  user_comments: string;
  user_details: string;
  [key: string]: string | number;
}

export interface ChangeRequestValidationSchema {
  target: Validation;
  item_type: Validation;
  user_place_name: Validation;
  user_comments: Validation;
  user_details: Validation;
}

export interface ModerationPlaceSearch {
  placeName: string;
  language: string;
  address: string;
  district: string;
  ontologyIds: number[];
  matkoIds: number[];
  comment: string;
  publishPermission?: string;
  searchDone: boolean;
}

export interface ModerationPlaceResult {
  id: number;
  user: User;
  data: NotificationSchema;
  published: boolean;
  created_at: string;
  updated_at: string;
  updated: Date;
}

export interface ModerationPlaceResults {
  results: ModerationPlaceResult[];
  count: number;
  next?: string;
}

export interface ModerationTaskSearch {
  placeName: string;
  taskType: TaskType;
  searchDone: boolean;
}

export interface ModerationTodoResult {
  id: number;
  target: {
    id: number;
    name: {
      fi: string;
      sv: string;
      en: string;
    };
  };
  notification_target: {
    id: number;
    name: {
      fi: string;
      sv: string;
      en: string;
    };
  };
  category: string;
  item_type: string;
  status: string;
  moderator: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
  user_place_name: string;
  created_at: string;
  updated_at: string;
  created: Date;
  updated: Date;
  taskType: TaskType;
  taskStatus: TaskStatus;
}

export interface ModerationTodoResults {
  results: ModerationTodoResult[];
  count: number;
  next?: string;
}

export interface ModerationTodoSchema {
  id: number;
  target: {
    id: number;
    data: NotificationSchema;
    user: User;
    created_at: string;
    updated_at: string;
  };
  notification_target: {
    id: number;
    data: NotificationSchema;
  };
  category: string;
  item_type: string;
  status: string;
  data: NotificationSchema;
  user_place_name: string;
  user_comments: string;
  user_details: string;
  moderator: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
  created_at: string;
  updated_at: string;
  created: Date;
  updated: Date;
  taskType: TaskType;
  taskStatus: TaskStatus;
}

export interface ModerationExtra {
  photosUuids: string[];
  photosSelected: Photo[];
  photosModified: Photo[];
  tagOptions: TagOption[];
  matkoTagOptions: MatkoTagOption[];
  extraKeywordsTextSelected: string;
  extraKeywordsTextModified: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  taskType: TaskType;
  taskStatus: TaskStatus;
  userPlaceName: string;
  userComments: string;
  userDetails: string;
  moderator: {
    fullName: string;
    email: string;
  };
  lastUpdated: {
    fullName: string;
    updated_at: string;
  };
}
