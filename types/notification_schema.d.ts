/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * <description>
 */
export interface NotificationSchema {
  organization: {
    [k: string]: unknown;
  };
  name: {
    fi: string;
    sv: string;
    en: string;
    [k: string]: unknown;
  };
  location: [number, number];
  description: {
    short: {
      fi: string;
      sv: string;
      en: string;
      [k: string]: unknown;
    };
    long: {
      fi: string;
      sv: string;
      en: string;
      [k: string]: unknown;
    };
    [k: string]: unknown;
  };
  address: {
    fi: {
      street: string;
      postal_code: string;
      post_office: string;
      [k: string]: unknown;
    };
    sv: {
      street: string;
      postal_code: string;
      post_office: string;
      [k: string]: unknown;
    };
    [k: string]: unknown;
  };
  phone: string;
  email: string;
  website: {
    fi: string;
    sv: string;
    en: string;
    [k: string]: unknown;
  };
  images: {
    [k: string]: unknown;
  };
  opening_times: {
    [k: string]: unknown;
  };
  price: {
    fi: string;
    sv: string;
    en: string;
    [k: string]: unknown;
  };
  payment_options: {
    name?: string;
    [k: string]: unknown;
  }[];
  ontology_ids: string[];
  comments: string;
  [k: string]: unknown;
}