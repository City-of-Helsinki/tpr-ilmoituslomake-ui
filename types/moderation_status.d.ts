import { Status } from "./constants";

export interface PhotoStatus {
  url: Status;
  description?: Status;
  permission: Status;
  photographer?: Status;
}

export interface ModerationStatus {
  name: {
    fi: Status;
    sv: Status;
    en: Status;
    [key: string]: Status;
  };
  location: Status;
  description: {
    short: {
      fi: Status;
      sv: Status;
      en: Status;
      [key: string]: Status;
    };
    long: {
      fi: Status;
      sv: Status;
      en: Status;
      [key: string]: Status;
    };
  };
  address: {
    fi: {
      street: Status;
      postal_code: Status;
      post_office: Status;
    };
    sv: {
      street: Status;
      postal_code: Status;
      post_office: Status;
    };
  };
  phone: Status;
  email: Status;
  website: {
    fi: Status;
    sv: Status;
    en: Status;
    [key: string]: Status;
  };
  ontology_ids: Status;
  photos: PhotoStatus[];
}
