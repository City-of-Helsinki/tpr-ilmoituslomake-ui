import { Dispatch } from "react";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { string } from "yup";
import { NotificationValidationAction } from "../state/actions/types";
import {
  setNotificationNameValidation,
  setNotificationShortDescriptionValidation,
  setNotificationLongDescriptionValidation,
  setNotificationTagValidation,
  setNotificationNotifierValidation,
  setNotificationAddressValidation,
  setNotificationContactValidation,
  setNotificationLinkValidation,
  setNotificationPhotoValidation,
  setNotificationPhotoDescriptionValidation,
} from "../state/actions/notificationValidation";
import { MAX_LENGTH_SHORT_DESC, MIN_LENGTH_LONG_DESC, MAX_LENGTH_LONG_DESC, MAX_LENGTH_PHOTO_DESC, PhotoSourceType } from "../types/constants";
import { NotificationSchema } from "../types/notification_schema";
import { NotificationExtra } from "../types/general";
import { PhotoValidation } from "../types/notification_validation";
import notificationSchema from "../schemas/notification_schema.json";

export const isNameValid = (language: string, notification: NotificationSchema, dispatch: Dispatch<NotificationValidationAction>): boolean => {
  const { name: placeName } = notification;
  const schema = string().required();
  const valid = schema.isValidSync(placeName[language]);
  dispatch(setNotificationNameValidation({ [language]: valid }));
  return valid;
};

export const isShortDescriptionValid = (
  language: string,
  notification: NotificationSchema,
  dispatch: Dispatch<NotificationValidationAction>
): boolean => {
  const {
    description: { short: shortDesc },
  } = notification;
  const schema = string().required().max(MAX_LENGTH_SHORT_DESC);
  const valid = schema.isValidSync(shortDesc[language]);
  dispatch(setNotificationShortDescriptionValidation({ [language]: valid }));
  return valid;
};

export const isLongDescriptionValid = (
  language: string,
  notification: NotificationSchema,
  dispatch: Dispatch<NotificationValidationAction>
): boolean => {
  const {
    description: { long: longDesc },
  } = notification;
  const schema = string().required().min(MIN_LENGTH_LONG_DESC).max(MAX_LENGTH_LONG_DESC);
  const valid = schema.isValidSync(longDesc[language]);
  dispatch(setNotificationLongDescriptionValidation({ [language]: valid }));
  return valid;
};

export const isTagValid = (notification: NotificationSchema, dispatch: Dispatch<NotificationValidationAction>): boolean => {
  const { ontology_ids } = notification;
  const valid = ontology_ids.length > 0;
  dispatch(setNotificationTagValidation(valid));
  return valid;
};

const phoneSchema = () => string().matches(/^\+?[0-9- ]+$/, { excludeEmptyString: true });

const postalCodeSchema = () => string().matches(/^[0-9][0-9][0-9][0-9][0-9]$/, { excludeEmptyString: true });

export const isNotifierFieldValid = (
  notifierField: string,
  notificationExtra: NotificationExtra,
  dispatch: Dispatch<NotificationValidationAction>
): boolean => {
  const { notifier } = notificationExtra;
  let schema;
  switch (notifierField) {
    case "email": {
      schema = string().required().email();
      break;
    }
    case "phone": {
      schema = phoneSchema().required();
      break;
    }
    default: {
      schema = string().required();
    }
  }
  const valid = schema.isValidSync(notifier[notifierField]);
  dispatch(setNotificationNotifierValidation({ [notifierField]: valid }));
  return valid;
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
      schema = postalCodeSchema().required();
      break;
    }
    default: {
      schema = string().required();
    }
  }
  const valid = (language === "fi" && schema.isValidSync(fi[addressField])) || (language === "sv" && schema.isValidSync(sv[addressField]));
  dispatch(setNotificationAddressValidation(language, { [addressField]: valid }));
  return valid;
};

export const isContactFieldValid = (
  contactField: string,
  notification: NotificationSchema,
  dispatch: Dispatch<NotificationValidationAction>
): boolean => {
  const { phone, email } = notification;
  let valid;
  switch (contactField) {
    case "phone": {
      const schema = phoneSchema();
      valid = schema.isValidSync(phone);
      break;
    }
    case "email": {
      const schema = string().email();
      valid = schema.isValidSync(email);
      break;
    }
    default: {
      valid = true;
    }
  }
  dispatch(setNotificationContactValidation({ [contactField]: valid }));
  return valid;
};

export const isWebsiteValid = (language: string, notification: NotificationSchema, dispatch: Dispatch<NotificationValidationAction>): boolean => {
  const { website } = notification;
  const schema = string().url();
  const valid = schema.isValidSync(website[language]);
  dispatch(setNotificationLinkValidation({ [language]: valid }));
  return valid;
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
      schema = photo.sourceType === PhotoSourceType.Link ? string().required().url() : string().required();
      break;
    }
    default: {
      schema = string().required();
    }
  }
  const valid = schema.isValidSync(photo[photoField]);
  dispatch(setNotificationPhotoValidation(index, { [photoField]: valid }));
  return valid;
};

export const isPhotoDescriptionValid = (
  index: number,
  language: string,
  notificationExtra: NotificationExtra,
  dispatch: Dispatch<NotificationValidationAction>
): boolean => {
  const { photos } = notificationExtra;
  const photo = photos[index];
  const { description } = photo;
  const schema = string().max(MAX_LENGTH_PHOTO_DESC);
  const valid = schema.isValidSync(description[language]);
  dispatch(setNotificationPhotoDescriptionValidation(index, { [language]: valid }));
  return valid;
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
        isTagValid(notification, dispatch),
        isNotifierFieldValid("fullName", notificationExtra, dispatch),
        isNotifierFieldValid("email", notificationExtra, dispatch),
        isNotifierFieldValid("phone", notificationExtra, dispatch),
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
            ]
          : [
              isAddressFieldValid("fi", "street", notification, dispatch),
              isAddressFieldValid("fi", "postal_code", notification, dispatch),
              isAddressFieldValid("fi", "post_office", notification, dispatch),
            ];
      const inputValid2 = [isContactFieldValid("phone", notification, dispatch), isContactFieldValid("email", notification, dispatch)];
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
        ];
        const photoValid2 = inputLanguages.flatMap((option) => [isPhotoDescriptionValid(index, option, notificationExtra, dispatch)]);
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
