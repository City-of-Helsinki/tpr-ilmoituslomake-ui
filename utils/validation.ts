import { Dispatch } from "react";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { NotificationValidationAction } from "../state/actions/types";
import {
  setNotificationNameValidation,
  setNotificationShortDescriptionValidation,
  setNotificationLongDescriptionValidation,
  setNotificationTagValidation,
  setNotificationNotifierValidation,
  setNotificationAddressValidation,
  setNotificationPhotoValidation,
} from "../state/actions/notificationValidation";
import { MAX_LENGTH_SHORT_DESC, MIN_LENGTH_LONG_DESC, MAX_LENGTH_LONG_DESC } from "../types/constants";
import { NotificationSchema } from "../types/notification_schema";
import { NotificationExtra } from "../types/general";
import { PhotoValidation } from "../types/notification_validation";
import notificationSchema from "../schemas/notification_schema.json";

export const isNameValid = (language: string, notification: NotificationSchema, dispatch: Dispatch<NotificationValidationAction>): boolean => {
  const { name: placeName } = notification;
  const valid = (placeName[language] as string).length > 0;
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
  const valid = (shortDesc[language] as string).length > 0 && (shortDesc[language] as string).length <= MAX_LENGTH_SHORT_DESC;
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
  const valid = (longDesc[language] as string).length >= MIN_LENGTH_LONG_DESC && (longDesc[language] as string).length <= MAX_LENGTH_LONG_DESC;
  dispatch(setNotificationLongDescriptionValidation({ [language]: valid }));
  return valid;
};

export const isTagValid = (notification: NotificationSchema, dispatch: Dispatch<NotificationValidationAction>): boolean => {
  const { ontology_ids } = notification;
  const valid = ontology_ids.length > 0;
  dispatch(setNotificationTagValidation(valid));
  return valid;
};

export const isNotifierFieldValid = (
  notifierField: string,
  notificationExtra: NotificationExtra,
  dispatch: Dispatch<NotificationValidationAction>
): boolean => {
  const { notifier } = notificationExtra;
  const valid = (notifier[notifierField] as string).length > 0;
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
  const valid = (language === "fi" && (fi[addressField] as string).length > 0) || (language === "sv" && (sv[addressField] as string).length > 0);
  dispatch(setNotificationAddressValidation(language, { [addressField]: valid }));
  return valid;
};

export const isPhotoValid = (notificationExtra: NotificationExtra, dispatch: Dispatch<NotificationValidationAction>): PhotoValidation[] => {
  const { photos } = notificationExtra;
  const photosValid = photos.map((photo) => {
    const { url, permission } = photo;
    const urlValid = url.length > 0;
    return { url: urlValid, permission };
  });
  dispatch(setNotificationPhotoValidation(photosValid));
  return photosValid;
};

export const isPhotoUrlValid = (index: number, notificationExtra: NotificationExtra, dispatch: Dispatch<NotificationValidationAction>): boolean => {
  const photosValid = isPhotoValid(notificationExtra, dispatch);
  return photosValid[index].url;
};

export const isPageValid = (
  page: number,
  locale: string | undefined,
  notification: NotificationSchema,
  notificationExtra: NotificationExtra,
  dispatch: Dispatch<NotificationValidationAction>
): boolean => {
  // Check whether all data on the specific page is valid
  // Everything needs to be validated, so make sure lazy evaluation is not used
  switch (page) {
    case 1: {
      // Basic
      const { inputLanguages } = notificationExtra;
      const inputValid1 = inputLanguages.map((option) => {
        const v1 = isNameValid(option, notification, dispatch);
        const v2 = isShortDescriptionValid(option, notification, dispatch);
        const v3 = isLongDescriptionValid(option, notification, dispatch);
        return v1 && v2 && v3;
      });
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
      const inputValid =
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
      return inputValid.every((valid) => valid);
    }
    case 3: {
      // Photos
      const photosValid = isPhotoValid(notificationExtra, dispatch);
      return photosValid.every((valid) => valid.url && valid.permission);
    }
    default: {
      // Payments
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
