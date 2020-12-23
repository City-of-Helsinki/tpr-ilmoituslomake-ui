import { ModerationStatus } from "./constants";

export interface PhotoStatus {
  url: ModerationStatus;
  description?: ModerationStatus;
  permission: ModerationStatus;
  photographer?: ModerationStatus;
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
    };
    sv: {
      street: ModerationStatus;
      postal_code: ModerationStatus;
      post_office: ModerationStatus;
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
