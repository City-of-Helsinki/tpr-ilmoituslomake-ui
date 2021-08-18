import { TranslationStatus } from "./constants";

export interface PhotoTranslationStatus {
  altText: {
    lang: TranslationStatus;
    [key: string]: TranslationStatus;
  };
  source: TranslationStatus;
  [key: string]: TranslationStatus | unknown;
}

export interface TranslationStatusSchema {
  name: {
    lang: TranslationStatus;
    [key: string]: TranslationStatus;
  };
  description: {
    short: {
      lang: TranslationStatus;
      [key: string]: TranslationStatus;
    };
    long: {
      lang: TranslationStatus;
      [key: string]: TranslationStatus;
    };
  };
  photos: PhotoTranslationStatus[];
}
