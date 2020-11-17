export interface PhotoValidation {
  url: boolean;
  description?: boolean;
  permission: boolean;
  photographer?: boolean;
}

export interface NotificationValidation {
  name: {
    fi: boolean;
    sv: boolean;
    en: boolean;
    [key: string]: boolean;
  };
  description: {
    short: {
      fi: boolean;
      sv: boolean;
      en: boolean;
      [key: string]: boolean;
    };
    long: {
      fi: boolean;
      sv: boolean;
      en: boolean;
      [key: string]: boolean;
    };
  };
  address: {
    fi: {
      street: boolean;
      postal_code: boolean;
      post_office: boolean;
    };
    sv: {
      street: boolean;
      postal_code: boolean;
      post_office: boolean;
    };
  };
  phone?: boolean;
  email?: boolean;
  website?: {
    fi?: boolean;
    sv?: boolean;
    en?: boolean;
  };
  price?: {
    fi?: boolean;
    sv?: boolean;
    en?: boolean;
  };
  payment_options?: {
    name?: boolean;
  }[];
  ontology_ids: boolean;
  comments?: boolean;
  notifier: {
    notifierType?: string;
    fullName: boolean;
    email: boolean;
    phone: boolean;
    [key: string]: boolean;
  };
  photos: PhotoValidation[];
}
