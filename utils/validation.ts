import { Dispatch } from "react";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { I18n } from "next-localization";
import { string, number, ValidationError } from "yup";
import StringSchema from "yup/lib/string";
import NumberSchema from "yup/lib/number";
import { NotificationValidationAction } from "../state/actions/notificationValidationTypes";
import {
  setNotificationInputLanguageValidation,
  setNotificationNameValidation,
  setNotificationShortDescriptionValidation,
  setNotificationLongDescriptionValidation,
  setNotificationTagValidation,
  setNotificationNotifierValidation,
  setNotificationAddressValidation,
  setNotificationWholeAddressValidation,
  setNotificationLocationValidation,
  setNotificationContactValidation,
  setNotificationLinkValidation,
  setNotificationSocialMediaValidation,
  setNotificationPhotoValidation,
  setNotificationPhotoAltTextValidation,
  setNotificationTipValidation,
} from "../state/actions/notificationValidation";
import {
  MAX_LENGTH_SHORT_DESC,
  MIN_LENGTH_LONG_DESC,
  MAX_LENGTH_LONG_DESC,
  MAX_LENGTH_PHOTO_DESC,
  MAX_LENGTH_BUSINESSID,
  MAX_PHOTO_BYTES,
  PhotoSourceType,
  ItemType,
} from "../types/constants";
import { NotificationSchema } from "../types/notification_schema";
import { ChangeRequestSchema, KeyValueValidation, NotificationExtra, Validation } from "../types/general";
import notificationSchema from "../schemas/notification_schema.json";

export const isValid = (schema: StringSchema<string | undefined> | NumberSchema<number | undefined>, fieldValue: string | number): Validation => {
  let valid = true;
  let message;
  try {
    const fieldValueTrimmed = typeof fieldValue === "string" ? fieldValue.trim() : fieldValue;
    const validationResult = schema.validateSync(fieldValueTrimmed);
    valid = validationResult === fieldValueTrimmed;
    message = !valid ? "notification.message.fieldOther" : undefined;
  } catch (e) {
    valid = false;
    const err = e as ValidationError;
    if (err && err.errors && err.errors.length > 0) {
      [message] = err.errors;
    } else {
      message = "notification.message.fieldOther";
    }
  }
  return { valid, message };
};

export const validateInputLanguageField = (notificationExtra: NotificationExtra): Validation => {
  const { inputLanguages } = notificationExtra;
  const valid = inputLanguages.length > 0;
  const result = { valid, message: !valid ? "notification.message.fieldLanguage" : undefined };
  return result;
};

export const isInputLanguageFieldValid = (notificationExtra: NotificationExtra, dispatch: Dispatch<NotificationValidationAction>): boolean => {
  const result = validateInputLanguageField(notificationExtra);
  dispatch(setNotificationInputLanguageValidation(result));
  return result.valid;
};

export const validateName = (language: string, notification: NotificationSchema): Validation => {
  const { name: placeName } = notification;
  const schema = string().required("notification.message.fieldRequired");
  const result = isValid(schema, placeName[language] as string);
  return result;
};

export const isNameValid = (language: string, notification: NotificationSchema, dispatch: Dispatch<NotificationValidationAction>): boolean => {
  const result = validateName(language, notification);
  dispatch(setNotificationNameValidation({ [language]: result }));
  return result.valid;
};

export const validateShortDescription = (language: string, notification: NotificationSchema): Validation => {
  const {
    description: { short: shortDesc },
  } = notification;
  const schema = string().required("notification.message.fieldRequired").max(MAX_LENGTH_SHORT_DESC, "notification.message.fieldTooLong");
  const result = isValid(schema, shortDesc[language] as string);
  return result;
};

export const isShortDescriptionValid = (
  language: string,
  notification: NotificationSchema,
  dispatch: Dispatch<NotificationValidationAction>
): boolean => {
  const result = validateShortDescription(language, notification);
  dispatch(setNotificationShortDescriptionValidation({ [language]: result }));
  return result.valid;
};

export const validateLongDescription = (language: string, notification: NotificationSchema): Validation => {
  const {
    description: { long: longDesc },
  } = notification;
  const schema = string()
    .required("notification.message.fieldRequired")
    .min(MIN_LENGTH_LONG_DESC, "notification.message.fieldTooShort")
    .max(MAX_LENGTH_LONG_DESC, "notification.message.fieldTooLong");
  const result = isValid(schema, longDesc[language] as string);
  return result;
};

export const isLongDescriptionValid = (
  language: string,
  notification: NotificationSchema,
  dispatch: Dispatch<NotificationValidationAction>
): boolean => {
  const result = validateLongDescription(language, notification);
  dispatch(setNotificationLongDescriptionValidation({ [language]: result }));
  return result.valid;
};

export const validateTag = (notification: NotificationSchema): Validation => {
  const { ontology_ids } = notification;
  const valid = ontology_ids.length > 0 && ontology_ids.length <= 5;
  const result = !valid
    ? {
        valid,
        message: ontology_ids.length === 0 ? "notification.message.fieldRequired" : "notification.message.fieldTooLong",
      }
    : { valid, message: undefined };
  return result;
};

export const isTagValid = (notification: NotificationSchema, dispatch: Dispatch<NotificationValidationAction>): boolean => {
  const result = validateTag(notification);
  dispatch(setNotificationTagValidation(result));
  return result.valid;
};

const phoneSchema = () => string().matches(/^\+?[0-9- ]+$/, { excludeEmptyString: true, message: "notification.message.fieldFormat" });

const postalCodeSchema = () =>
  string().matches(/^[0-9][0-9][0-9][0-9][0-9]$/, { excludeEmptyString: true, message: "notification.message.fieldFormat" });

export const validateNotifierField = (notifierField: string, notification: NotificationSchema): Validation => {
  const { notifier } = notification;
  let schema;
  switch (notifierField) {
    case "email": {
      schema = string().required("notification.message.fieldRequired").email("notification.message.fieldFormat");
      break;
    }
    case "phone": {
      schema = phoneSchema().required("notification.message.fieldRequired");
      break;
    }
    default: {
      schema = string().required("notification.message.fieldRequired");
    }
  }
  const result = isValid(schema, notifier[notifierField] as string);
  return result;
};

export const isNotifierFieldValid = (
  notifierField: string,
  notification: NotificationSchema,
  dispatch: Dispatch<NotificationValidationAction>
): boolean => {
  const result = validateNotifierField(notifierField, notification);
  dispatch(setNotificationNotifierValidation({ [notifierField]: result }));
  return result.valid;
};

export const validateAddressField = (language: string, addressField: string, notification: NotificationSchema): Validation => {
  const { address } = notification;
  const { fi, sv } = address;
  let schema;
  switch (addressField) {
    case "postal_code": {
      schema = postalCodeSchema().required("notification.message.fieldRequired");
      break;
    }
    default: {
      schema = string().required("notification.message.fieldRequired");
    }
  }
  const result = isValid(schema, language === "sv" ? (sv[addressField] as string) : (fi[addressField] as string));
  return result;
};

export const isAddressFieldValid = (
  language: string,
  addressField: string,
  notification: NotificationSchema,
  dispatch: Dispatch<NotificationValidationAction>
): boolean => {
  const result = validateAddressField(language, addressField, notification);
  dispatch(setNotificationAddressValidation(language, { [addressField]: result }));
  return result.valid;
};

export const validateWholeAddress = (language: string, notification: NotificationSchema, notificationExtra: NotificationExtra): Validation => {
  const { address } = notification;
  const { fi, sv } = address;
  const { addressFound } = notificationExtra;

  // Check that the street and postal code match, but not the municipality since it is not language-specific
  // 16.9.2022 - The Helsinki API seems to have changed and postal codes are no longer returned in the results
  const valid =
    !!addressFound &&
    (language === "sv"
      ? sv.street.toLowerCase().startsWith(addressFound.street.toLowerCase())
      : fi.street.toLowerCase().startsWith(addressFound.street.toLowerCase()));
  // && (language === "sv" ? sv.postal_code === addressFound.postalCode : fi.postal_code === addressFound.postalCode);

  const result = { valid, message: undefined };
  return result;
};

export const isWholeAddressValid = (
  language: string,
  notification: NotificationSchema,
  notificationExtra: NotificationExtra,
  dispatch: Dispatch<NotificationValidationAction>
): boolean => {
  const result = validateWholeAddress(language, notification, notificationExtra);
  dispatch(setNotificationWholeAddressValidation(result));
  return result.valid;
};

export const validateLocation = (notification: NotificationSchema): Validation => {
  const { location } = notification;
  const valid = location && location.length === 2 && location[0] > 0 && location[1] > 0;
  const result = { valid, message: !valid ? "notification.location.locationNotSpecified" : undefined };
  return result;
};

export const isLocationValid = (notification: NotificationSchema, dispatch: Dispatch<NotificationValidationAction>): boolean => {
  const result = validateLocation(notification);
  dispatch(setNotificationLocationValidation(result));
  return result.valid;
};

export const validateContactField = (contactField: string, notification: NotificationSchema): Validation => {
  const { businessid, phone, email } = notification;
  let result;
  switch (contactField) {
    case "businessid": {
      const schema = string().max(MAX_LENGTH_BUSINESSID, "notification.message.fieldTooLong");
      result = isValid(schema, businessid as string);
      break;
    }
    case "phone": {
      const schema = phoneSchema();
      result = isValid(schema, phone);
      break;
    }
    case "email": {
      const schema = string().email("notification.message.fieldFormat");
      result = isValid(schema, email);
      break;
    }
    default: {
      result = { valid: true };
    }
  }
  return result;
};

export const isContactFieldValid = (
  contactField: string,
  notification: NotificationSchema,
  dispatch: Dispatch<NotificationValidationAction>
): boolean => {
  const result = validateContactField(contactField, notification);
  dispatch(setNotificationContactValidation({ [contactField]: result }));
  return result.valid;
};

export const validateWebsite = (language: string, notification: NotificationSchema): Validation => {
  const { website } = notification;
  const schema = string().url("notification.message.fieldFormatUrl");
  const result = isValid(schema, website[language] as string);
  return result;
};

export const isWebsiteValid = (language: string, notification: NotificationSchema, dispatch: Dispatch<NotificationValidationAction>): boolean => {
  const result = validateWebsite(language, notification);
  dispatch(setNotificationLinkValidation({ [language]: result }));
  return result.valid;
};

export const validateSocialMediaField = (index: number, socialMediaField: string, notification: NotificationSchema): Validation => {
  const { social_media } = notification;
  if (!social_media) {
    return { valid: true };
  }
  const socialMediaItem = social_media[index];
  const schema = string().required("notification.message.fieldRequired");
  const result = isValid(schema, socialMediaItem[socialMediaField] as string);
  return result;
};

export const isSocialMediaFieldValid = (
  index: number,
  socialMediaField: string,
  notification: NotificationSchema,
  dispatch: Dispatch<NotificationValidationAction>
): boolean => {
  const result = validateSocialMediaField(index, socialMediaField, notification);
  dispatch(setNotificationSocialMediaValidation(index, { [socialMediaField]: result }));
  return result.valid;
};

export const validatePhotoBase64 = (index: number, base64: string, notificationExtra: NotificationExtra): Validation => {
  const { photos } = notificationExtra;
  const photo = photos[index];
  const schema =
    photo.new && photo.sourceType === PhotoSourceType.Device
      ? string()
          .required("notification.message.fieldRequired")
          .matches(/image\/jpeg/, "notification.message.fieldNotJpeg")
      : string();
  const result = isValid(schema, base64);

  if (result.valid && photo.new && photo.sourceType === PhotoSourceType.Device) {
    // The base64 string should start with "data:image/jpeg;base64," to be valid
    // Check the approximate size of the image using the formula from https://en.wikipedia.org/wiki/Base64
    const regex = new RegExp(/image\/jpeg/);
    const base64ValidFormat = base64 ? regex.test(base64) : false;
    const approxBytes = base64 ? (base64.length - 814) / 1.37 : 0;
    const base64ValidSize = base64 ? approxBytes < MAX_PHOTO_BYTES : false;

    result.valid = base64ValidFormat && base64ValidSize;
    if (!base64ValidFormat) {
      result.message = "notification.message.fieldNotJpeg";
    } else if (!base64ValidSize) {
      result.message = "notification.message.fieldImageTooLarge";
    }
  }

  return result;
};

export const isPhotoBase64Valid = (
  index: number,
  base64: string,
  notificationExtra: NotificationExtra,
  dispatch: Dispatch<NotificationValidationAction>
): boolean => {
  const result = validatePhotoBase64(index, base64, notificationExtra);
  dispatch(setNotificationPhotoValidation(index, { base64: result }));
  return result.valid;
};

export const validatePhotoField = (index: number, photoField: string, notificationExtra: NotificationExtra): Validation => {
  const { photos } = notificationExtra;
  const photo = photos[index];
  let schema;
  switch (photoField) {
    case "url": {
      schema =
        !photo.new || photo.sourceType === PhotoSourceType.Link
          ? string().required("notification.message.fieldRequired").url("notification.message.fieldFormatUrl")
          : string().required("notification.message.fieldRequired");
      break;
    }
    default: {
      schema = string().required("notification.message.fieldRequired");
    }
  }
  const result = isValid(schema, photo[photoField] as string);
  return result;
};

export const isPhotoFieldValid = (
  index: number,
  photoField: string,
  notificationExtra: NotificationExtra,
  dispatch: Dispatch<NotificationValidationAction>
): boolean => {
  const result = validatePhotoField(index, photoField, notificationExtra);
  dispatch(setNotificationPhotoValidation(index, { [photoField]: result }));
  return result.valid;
};

export const validatePhotoAltText = (index: number, language: string, notificationExtra: NotificationExtra): Validation => {
  const { photos } = notificationExtra;
  const photo = photos[index];
  const { altText } = photo;
  const schema = string().max(MAX_LENGTH_PHOTO_DESC, "notification.message.fieldTooLong");
  const result = isValid(schema, altText[language] as string);
  return result;
};

export const isPhotoAltTextValid = (
  index: number,
  language: string,
  notificationExtra: NotificationExtra,
  dispatch: Dispatch<NotificationValidationAction>
): boolean => {
  const result = validatePhotoAltText(index, language, notificationExtra);
  dispatch(setNotificationPhotoAltTextValidation(index, { [language]: result }));
  return result.valid;
};

export const getPageValidationSummary = (
  page: number,
  locale: string | undefined,
  notification: NotificationSchema,
  notificationExtra: NotificationExtra,
  i18n: I18n<unknown>
): KeyValueValidation => {
  const { social_media = [] } = notification;
  const { inputLanguages, photos } = notificationExtra;

  // Check whether all data on the specific page is valid and create a summary of the results
  // The fieldLabel value is also added to use in the ValidationSummary component
  switch (page) {
    case 1: {
      // Basic
      return {
        ...inputLanguages.reduce((acc, option) => {
          return {
            ...acc,
            [`placeName_${option}`]: {
              ...validateName(option, notification),
              fieldLabel: `${i18n.t("notification.description.placeName.label")} ${i18n.t(`common.inLanguage.${option}`)}`,
            },
            [`shortDescription_${option}`]: {
              ...validateShortDescription(option, notification),
              fieldLabel: `${i18n.t("notification.description.shortDescription.label")} ${i18n.t(`common.inLanguage.${option}`)}`,
            },
            [`longDescription_${option}`]: {
              ...validateLongDescription(option, notification),
              fieldLabel: `${i18n.t("notification.description.longDescription.label")} ${i18n.t(`common.inLanguage.${option}`)}`,
            },
          };
        }, {}),
        inputLanguage: { ...validateInputLanguageField(notificationExtra), fieldLabel: i18n.t("notification.inputLanguage.title") },
        "tag-input": { ...validateTag(notification), fieldLabel: i18n.t("notification.tags.tagSelection") },
        notifierType: { ...validateNotifierField("notifier_type", notification), fieldLabel: i18n.t("notification.notifier.notifierType") },
        fullName: { ...validateNotifierField("full_name", notification), fieldLabel: i18n.t("notification.notifier.fullName.label") },
        email: { ...validateNotifierField("email", notification), fieldLabel: i18n.t("notification.notifier.email.label") },
        phone: { ...validateNotifierField("phone", notification), fieldLabel: i18n.t("notification.notifier.phone.label") },
      };
    }
    case 2: {
      // Contact
      return {
        ...(locale === "sv" && {
          streetAddressSv: { ...validateAddressField("sv", "street", notification), fieldLabel: i18n.t("notification.location.streetAddress.label") },
          postalCodeSv: { ...validateAddressField("sv", "postal_code", notification), fieldLabel: i18n.t("notification.location.postalCode.label") },
          postalOfficeSv: {
            ...validateAddressField("sv", "post_office", notification),
            fieldLabel: i18n.t("notification.location.postalOffice.label"),
          },
        }),
        ...(locale !== "sv" && {
          streetAddressFi: { ...validateAddressField("fi", "street", notification), fieldLabel: i18n.t("notification.location.streetAddress.label") },
          postalCodeFi: { ...validateAddressField("fi", "postal_code", notification), fieldLabel: i18n.t("notification.location.postalCode.label") },
          postalOfficeFi: {
            ...validateAddressField("fi", "post_office", notification),
            fieldLabel: i18n.t("notification.location.postalOffice.label"),
          },
        }),
        businessid: { ...validateContactField("businessid", notification), fieldLabel: i18n.t("notification.contact.businessid.label") },
        phone: { ...validateContactField("phone", notification), fieldLabel: i18n.t("notification.contact.phone.label") },
        email: { ...validateContactField("email", notification), fieldLabel: i18n.t("notification.contact.email.label") },
        map: { ...validateLocation(notification), fieldLabel: i18n.t("notification.location.locationNotSpecified") },
        ...inputLanguages.reduce((acc, option) => {
          return {
            ...acc,
            [`website_${option}`]: {
              ...validateWebsite(option, notification),
              fieldLabel: `${i18n.t("notification.links.website.label")} ${i18n.t(`common.inLanguage.${option}`)}`,
            },
          };
        }, {}),
        ...social_media.reduce((acc, item, index) => {
          return {
            ...acc,
            [`title_${index}`]: {
              ...validateSocialMediaField(index, "title", notification),
              fieldLabel: i18n.t("notification.socialMedia.title.label"),
            },
            [`link_${index}`]: {
              ...validateSocialMediaField(index, "link", notification),
              fieldLabel: i18n.t("notification.socialMedia.link.label"),
            },
          };
        }, {}),
      };
    }
    case 3: {
      // Photos
      return {
        ...photos.reduce((acc, photo, index) => {
          const urlValidation = validatePhotoField(index, "url", notificationExtra);
          const base64Validation = validatePhotoBase64(index, photo.base64 as string, notificationExtra);
          const photoValidation = !urlValidation.valid ? urlValidation : base64Validation;

          return {
            ...acc,
            [`url_${index}`]: {
              ...photoValidation,
              fieldLabel:
                !photo.new || photo.sourceType === PhotoSourceType.Link
                  ? i18n.t("notification.photos.url.labelLink")
                  : i18n.t("notification.photos.photo.title"),
            },
            [`permission_${index}`]: {
              ...validatePhotoField(index, "permission", notificationExtra),
              fieldLabel: i18n.t("notification.photos.permission.label"),
            },
            [`source_${index}`]: {
              ...validatePhotoField(index, "source", notificationExtra),
              fieldLabel: i18n.t("notification.photos.source.label"),
            },
            ...inputLanguages.reduce((acc2, option) => {
              return {
                ...acc2,
                [`altText_${index}_${option}`]: {
                  ...validatePhotoAltText(index, option, notificationExtra),
                  fieldLabel: `${i18n.t("notification.photos.altText.label")} ${i18n.t(`common.inLanguage.${option}`)}`,
                },
              };
            }, {}),
          };
        }, {}),
      };
    }
    default: {
      // Send
      return {};
    }
  }
};

export const isPageValid = (
  page: number,
  locale: string | undefined,
  notification: NotificationSchema,
  notificationExtra: NotificationExtra,
  dispatch: Dispatch<NotificationValidationAction>
): boolean => {
  const { social_media = [] } = notification;
  const { inputLanguages, photos } = notificationExtra;

  // Check whether all data on the specific page is valid
  // Everything needs to be validated, so make sure lazy evaluation is not used
  switch (page) {
    case 1: {
      // Basic
      const inputValid1 = inputLanguages.flatMap((option) => [
        isNameValid(option, notification, dispatch),
        isShortDescriptionValid(option, notification, dispatch),
        isLongDescriptionValid(option, notification, dispatch),
      ]);
      const inputValid2 = [
        isInputLanguageFieldValid(notificationExtra, dispatch),
        isTagValid(notification, dispatch),
        isNotifierFieldValid("notifier_type", notification, dispatch),
        isNotifierFieldValid("full_name", notification, dispatch),
        isNotifierFieldValid("email", notification, dispatch),
        isNotifierFieldValid("phone", notification, dispatch),
      ];
      return inputValid1.every((valid) => valid) && inputValid2.every((valid) => valid);
    }
    case 2: {
      // Contact
      const inputValid1 =
        locale === "sv"
          ? [
              isAddressFieldValid("sv", "street", notification, dispatch),
              isAddressFieldValid("sv", "postal_code", notification, dispatch),
              isAddressFieldValid("sv", "post_office", notification, dispatch),
              // isWholeAddressValid("sv", notification, notificationExtra, dispatch),
            ]
          : [
              isAddressFieldValid("fi", "street", notification, dispatch),
              isAddressFieldValid("fi", "postal_code", notification, dispatch),
              isAddressFieldValid("fi", "post_office", notification, dispatch),
              // isWholeAddressValid("fi", notification, notificationExtra, dispatch),
            ];
      const inputValid2 = [
        isContactFieldValid("businessid", notification, dispatch),
        isContactFieldValid("phone", notification, dispatch),
        isContactFieldValid("email", notification, dispatch),
        isLocationValid(notification, dispatch),
      ];
      const inputValid3 = inputLanguages.map((option) => isWebsiteValid(option, notification, dispatch));
      const inputValid4 = social_media.map((item, index) => {
        const socialMediaValid = [
          isSocialMediaFieldValid(index, "title", notification, dispatch),
          isSocialMediaFieldValid(index, "link", notification, dispatch),
        ];
        return socialMediaValid.every((valid) => valid);
      });
      return (
        inputValid1.every((valid) => valid) &&
        inputValid2.every((valid) => valid) &&
        inputValid3.every((valid) => valid) &&
        inputValid4.every((valid) => valid)
      );
    }
    case 3: {
      // Photos
      const photosValid = photos.map((photo, index) => {
        const photoValid1 = [
          isPhotoFieldValid(index, "url", notificationExtra, dispatch),
          isPhotoFieldValid(index, "permission", notificationExtra, dispatch),
          isPhotoFieldValid(index, "source", notificationExtra, dispatch),
          isPhotoBase64Valid(index, photo.base64 as string, notificationExtra, dispatch),
        ];
        const photoValid2 = inputLanguages.flatMap((option) => [isPhotoAltTextValid(index, option, notificationExtra, dispatch)]);
        return photoValid1.every((valid) => valid) && photoValid2.every((valid) => valid);
      });
      return photosValid.every((valid) => valid);
    }
    default: {
      // Send
      return true;
    }
  }
};

export const validateTipField = (tipField: string, tip: ChangeRequestSchema): Validation => {
  let schema;
  switch (tipField) {
    case "target": {
      schema = number().required("notification.message.fieldRequired").moreThan(0, "notification.message.fieldRequired");
      break;
    }
    default: {
      schema = string().required("notification.message.fieldRequired");
    }
  }
  const result = isValid(schema, tip[tipField]);
  return result;
};

export const isTipFieldValid = (tipField: string, tip: ChangeRequestSchema, dispatch: Dispatch<NotificationValidationAction>): boolean => {
  const result = validateTipField(tipField, tip);
  dispatch(setNotificationTipValidation({ [tipField]: result }));
  return result.valid;
};

export const getTipPageValidationSummary = (tip: ChangeRequestSchema, i18n: I18n<unknown>): KeyValueValidation => {
  // Check whether all data on the page is valid and create a summary of the results
  // The fieldLabel value is also added to use in the ValidationSummary component
  return {
    ...((tip.item_type === ItemType.ChangeRequestChange || tip.item_type === ItemType.ChangeRequestDelete) && {
      placeName: { ...validateTipField("target", tip), fieldLabel: i18n.t("notification.tip.placeResults.label") },
    }),
    itemType: { ...validateTipField("item_type", tip), fieldLabel: i18n.t("notification.tip.itemType.label") },
    ...(tip.item_type === ItemType.ChangeRequestAdd && {
      userPlaceName: { ...validateTipField("user_place_name", tip), fieldLabel: i18n.t("notification.tip.addPlaceName.label") },
    }),
    userComments: { ...validateTipField("user_comments", tip), fieldLabel: i18n.t("notification.tip.comments.label") },
  };
};

export const isTipPageValid = (tip: ChangeRequestSchema, dispatch: Dispatch<NotificationValidationAction>): boolean => {
  // Check whether all data on the page is valid
  // Everything needs to be validated, so make sure lazy evaluation is not used
  const inputValid = [
    tip.item_type === ItemType.ChangeRequestChange || tip.item_type === ItemType.ChangeRequestDelete
      ? isTipFieldValid("target", tip, dispatch)
      : true,
    isTipFieldValid("item_type", tip, dispatch),
    tip.item_type === ItemType.ChangeRequestAdd ? isTipFieldValid("user_place_name", tip, dispatch) : true,
    isTipFieldValid("user_comments", tip, dispatch),
  ];
  return inputValid.every((valid) => valid);
};

const validateNotificationData = (notification: NotificationSchema): boolean => {
  const ajv = new Ajv();
  addFormats(ajv, ["email", "uri"]);

  const schema = notificationSchema;
  const validate = ajv.compile<NotificationSchema>(schema);

  const validated = validate(notification);

  if (!validated) {
    // TODO: proper validation error handling
    const errors = validate.errors || [];
    errors.forEach((err) => {
      console.log("validation error -", err.message);
      console.log(err);
    });
  }

  return validated;
};

export default validateNotificationData;
