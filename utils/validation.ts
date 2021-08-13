import { Dispatch } from "react";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { string, number } from "yup";
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
  setNotificationPhotoValidation,
  setNotificationPhotoAltTextValidation,
  setNotificationTipValidation,
} from "../state/actions/notificationValidation";
import {
  MAX_LENGTH_SHORT_DESC,
  MIN_LENGTH_LONG_DESC,
  MAX_LENGTH_LONG_DESC,
  MAX_LENGTH_PHOTO_DESC,
  MAX_PHOTO_BYTES,
  PhotoSourceType,
  ItemType,
} from "../types/constants";
import { NotificationSchema } from "../types/notification_schema";
import { ChangeRequestSchema, NotificationExtra, Validation } from "../types/general";
import notificationSchema from "../schemas/notification_schema.json";

export const isValid = (schema: StringSchema<string | undefined> | NumberSchema<number | undefined>, fieldValue: string | number): Validation => {
  let valid = true;
  let message;
  try {
    const fieldValueTrimmed = typeof fieldValue === "string" ? fieldValue.trim() : fieldValue;
    const validationResult = schema.validateSync(fieldValueTrimmed);
    valid = validationResult === fieldValueTrimmed;
    message = !valid ? "notification.message.fieldOther" : undefined;
  } catch (err) {
    valid = false;
    if (err && err.errors && err.errors.length > 0) {
      [message] = err.errors;
    } else {
      message = "notification.message.fieldOther";
    }
  }
  return { valid, message };
};

export const isInputLanguageFieldValid = (notificationExtra: NotificationExtra, dispatch: Dispatch<NotificationValidationAction>): boolean => {
  const { inputLanguages } = notificationExtra;
  const valid = inputLanguages.length > 0;
  if (!valid) {
    dispatch(setNotificationInputLanguageValidation({ valid, message: "notification.message.fieldLanguage" }));
  } else {
    dispatch(setNotificationInputLanguageValidation({ valid, message: undefined }));
  }
  return valid;
};

export const isNameValid = (language: string, notification: NotificationSchema, dispatch: Dispatch<NotificationValidationAction>): boolean => {
  const { name: placeName } = notification;
  const schema = string().required("notification.message.fieldRequired");
  const result = isValid(schema, placeName[language] as string);
  dispatch(setNotificationNameValidation({ [language]: result }));
  return result.valid;
};

export const isShortDescriptionValid = (
  language: string,
  notification: NotificationSchema,
  dispatch: Dispatch<NotificationValidationAction>
): boolean => {
  const {
    description: { short: shortDesc },
  } = notification;
  const schema = string().required("notification.message.fieldRequired").max(MAX_LENGTH_SHORT_DESC, "notification.message.fieldTooLong");
  const result = isValid(schema, shortDesc[language] as string);
  dispatch(setNotificationShortDescriptionValidation({ [language]: result }));
  return result.valid;
};

export const isLongDescriptionValid = (
  language: string,
  notification: NotificationSchema,
  dispatch: Dispatch<NotificationValidationAction>
): boolean => {
  const {
    description: { long: longDesc },
  } = notification;
  const schema = string()
    .required("notification.message.fieldRequired")
    .min(MIN_LENGTH_LONG_DESC, "notification.message.fieldTooShort")
    .max(MAX_LENGTH_LONG_DESC, "notification.message.fieldTooLong");
  const result = isValid(schema, longDesc[language] as string);
  dispatch(setNotificationLongDescriptionValidation({ [language]: result }));
  return result.valid;
};

export const isTagValid = (notification: NotificationSchema, dispatch: Dispatch<NotificationValidationAction>): boolean => {
  const { ontology_ids } = notification;
  const valid = ontology_ids.length > 0 && ontology_ids.length <= 5;
  if (!valid) {
    dispatch(
      setNotificationTagValidation({
        valid,
        message: ontology_ids.length === 0 ? "notification.message.fieldRequired" : "notification.message.fieldTooLong",
      })
    );
  } else {
    dispatch(setNotificationTagValidation({ valid, message: undefined }));
  }
  return valid;
};

const phoneSchema = () => string().matches(/^\+?[0-9- ]+$/, { excludeEmptyString: true, message: "notification.message.fieldFormat" });

const postalCodeSchema = () =>
  string().matches(/^[0-9][0-9][0-9][0-9][0-9]$/, { excludeEmptyString: true, message: "notification.message.fieldFormat" });

export const isNotifierFieldValid = (
  notifierField: string,
  notification: NotificationSchema,
  dispatch: Dispatch<NotificationValidationAction>
): boolean => {
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
  dispatch(setNotificationNotifierValidation({ [notifierField]: result }));
  return result.valid;
};

export const isAddressFieldValid = (
  language: string,
  addressField: string,
  notification: NotificationSchema,
  dispatch: Dispatch<NotificationValidationAction>
): boolean => {
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
  dispatch(setNotificationAddressValidation(language, { [addressField]: result }));
  return result.valid;
};

export const isWholeAddressValid = (
  language: string,
  notification: NotificationSchema,
  notificationExtra: NotificationExtra,
  dispatch: Dispatch<NotificationValidationAction>
): boolean => {
  const { address } = notification;
  const { fi, sv } = address;
  const { addressFound } = notificationExtra;

  // Check that the street and postal code match, but not the municipality since it is not language-specific
  const valid =
    !!addressFound &&
    (language === "sv"
      ? sv.street.toLowerCase().startsWith(addressFound.street.toLowerCase())
      : fi.street.toLowerCase().startsWith(addressFound.street.toLowerCase())) &&
    (language === "sv" ? sv.postal_code === addressFound.postalCode : fi.postal_code === addressFound.postalCode);

  dispatch(setNotificationWholeAddressValidation({ valid, message: undefined }));
  return valid;
};

export const isLocationValid = (notification: NotificationSchema, dispatch: Dispatch<NotificationValidationAction>): boolean => {
  const { location } = notification;
  const valid = location && location.length === 2 && location[0] > 0 && location[1] > 0;
  dispatch(setNotificationLocationValidation({ valid, message: undefined }));
  return valid;
};

export const isContactFieldValid = (
  contactField: string,
  notification: NotificationSchema,
  dispatch: Dispatch<NotificationValidationAction>
): boolean => {
  const { phone, email } = notification;
  let result;
  switch (contactField) {
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
  dispatch(setNotificationContactValidation({ [contactField]: result }));
  return result.valid;
};

export const isWebsiteValid = (language: string, notification: NotificationSchema, dispatch: Dispatch<NotificationValidationAction>): boolean => {
  const { website } = notification;
  const schema = string().url("notification.message.fieldFormatUrl");
  const result = isValid(schema, website[language] as string);
  dispatch(setNotificationLinkValidation({ [language]: result }));
  return result.valid;
};

export const isPhotoBase64Valid = (
  index: number,
  base64: string,
  notificationExtra: NotificationExtra,
  dispatch: Dispatch<NotificationValidationAction>
): boolean => {
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

  dispatch(setNotificationPhotoValidation(index, { base64: result }));
  return result.valid;
};

export const isPhotoFieldValid = (
  index: number,
  photoField: string,
  notificationExtra: NotificationExtra,
  dispatch: Dispatch<NotificationValidationAction>
): boolean => {
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
  dispatch(setNotificationPhotoValidation(index, { [photoField]: result }));
  return result.valid;
};

export const isPhotoAltTextValid = (
  index: number,
  language: string,
  notificationExtra: NotificationExtra,
  dispatch: Dispatch<NotificationValidationAction>
): boolean => {
  const { photos } = notificationExtra;
  const photo = photos[index];
  const { altText } = photo;
  const schema = string().max(MAX_LENGTH_PHOTO_DESC, "notification.message.fieldTooLong");
  const result = isValid(schema, altText[language] as string);
  dispatch(setNotificationPhotoAltTextValidation(index, { [language]: result }));
  return result.valid;
};

export const isPageValid = (
  page: number,
  locale: string | undefined,
  notification: NotificationSchema,
  notificationExtra: NotificationExtra,
  dispatch: Dispatch<NotificationValidationAction>
): boolean => {
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
        isContactFieldValid("phone", notification, dispatch),
        isContactFieldValid("email", notification, dispatch),
        isLocationValid(notification, dispatch),
      ];
      const inputValid3 = inputLanguages.map((option) => isWebsiteValid(option, notification, dispatch));
      return inputValid1.every((valid) => valid) && inputValid2.every((valid) => valid) && inputValid3.every((valid) => valid);
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

export const isTipFieldValid = (tipField: string, tip: ChangeRequestSchema, dispatch: Dispatch<NotificationValidationAction>): boolean => {
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
  dispatch(setNotificationTipValidation({ [tipField]: result }));
  return result.valid;
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
