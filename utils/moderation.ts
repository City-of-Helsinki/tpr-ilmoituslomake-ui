import { Dispatch, SetStateAction } from "react";
import { NextRouter } from "next/router";
import Cookies from "js-cookie";
import { Toast } from "../types/constants";
import { ModerationExtra, User } from "../types/general";
import { NotificationSchema } from "../types/notification_schema";
import getOrigin from "./request";

export const approveModeration = async (
  currentUser: User | undefined,
  modifiedTaskId: number,
  modifiedTask: NotificationSchema,
  moderationExtra: ModerationExtra,
  router: NextRouter,
  setToast: Dispatch<SetStateAction<Toast | undefined>>
): Promise<void> => {
  try {
    // TODO - fix notifier validation
    // const valid = validateNotificationData(modifiedTask);
    const valid = true;

    if (currentUser?.authenticated && valid) {
      // Send the Cross Site Request Forgery token, otherwise the backend returns the error "CSRF Failed: CSRF token missing or incorrect."
      const csrftoken = Cookies.get("csrftoken");

      const {
        moderator: { fullName: moderatorName },
      } = moderationExtra;

      // Check if this task has already been assigned to a moderator
      if (moderatorName.length === 0) {
        // Assign the moderation task to the current user
        const assignResponse = await fetch(`${getOrigin(router)}/api/moderation/assign/${modifiedTaskId}/`, {
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

      // Save and approve the moderation task with the possibly modified data
      // Note: this will also make the notificaton data available to normal users
      const approveResponse = await fetch(`${getOrigin(router)}/api/moderation/approve/${modifiedTaskId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken as string,
        },
        mode: "same-origin",
        body: JSON.stringify(postData),
      });
      if (approveResponse.ok) {
        // TODO - handle response
        const approveResult = await approveResponse.json();
        console.log("APPROVE RESPONSE", approveResult);

        if (approveResult.id) {
          // setToast(Toast.SaveSucceeded);

          // TODO - handle page transition
          // router.push(`/moderation/task`);
          router.reload();
        } else {
          setToast(Toast.SaveFailed);
        }
      } else {
        setToast(Toast.SaveFailed);

        // TODO - handle error
        const approveResult = await approveResponse.text();
        console.log("APPROVE FAILED", approveResult);
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
        const assignResponse = await fetch(`${getOrigin(router)}/api/moderation/assign/${modifiedTaskId}/`, {
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
      const rejectResponse = await fetch(`${getOrigin(router)}/api/moderation/reject/${modifiedTaskId}/`, {
        method: "DELETE",
        headers: {
          "X-CSRFToken": csrftoken as string,
        },
      });
      if (rejectResponse.ok) {
        // setToast(Toast.SaveSucceeded);

        // TODO - handle response
        const rejectResult = await rejectResponse.text();
        console.log("REJECT RESPONSE", rejectResult);

        // TODO - handle page transition
        // router.push(`/moderation/task`);
        router.reload();
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

export const deleteModeration = async (
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
        const assignResponse = await fetch(`${getOrigin(router)}/api/moderation/assign/${modifiedTaskId}/`, {
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

      // Delete the moderation task
      const deleteResponse = await fetch(`${getOrigin(router)}/api/moderation/delete/${modifiedTaskId}/`, {
        method: "DELETE",
        headers: {
          "X-CSRFToken": csrftoken as string,
        },
      });
      if (deleteResponse.ok) {
        // setToast(Toast.SaveSucceeded);

        // TODO - handle response
        const deleteResult = await deleteResponse.text();
        console.log("DELETE RESPONSE", deleteResult);

        // TODO - handle page transition
        // router.push(`/moderation/task`);
        router.reload();
      } else {
        setToast(Toast.SaveFailed);

        // TODO - handle error
        const deleteResult = await deleteResponse.text();
        console.log("DELETE FAILED", deleteResult);
      }
    } else {
      setToast(Toast.NotAuthenticated);
    }
  } catch (err) {
    console.log("ERROR", err);
    setToast(Toast.SaveFailed);
  }
};
