import { Dispatch, SetStateAction } from "react";
import { NextRouter } from "next/router";
import Cookies from "js-cookie";
import { Toast } from "../types/constants";
import { ModerationExtra, NotificationExtra, User } from "../types/general";
import { NotificationSchema } from "../types/notification_schema";
import validateNotificationData from "./validation";

export const saveNotification = async (
  currentUser: User | undefined,
  notificationId: number,
  notification: NotificationSchema,
  notificationExtra: NotificationExtra,
  router: NextRouter,
  setToast: Dispatch<SetStateAction<Toast | undefined>>
): Promise<void> => {
  try {
    const valid = validateNotificationData(notification);

    if (currentUser?.authenticated && valid) {
      // Include all the notification details and also the photos in the post data
      // The notification id is only included if it has a value, and is used for modifying existing notifications
      const { photos } = notificationExtra;

      const postData = {
        ...(notificationId > 0 && { id: notificationId }),
        data: {
          ...notification,
          images: photos.map((photo, index) => {
            const { sourceType: source_type, url, altText: alt_text, permission, source } = photo;
            return { index, source_type, url, alt_text, permission, source };
          }),
        },
        images: photos
          .map((photo, index) => {
            const { base64 } = photo;
            return { index, base64 };
          })
          .filter((photo) => photo.base64 && photo.base64.length > 0),
      };

      console.log("SENDING", postData);

      const createResponse = await fetch("/api/notification/create/", {
        method: "POST",
        // method: notificationId > 0 ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      if (createResponse.ok) {
        const notificationResult = await createResponse.json();

        // TODO - handle response
        console.log("RESPONSE", notificationResult);

        if (notificationResult.id) {
          // setToast(Toast.SaveSucceeded);
          router.push(`/notification/sent/${notificationResult.id}`);
        } else {
          setToast(Toast.SaveFailed);
        }
      } else {
        setToast(Toast.SaveFailed);

        // TODO - handle error
        const notificationResult = await createResponse.text();
        console.log("FAILED", notificationResult);
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

export const saveModeration = async (
  currentUser: User | undefined,
  modifiedTaskId: number,
  modifiedTask: NotificationSchema,
  moderationExtra: ModerationExtra,
  setToast: Dispatch<SetStateAction<Toast | undefined>>
): Promise<void> => {
  try {
    const valid = validateNotificationData(modifiedTask);

    if (currentUser?.authenticated && valid) {
      // Send the Cross Site Request Forgery token, otherwise the backend returns the error "CSRF Failed: CSRF token missing or incorrect."
      const csrftoken = Cookies.get("csrftoken");

      const {
        moderator: { fullName: moderatorName },
      } = moderationExtra;

      // Check if this task has already been assigned to a moderator
      if (moderatorName.length === 0) {
        // Assign the moderation task to the current user
        const assignResponse = await fetch(`/api/moderation/assign/${modifiedTaskId}/`, {
          method: "PUT",
          headers: {
            "X-CSRFToken": csrftoken as string,
          },
        });
        if (assignResponse.ok) {
          const assignResult = await assignResponse.json();

          // TODO - handle response
          console.log("ASSIGN RESPONSE", assignResult);
        } else {
          setToast(Toast.SaveFailed);

          // TODO - handle error
          const assignResult = await assignResponse.text();
          console.log("ASSIGN FAILED", assignResult);
        }
      }

      // TODO - handle photos
      const postData = {
        data: { ...modifiedTask },
      };

      console.log("SENDING", postData);

      // Save the moderation task with the possibly modified data
      const createResponse = await fetch(`/api/moderation/todos/${modifiedTaskId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken as string,
        },
        mode: "same-origin",
        body: JSON.stringify(postData),
      });
      if (createResponse.ok) {
        const moderationResult = await createResponse.json();

        // TODO - handle response
        console.log("SAVE RESPONSE", moderationResult);

        if (moderationResult.id) {
          setToast(Toast.SaveSucceeded);
        } else {
          setToast(Toast.SaveFailed);
        }
      } else {
        setToast(Toast.SaveFailed);

        // TODO - handle error
        const moderationResult = await createResponse.text();
        console.log("SAVE FAILED", moderationResult);
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
