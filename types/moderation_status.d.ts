import { ModerationStatus } from "./constants";

export interface PhotoStatus {
  url: ModerationStatus;
  altText: {
    fi: ModerationStatus;
    sv: ModerationStatus;
    en: ModerationStatus;
    [key: string]: ModerationStatus;
  };
  permission: ModerationStatus;
  source: ModerationStatus;
  [key: string]: ModerationStatus;
}

export interface ModerationStatusSchema {
  name: {
    fi: ModerationStatus;
    sv: ModerationStatus;
    en: ModerationStatus;
    [key: string]: ModerationStatus;
  };
  location: ModerationStatus;
  description: {
    short: {
      fi: ModerationStatus;
      sv: ModerationStatus;
      en: ModerationStatus;
      [key: string]: ModerationStatus;
    };
    long: {
      fi: ModerationStatus;
      sv: ModerationStatus;
      en: ModerationStatus;
      [key: string]: ModerationStatus;
    };
  };
  address: {
    fi: {
      street: ModerationStatus;
      postal_code: ModerationStatus;
      post_office: ModerationStatus;
      neighborhood: ModerationStatus;
    };
    sv: {
      street: ModerationStatus;
      postal_code: ModerationStatus;
      post_office: ModerationStatus;
      neighborhood: ModerationStatus;
    };
  };
  phone: ModerationStatus;
  email: ModerationStatus;
  website: {
    fi: ModerationStatus;
    sv: ModerationStatus;
    en: ModerationStatus;
    [key: string]: ModerationStatus;
  };
  ontology_ids: ModerationStatus;
  photos: PhotoStatus[];
}
