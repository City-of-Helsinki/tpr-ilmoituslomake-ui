export interface User {
  authenticated: boolean;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface NotificationExtra {
  notifier: {
    notifierType?: string;
    fullName: string;
    email: string;
    phone: string;
  };
  photos?: {
    url: string;
    description: string;
    permission: boolean;
    photographer: string;
  }[];
}

export interface OtherThing {
  other: {
    thing: string;
  };
}
