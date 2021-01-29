import { Dispatch, SetStateAction } from "react";
import { NextRouter } from "next/router";
import Cookies from "js-cookie";
import { NotificationValidationAction } from "../state/actions/types";
import { Toast } from "../types/constants";
import { ChangeRequestSchema, ModerationExtra, NotificationExtra, User } from "../types/general";
import { NotificationSchema } from "../types/notification_schema";
import validateNotificationData, { isTipPageValid } from "./validation";

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
      // Send the Cross Site Request Forgery token, otherwise the backend returns the error "CSRF Failed: CSRF token missing or incorrect."
      const csrftoken = Cookies.get("csrftoken");

      // Include all the notification details and also the photos in the post data
      // The photo metadata for all photos is in the data part, but only new images are included in the images part
      // The notification id is only included if it has a value, and is used for modifying existing notifications
      const { photos } = notificationExtra;

      const postData = {
        ...(notificationId > 0 && { id: notificationId }),
        data: {
          ...notification,
          images: photos.map((photo, index) => {
            const { uuid, sourceType: source_type, url, altText: alt_text, permission, source } = photo;
            return { index, uuid, source_type, url, alt_text, permission, source };
          }),
        },
        images: photos
          .filter((photo) => photo.new)
          .map((photo, index) => {
            const { uuid, url, base64 } = photo;
            return { index, uuid, url, base64 };
          }),
      };

      console.log("SENDING", postData);

      const createResponse = await fetch("/api/notification/create/", {
        method: "POST",
        // method: notificationId > 0 ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken as string,
        },
        body: JSON.stringify(postData),
      });
      if (createResponse.ok) {
        // TODO - handle response
        const notificationResult = await createResponse.json();
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

      const postData = tip;

      console.log("SENDING", postData);

      const changeRequestResponse = await fetch("/api/change_request/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken as string,
        },
        body: JSON.stringify(postData),
      });
      if (changeRequestResponse.ok) {
        // TODO - handle response
        const changeRequestResult = await changeRequestResponse.json();
        console.log("RESPONSE", changeRequestResult);

        if (changeRequestResult.target) {
          // setToast(Toast.SaveSucceeded);
          router.push("/tip/sent");
        } else {
          setToast(Toast.SaveFailed);
        }
      } else {
        setToast(Toast.SaveFailed);

        // TODO - handle error
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

export const saveModeration = async (
  currentUser: User | undefined,
  modifiedTaskId: number,
  modifiedTask: NotificationSchema,
  moderationExtra: ModerationExtra,
  router: NextRouter,
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
          // TODO - handle response
          const assignResult = await assignResponse.json();
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
        // TODO - handle response
        const moderationResult = await createResponse.json();
        console.log("SAVE RESPONSE", moderationResult);

        if (moderationResult.id) {
          setToast(Toast.SaveSucceeded);

          // TODO - handle page transition
          // router.push(`/moderation/task`);
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

export const rejectModeration = async (
  currentUser: User | undefined,
  modifiedTaskId: number,
  moderationExtra: ModerationExtra,
  router: NextRouter,
  setToast: Dispatch<SetStateAction<Toast | undefined>>
): Promise<void> => {
  try {
    if (currentUser?.authenticated) {
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
          // TODO - handle response
          const assignResult = await assignResponse.json();
          console.log("ASSIGN RESPONSE", assignResult);
        } else {
          setToast(Toast.SaveFailed);

          // TODO - handle error
          const assignResult = await assignResponse.text();
          console.log("ASSIGN FAILED", assignResult);
        }
      }

      // Reject the moderation task
      const rejectResponse = await fetch(`/api/moderation/reject/${modifiedTaskId}/`, {
        method: "DELETE",
        headers: {
          "X-CSRFToken": csrftoken as string,
        },
      });
      if (rejectResponse.ok) {
        setToast(Toast.SaveSucceeded);

        // TODO - handle response
        const rejectResult = await rejectResponse.text();
        console.log("REJECT RESPONSE", rejectResult);
      } else {
        setToast(Toast.SaveFailed);

        // TODO - handle error
        const rejectResult = await rejectResponse.text();
        console.log("REJECT FAILED", rejectResult);
      }
    } else {
      setToast(Toast.NotAuthenticated);
    }
  } catch (err) {
    console.log("ERROR", err);
    setToast(Toast.SaveFailed);
  }
};
