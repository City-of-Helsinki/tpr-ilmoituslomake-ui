export interface PhotoValidation {
  url: boolean;
  description: {
    fi: boolean;
    sv: boolean;
    en: boolean;
    [key: string]: boolean;
  };
  permission: boolean;
  source: boolean;
  [key: string]: boolean;
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
  phone: boolean;
  email: boolean;
  website: {
    fi: boolean;
    sv: boolean;
    en: boolean;
    [key: string]: boolean;
  };
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
