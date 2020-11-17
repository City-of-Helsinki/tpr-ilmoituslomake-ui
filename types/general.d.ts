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

export interface Photo {
  url: string;
  description: string;
  permission: boolean;
  photographer: string;
}

export interface NotificationExtra {
  inputLanguages: string[];
  notifier: {
    notifierType?: string;
    fullName: string;
    email: string;
    phone: string;
    [k: string]: unknown;
  };
  photos: Photo[];
}

export interface OtherThing {
  other: {
    thing: string;
  };
}
