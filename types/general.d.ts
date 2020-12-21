import { Status, TaskStatus, TaskType } from "./constants";

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
  [key: string]: Status;
}

export type OptionType = {
  id: string | number;
  label: string;
};

export interface Photo {
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
}

export interface PlaceSearch {
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
  taskType: TaskCategory;
}

export interface ModerationTodo {
  id: number;
  target: {
    id: number;
    name: string;
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

export interface ModerationExtra {
  photos: Photo[];
  tagOptions: TagOption[];
  taskType: TaskType;
  status: TaskStatus;
  moderator: {
    fullName: string;
    email: string;
  };
}
