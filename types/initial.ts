import { ModerationStatus, NotifierType, TaskStatus, TaskType } from "./constants";
import { ModerationExtra, NotificationExtra, TranslationExtra } from "./general";
import { ModerationStatusSchema } from "./moderation_status";
import { NotificationSchema } from "./notification_schema";
import { NotificationValidationSchema } from "./notification_validation";
import { TranslationSchema } from "./translation_schema";
import { defaultLocale } from "../utils/i18n";

export const INITIAL_NOTIFICATION: NotificationSchema = {
  organization: {},
  name: {
    fi: "",
    sv: "",
    en: "",
  },
  location: [0, 0],
  description: {
    short: {
      fi: "",
      sv: "",
      en: "",
    },
    long: {
      fi: "",
      sv: "",
      en: "",
    },
  },
  address: {
    fi: {
      street: "",
      postal_code: "",
      post_office: "",
      neighborhood_id: "",
      neighborhood: "",
    },
    sv: {
      street: "",
      postal_code: "",
      post_office: "",
      neighborhood_id: "",
      neighborhood: "",
    },
  },
  businessid: "",
  phone: "",
  email: "",
  website: {
    fi: "",
    sv: "",
    en: "",
  },
  images: [],
  opening_times: {},
  ontology_ids: [],
  certificate_ids: [],
  label_ids: [],
  matko_ids: [],
  extra_keywords: {
    fi: [],
    sv: [],
    en: [],
  },
  other_certificates: {
    fi: "",
    sv: "",
    en: "",
  },
  other_certificates_url: {
    fi: "",
    sv: "",
    en: "",
  },
  no_certificate: false,
  comments: "",
  notifier: {
    notifier_type: NotifierType.Representative,
    full_name: "",
    email: "",
    phone: "",
  },
  social_media: [],
};

export const INITIAL_NOTIFICATION_EXTRA: NotificationExtra = {
  inputLanguages: [defaultLocale],
  photos: [],
  tagOptions: [],
  certificateOptions: [],
  labelOptions: [],
  extraKeywordsText: {
    fi: "",
    sv: "",
    en: "",
  },
  otherCertificates: {
    fi: "",
    sv: "",
    en: "",
  },
  otherCertificatesUrl: {
    fi: "",
    sv: "",
    en: "",
  },
  noCertificate: false,
  locationOriginal: [0, 0],
  addressOriginal: {
    fi: {
      street: "",
      postal_code: "",
      post_office: "",
    },
    sv: {
      street: "",
      postal_code: "",
      post_office: "",
    },
  },
  openingTimesId: 0,
  openingTimesNotificationId: 0,
  isNew: true,
};

export const INITIAL_NOTIFICATION_VALIDATION: NotificationValidationSchema = {
  inputLanguage: { valid: true },
  name: {
    fi: { valid: true },
    sv: { valid: true },
    en: { valid: true },
  },
  location: { valid: true },
  description: {
    short: {
      fi: { valid: true },
      sv: { valid: true },
      en: { valid: true },
    },
    long: {
      fi: { valid: true },
      sv: { valid: true },
      en: { valid: true },
    },
  },
  address: {
    fi: {
      street: { valid: true },
      postal_code: { valid: true },
      post_office: { valid: true },
    },
    sv: {
      street: { valid: true },
      postal_code: { valid: true },
      post_office: { valid: true },
    },
  },
  wholeAddress: { valid: true },
  businessid: { valid: true },
  phone: { valid: true },
  email: { valid: true },
  website: {
    fi: { valid: true },
    sv: { valid: true },
    en: { valid: true },
  },
  ontology_ids: { valid: true },
  certificate_ids: { valid: true },
  label_ids: { valid: true },
  matko_ids: { valid: true },
  extra_keywords: {
    fi: { valid: true },
    sv: { valid: true },
    en: { valid: true },
  },
  other_certificates: {
    fi: { valid: true },
    sv: { valid: true },
    en: { valid: true },
  },
  other_certificates_url: {
    fi: { valid: true },
    sv: { valid: true },
    en: { valid: true },
  },
  no_certificate: { valid: true },
  notifier: {
    notifier_type: { valid: true },
    full_name: { valid: true },
    email: { valid: true },
    phone: { valid: true },
  },
  photos: [],
  social_media: [],
};

export const INITIAL_TRANSLATION: TranslationSchema = {
  language: "",
  name: {
    lang: "",
  },
  description: {
    short: {
      lang: "",
    },
    long: {
      lang: "",
    },
  },
  website: {
    lang: "",
  },
  images: [],
};

export const INITIAL_TRANSLATION_EXTRA: TranslationExtra = {
  photosSelected: [],
  photosTranslated: [],
  translationRequest: {
    requestId: 0,
    request: "",
    formattedRequest: "",
    language: {
      from: "",
      to: "",
    },
    message: "",
    translator: {
      fullName: "",
      email: "",
    },
    moderator: {
      fullName: "",
      email: "",
    },
  },
  translationTask: {
    created_at: "",
    updated_at: "",
    taskType: TaskType.Unknown,
    taskStatus: TaskStatus.Unknown,
  },
};

export const INITIAL_MODERATION_EXTRA: ModerationExtra = {
  photosUuids: [],
  photosSelected: [],
  photosModified: [],
  tagOptions: [],
  matkoTagOptions: [],
  certificateOptions: [],
  labelOptions: [],
  extraKeywordsTextSelected: {
    fi: "",
    sv: "",
    en: "",
  },
  extraKeywordsTextModified: {
    fi: "",
    sv: "",
    en: "",
  },
  otherCertificatesSelected: {
    fi: "",
    sv: "",
    en: "",
  },
  otherCertificatesModified: {
    fi: "",
    sv: "",
    en: "",
  },
  otherCertificatesUrlSelected: {
    fi: "",
    sv: "",
    en: "",
  },
  otherCertificatesUrlModified: {
    fi: "",
    sv: "",
    en: "",
  },
  noCertificate: false,
  published: false,
  created_at: "",
  updated_at: "",
  taskType: TaskType.Unknown,
  taskStatus: TaskStatus.Unknown,
  userPlaceName: "",
  userComments: "",
  userDetails: "",
  moderator: {
    fullName: "",
    email: "",
  },
  lastUpdated: {
    fullName: "",
    updated_at: "",
  },
  openingTimesId: 0,
  openingTimesNotificationId: 0,
  socialMediaUuids: [],
};

const getInitialModerationStatus = (moderationStatus: ModerationStatus): ModerationStatusSchema => {
  return {
    name: {
      fi: moderationStatus,
      sv: moderationStatus,
      en: moderationStatus,
    },
    location: moderationStatus,
    description: {
      short: {
        fi: moderationStatus,
        sv: moderationStatus,
        en: moderationStatus,
      },
      long: {
        fi: moderationStatus,
        sv: moderationStatus,
        en: moderationStatus,
      },
    },
    address: {
      fi: {
        street: moderationStatus,
        postal_code: moderationStatus,
        post_office: moderationStatus,
        neighborhood_id: moderationStatus,
        neighborhood: moderationStatus,
      },
      sv: {
        street: moderationStatus,
        postal_code: moderationStatus,
        post_office: moderationStatus,
        neighborhood_id: moderationStatus,
        neighborhood: moderationStatus,
      },
    },
    businessid: moderationStatus,
    phone: moderationStatus,
    email: moderationStatus,
    website: {
      fi: moderationStatus,
      sv: moderationStatus,
      en: moderationStatus,
    },
    ontology_ids: moderationStatus,
    matko_ids: moderationStatus,
    certificate_ids: moderationStatus,
    label_ids: moderationStatus,
    extra_keywords: {
      fi: moderationStatus,
      sv: moderationStatus,
      en: moderationStatus,
    },
    other_certificates: {
      fi: moderationStatus,
      sv: moderationStatus,
      en: moderationStatus,
    },
    other_certificates_url: {
      fi: moderationStatus,
      sv: moderationStatus,
      en: moderationStatus,
    },
    no_certificate: moderationStatus,
    photos: [],
    socialMedia: [],
    openingTimes: moderationStatus,
  };
};

export const INITIAL_MODERATION_STATUS = getInitialModerationStatus(ModerationStatus.Unknown);
export const INITIAL_MODERATION_STATUS_EDITED = getInitialModerationStatus(ModerationStatus.Edited);
