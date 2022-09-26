import { Dispatch, SetStateAction } from "react";
import { NextRouter } from "next/router";
import Cookies from "js-cookie";
import { NotificationAction } from "../state/actions/notificationTypes";
import { NotificationValidationAction } from "../state/actions/notificationValidationTypes";
import { setPage, setSentNotification } from "../state/actions/notification";
import { ItemType, Toast, SENT_INFO_PAGE } from "../types/constants";
import { ChangeRequestSchema, NotificationExtra, User } from "../types/general";
import { NotificationSchema } from "../types/notification_schema";
// import { getDisplayName } from "./helper";
// import { defaultLocale } from "./i18n";
import getOrigin from "./request";
import getTrimmedNotification from "./trim";
import validateNotificationData, { isTipPageValid } from "./validation";

export const saveNotification = async (
  currentUser: User | undefined,
  notificationId: number,
  notificationBeforeTrim: NotificationSchema,
  notificationExtra: NotificationExtra,
  router: NextRouter,
  dispatch: Dispatch<NotificationAction>,
  setToast?: Dispatch<SetStateAction<Toast | undefined>>
): Promise<void> => {
  try {
    // Trim all fields to avoid validation errors due to whitespace
    const notification = getTrimmedNotification(notificationBeforeTrim);

    // Validate using an empty opening_times object for now until the Hauki development is ready
    const valid = validateNotificationData({ ...notification, opening_times: {} });

    if (currentUser?.authenticated && valid) {
      // Send the Cross Site Request Forgery token, otherwise the backend returns the error "CSRF Failed: CSRF token missing or incorrect."
      const csrftoken = Cookies.get("csrftoken");

      // Include all the notification details and also the photos in the post data
      // The photo metadata for all photos is in the data part, but only new images are included in the images part
      // The notification id is only included if it has a value, and is used for modifying existing notifications
      const { photos } = notificationExtra;

      // Force opening_times to be an empty object for now until the Hauki development is ready
      const postData = {
        ...(notificationId > 0 && { id: notificationId }),
        data: {
          ...notification,
          images: photos.map((photo, index) => {
            const { uuid, sourceType: source_type, url, altText: alt_text, permission, source, mediaId: media_id } = photo;
            return { index, uuid, source_type, url, alt_text, permission, source, media_id };
          }),
          opening_times: {},
        },
        images: photos.map((photo, index) => {
          const { uuid, url, base64 } = photo;
          return { index, uuid, url, ...(photo.new && { base64 }) };
        }),
      };

      console.log("SENDING", postData);

      const createResponse = await fetch(`${getOrigin(router)}/api/notification/create/`, {
        method: "POST",
        // method: notificationId > 0 ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken as string,
        },
        body: JSON.stringify(postData),
      });
      if (createResponse.ok) {
        const notificationResult = await (createResponse.json() as Promise<{ id: number; data: NotificationSchema; hauki_id: number }>);
        console.log("RESPONSE", notificationResult);

        if (notificationResult.id) {
          // NOTE: since the notification has been sent to moderation, the data is not available yet for normal users
          // So show the info from the response in the same page instead of redirecting to the 'sent' page
          // router.push(`/notification/sent/${notificationResult.id}`);
          const { images, ...dataToUse } = notificationResult.data;
          const sentNotification = {
            ...notification,
            ...dataToUse,
          } as NotificationSchema;
          const sentNotificationExtra = {
            ...notificationExtra,
            photos: images.map((image) => {
              return {
                uuid: image.uuid ?? "",
                sourceType: image.source_type,
                url: image.url,
                altText: {
                  fi: image.alt_text.fi ?? "",
                  sv: image.alt_text.sv ?? "",
                  en: image.alt_text.en ?? "",
                },
                permission: image.permission,
                source: image.source,
                mediaId: image.media_id ?? "",
                base64: "",
                preview: image.url,
              };
            }),
          } as NotificationExtra;
          const openingTimesId = notificationResult.hauki_id;
          const isNew = notificationId <= 0;
          const openingTimesNotificationId = isNew ? notificationResult.id : notificationId;

          dispatch(
            setSentNotification(notificationResult.id, sentNotification, sentNotificationExtra, openingTimesId, openingTimesNotificationId, isNew)
          );
          dispatch(setPage(SENT_INFO_PAGE));
        } else if (setToast) {
          setToast(Toast.SaveFailed);
        }
      } else {
        if (setToast) {
          setToast(Toast.SaveFailed);
        }

        const notificationResult = await createResponse.text();
        console.log("FAILED", notificationResult);
      }
    } else if (!valid && setToast) {
      setToast(Toast.ValidationFailed);
    } else if (setToast) {
      setToast(Toast.NotAuthenticated);
    }
  } catch (err) {
    console.log("ERROR", err);
    if (setToast) {
      setToast(Toast.SaveFailed);
    }
  }
};

export const saveTip = async (
  tip: ChangeRequestSchema,
  router: NextRouter,
  dispatchValidation: Dispatch<NotificationValidationAction>,
  setToast: Dispatch<SetStateAction<Toast | undefined>>
): Promise<void> => {
  try {
    const valid = isTipPageValid(tip, dispatchValidation);

    if (valid) {
      // Send the Cross Site Request Forgery token, otherwise the backend returns the error "CSRF Failed: CSRF token missing or incorrect."
      const csrftoken = Cookies.get("csrftoken");

      // If the tip is about a new place, use a null target id
      const { item_type, target } = tip;
      const postData = { ...tip, target: item_type === ItemType.ChangeRequestAdd ? null : target };

      console.log("SENDING", postData);

      const changeRequestResponse = await fetch(`${getOrigin(router)}/api/change_request/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken as string,
        },
        body: JSON.stringify(postData),
      });
      if (changeRequestResponse.ok) {
        const changeRequestResult = await changeRequestResponse.json();
        console.log("RESPONSE", changeRequestResult);

        if (changeRequestResult.item_type === ItemType.ChangeRequestAdd || changeRequestResult.target) {
          // Redirect to the 'sent' page
          router.push("/tip/sent");
        } else {
          setToast(Toast.SaveFailed);
        }
      } else {
        setToast(Toast.SaveFailed);

        const changeRequestResult = await changeRequestResponse.text();
        console.log("FAILED", changeRequestResult);
      }
    } else if (!valid) {
      setToast(Toast.ValidationFailed);
    } else {
      setToast(Toast.NotAuthenticated);
    }
  } catch (err) {
    console.log("ERROR", err);
    setToast(Toast.SaveFailed);
  }
};

export const getOpeningTimesLink = async (
  notificationId: number,
  notification: NotificationSchema,
  openingTimesId: number,
  isNew: boolean,
  router: NextRouter
): Promise<string | undefined> => {
  try {
    // Send the Cross Site Request Forgery token, otherwise the backend returns the error "CSRF Failed: CSRF token missing or incorrect."
    const csrftoken = Cookies.get("csrftoken");

    const {
      name: { fi: nameFi, sv: nameSv, en: nameEn },
      description: {
        short: { fi: shortDescFi, sv: shortDescSv, en: shortDescEn },
      },
      address: {
        fi: { street: streetFi, postal_code: postalCodeFi, post_office: postOfficeFi },
        sv: { street: streetSv, postal_code: postalCodeSv, post_office: postOfficeSv },
      },
    } = notification;

    const postData = {
      name: {
        fi: nameFi,
        sv: nameSv,
        en: nameEn,
      },
      description: {
        fi: shortDescFi,
        sv: shortDescSv,
        en: shortDescEn,
      },
      address: {
        fi: streetFi.length > 0 ? `${streetFi}, ${postalCodeFi} ${postOfficeFi}` : "",
        sv: streetSv.length > 0 ? `${streetSv}, ${postalCodeSv} ${postOfficeSv}` : "",
        en: streetFi.length > 0 ? `${streetFi}, ${postalCodeFi} ${postOfficeFi}` : "",
      },
      resource_type: "unit",
      origins: [
        {
          data_source: {
            id: "kaupunkialusta",
          },
          origin_id: notificationId,
        },
      ],
      is_public: true,
      timezone: "Europe/Helsinki",
      hauki_id: openingTimesId,
      published: !isNew,
    };

    console.log("SENDING", postData);

    const openingTimesResponse = await fetch(`${getOrigin(router)}/api/openingtimes/createlink/${notificationId}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken as string,
      },
      body: JSON.stringify(postData),
    });

    const openingTimesResult = await openingTimesResponse.text();
    if (openingTimesResponse.ok) {
      console.log("RESPONSE", openingTimesResult);
    } else {
      console.log("FAILED", openingTimesResult);
    }
    return openingTimesResult;
  } catch (err) {
    console.log("ERROR", err);
    return undefined;
  }
};
