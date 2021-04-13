import { ModerationStatus, TaskStatus, TaskType } from "./constants";
import { NotificationSchema } from "./notification_schema";

export interface User {
  authenticated: boolean;
  username: string;
  first_name: string;
  last_name: string;
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

export interface NotificationExtra {
  inputLanguages: string[];
  photos: Photo[];
  tagOptions: TagOption[];
  locationOriginal: [number, number];
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
  tag: string;
  comment: string;
  publishPermission: string[];
}

export interface TaskSearch {
  placeName: string;
  taskType: TaskType;
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

export interface ModerationTodoSchema {
  id: number;
  target: {
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
  photosSelected: Photo[];
  photosModified: Photo[];
  tagOptions: TagOption[];
  created_at: string;
  updated_at: string;
  taskType: TaskType;
  status: TaskStatus;
  userPlaceName: string;
  userComments: string;
  userDetails: string;
  moderator: {
    fullName: string;
    email: string;
  };
}
