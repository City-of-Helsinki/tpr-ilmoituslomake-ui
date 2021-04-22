import { Validation } from "./general";

export interface PhotoValidation {
  url: Validation;
  altText: {
    fi: Validation;
    sv: Validation;
    en: Validation;
    [key: string]: Validation;
  };
  permission: Validation;
  source: Validation;
  base64: Validation;
  [key: string]: Validation | unknown;
}

export interface NotificationValidationSchema {
  inputLanguage: Validation;
  name: {
    fi: Validation;
    sv: Validation;
    en: Validation;
    [key: string]: Validation;
  };
  location: Validation;
  description: {
    short: {
      fi: Validation;
      sv: Validation;
      en: Validation;
      [key: string]: Validation;
    };
    long: {
      fi: Validation;
      sv: Validation;
      en: Validation;
      [key: string]: Validation;
    };
  };
  address: {
    fi: {
      street: Validation;
      postal_code: Validation;
      post_office: Validation;
      neighborhood?: Validation;
    };
    sv: {
      street: Validation;
      postal_code: Validation;
      post_office: Validation;
      neighborhood?: Validation;
    };
  };
  wholeAddress: Validation;
  phone: Validation;
  email: Validation;
  website: {
    fi: Validation;
    sv: Validation;
    en: Validation;
    [key: string]: Validation;
  };
  ontology_ids: Validation;
  comments?: Validation;
  notifier: {
    notifier_type: Validation;
    full_name: Validation;
    email: Validation;
    phone: Validation;
    [key: string]: Validation;
  };
  photos: PhotoValidation[];
}
