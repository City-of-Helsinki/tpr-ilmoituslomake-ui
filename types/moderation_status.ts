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
  [key: string]: ModerationStatus | unknown;
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
      neighborhood_id: ModerationStatus;
      neighborhood: ModerationStatus;
    };
    sv: {
      street: ModerationStatus;
      postal_code: ModerationStatus;
      post_office: ModerationStatus;
      neighborhood_id: ModerationStatus;
      neighborhood: ModerationStatus;
    };
  };
  businessid: ModerationStatus;
  phone: ModerationStatus;
  email: ModerationStatus;
  website: {
    fi: ModerationStatus;
    sv: ModerationStatus;
    en: ModerationStatus;
    [key: string]: ModerationStatus;
  };
  ontology_ids: ModerationStatus;
  matko_ids: ModerationStatus;
  extra_keywords: {
    fi: ModerationStatus;
    sv: ModerationStatus;
    en: ModerationStatus;
    [key: string]: ModerationStatus;
  };
  photos: PhotoStatus[];
  openingTimes: ModerationStatus;
}
