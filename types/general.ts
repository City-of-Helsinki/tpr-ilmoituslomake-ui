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
  uuid: string;
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
  changed?: boolean;
  fieldLabel?: string; // Only used for validation summary
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
  media_id: string;
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
  mediaId: string;
  new?: boolean;
  base64?: string;
  preview?: string;
  [key: string]: unknown;
}

export interface PhotoTranslation {
  uuid: string;
  altText: {
    lang: string;
    [key: string]: unknown;
  };
  source: string;
  [key: string]: unknown;
}

export interface SocialMedia {
  uuid: string;
  title: string;
  link: string;
  new?: boolean;
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
  extraKeywordsText: {
    fi: string;
    sv: string;
    en: string;
    [key: string]: unknown;
  };
  locationOriginal: [number, number];
  addressOriginal: {
    fi: {
      street: string;
      postal_code: string;
      post_office: string;
    };
    sv: {
      street: string;
      postal_code: string;
      post_office: string;
    };
  };
  addressFound?: AddressSearchResult;
  openingTimesId: number;
  openingTimesNotificationId: number;
  isNew: boolean;
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

export interface NotificationTargetIdName {
  id: number;
  name: {
    fi: string;
    sv: string;
    en: string;
  };
}

export interface OpeningTimeResult {
  date_periods_as_text: {
    fi: string;
    sv: string;
    en: string;
    [key: string]: string;
  };
  resource: {
    id: number;
  };
}

export interface OpeningTimeResults {
  results: OpeningTimeResult[];
  count: number;
  next?: string;
}

export interface TranslationTaskSearch {
  placeName: string;
  request: string;
  searchDone: boolean;
}

export interface TranslationRequestResultTask {
  id: number;
  target: NotificationTargetIdName;
  taskType: TaskType;
  taskStatus: TaskStatus;
}

export interface TranslationRequestResult {
  id: number;
  request: string;
  formattedRequest: string;
  language: {
    from: string;
    to: string;
  };
  tasks: TranslationRequestResultTask[];
  translator: User;
  moderator: User;
  updated_at: string;
  updated: Date;
}

export interface TranslationTodoResult {
  id: number;
  requestId: number;
  request: string;
  language: {
    from: string;
    to: string;
  };
  message: string;
  target: NotificationTargetIdName;
  category: string;
  item_type: string;
  status: string;
  translator: User;
  moderator: User;
  created_at: string;
  updated_at: string;
  created: Date;
  updated: Date;
  taskType: TaskType;
  taskStatus: TaskStatus;
  formattedRequest: string;
}

export interface TranslationTodoResults {
  results: TranslationTodoResult[];
  count: number;
  next?: string;
}

export interface TranslationTodoSchema {
  id: number;
  requestId: number;
  request: string;
  language: {
    from: string;
    to: string;
  };
  message: string;
  target: {
    id: number;
    data: NotificationSchema;
    created_at: string;
    updated_at: string;
  };
  category: string;
  item_type: string;
  status: string;
  data: TranslationSchema;
  translator: User;
  moderator: User;
  created_at: string;
  updated_at: string;
  created: Date;
  updated: Date;
  taskType: TaskType;
  taskStatus: TaskStatus;
  formattedRequest: string;
}

export interface TranslationExtra {
  photosSelected: Photo[];
  photosTranslated: PhotoTranslation[];
  translationRequest: {
    requestId: number;
    request: string;
    formattedRequest: string;
    language: {
      from: string;
      to: string;
    };
    message: string;
    translator: {
      fullName: string;
      email: string;
    };
    moderator: {
      fullName: string;
      email: string;
    };
  };
  translationTask: {
    created_at: string;
    updated_at: string;
    taskType: TaskType;
    taskStatus: TaskStatus;
  };
}

export interface TranslationTaskPhotoValidation {
  altText: Validation;
  source: Validation;
}

export interface TranslationTaskValidation {
  name: Validation;
  descriptionShort: Validation;
  descriptionLong: Validation;
  photos: TranslationTaskPhotoValidation[];
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
  target: NotificationTargetIdName;
  notification_target: NotificationTargetIdName;
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
    published: boolean;
    data: NotificationSchema;
    user: User;
    created_at: string;
    updated_at: string;
  };
  notification_target: {
    id: number;
    data: NotificationSchema;
    hauki_id: number;
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
  extraKeywordsTextSelected: {
    fi: string;
    sv: string;
    en: string;
    [key: string]: unknown;
  };
  extraKeywordsTextModified: {
    fi: string;
    sv: string;
    en: string;
    [key: string]: unknown;
  };
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
  addressFound?: AddressSearchResult;
  openingTimesId: number;
  openingTimesNotificationId: number;
  socialMediaUuids: string[];
}

export interface ModerationTranslationRequestTaskSearch {
  placeName: string;
  request: string;
  searchDone: boolean;
}

export interface ModerationTranslationRequestResult {
  id: number;
  request: string;
  language: {
    from: string;
    to: string;
  };
  message: string;
  tasks: {
    id: number;
    target: NotificationTargetIdName;
    status: string;
    taskStatus: TaskStatus;
  }[];
  category: string;
  item_type: string;
  translator: User;
  moderator: User;
  created_at: string;
  updated_at: string;
  created: Date;
  updated: Date;
  taskType: TaskType;
  formattedRequest: string;
}

export interface ModerationTranslationRequestResults {
  results: ModerationTranslationRequestResult[];
  count: number;
  next?: string;
}

export interface ModerationTranslationTaskResult {
  id: number;
  requestId: number;
  request: string;
  language: {
    from: string;
    to: string;
  };
  message: string;
  target: NotificationTargetIdName;
  category: string;
  item_type: string;
  status: string;
  translator: User;
  moderator: User;
  created_at: string;
  updated_at: string;
  created: Date;
  updated: Date;
  taskType: TaskType;
  taskStatus: TaskStatus;
  formattedRequest: string;
}

export interface ModerationTranslationTaskResults {
  results: ModerationTranslationTaskResult[];
  count: number;
  next?: string;
}

export interface ModerationTranslationSelectedItems {
  selectedIds: string[];
  isAllSelected: boolean;
}

export interface ModerationTranslationRequestResultTask {
  id: number;
  target: NotificationTargetIdName;
  status: string;
  taskStatus: TaskStatus;
}

export interface ModerationTranslationRequest {
  id: number;
  request: string;
  tasks: ModerationTranslationRequestResultTask[];
  language: {
    from: string;
    to: string;
  };
  message: string;
  translator: string;
  taskType: TaskType;
  [key: string]: unknown;
}

export interface ModerationTranslationRequestValidation {
  tasks: Validation;
  translator: Validation;
  language: Validation;
  message: Validation;
}
