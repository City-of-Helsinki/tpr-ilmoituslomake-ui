import { Dispatch, SetStateAction } from "react";
import { NextRouter } from "next/router";
import Cookies from "js-cookie";
import { ModerationTranslationAction } from "../state/actions/moderationTranslationTypes";
import { TranslationAction } from "../state/actions/translationTypes";
import { ItemType, Toast } from "../types/constants";
import {
  ChangeRequestSchema,
  ModerationExtra,
  ModerationTranslationRequest,
  Photo,
  PhotoTranslation,
  TranslationExtra,
  User,
} from "../types/general";
import { NotificationSchema } from "../types/notification_schema";
import { TranslationSchema } from "../types/translation_schema";
import { isModerationTranslationRequestPageValid } from "./moderationValidation";
import { isTranslationTaskPageValid } from "./translationValidation";
import getOrigin from "./request";

export const approveModeration = async (
  currentUser: User | undefined,
  modifiedTaskId: number,
  approvedTask: NotificationSchema,
  approvedPhotos: Photo[],
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
          const assignResult = await assignResponse.json();
          console.log("ASSIGN RESPONSE", assignResult);
        } else {
          setToast(Toast.SaveFailed);

          const assignResult = await assignResponse.text();
          console.log("ASSIGN FAILED", assignResult);
        }
      }

      const postData = {
        data: {
          ...approvedTask,
          images: approvedPhotos.map((photo, index) => {
            const { uuid, sourceType: source_type, url, altText: alt_text, permission, source } = photo;
            return { index, uuid, source_type, url, alt_text, permission, source };
          }),
        },
        images: approvedPhotos.map((photo, index) => {
          const { uuid, url, preview, base64 } = photo;
          return { index, uuid, url: photo.new ? url : preview, ...(photo.new && { base64 }) };
        }),
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
        const approveResult = await approveResponse.json();
        console.log("APPROVE RESPONSE", approveResult);

        if (approveResult.id) {
          // Reload the current page to update the page statuses
          // router.reload();
          router.push(`/moderation/task/${modifiedTaskId}`);
          setToast(Toast.SaveSucceeded);
        } else {
          setToast(Toast.SaveFailed);
        }
      } else {
        setToast(Toast.SaveFailed);

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
          const assignResult = await assignResponse.json();
          console.log("ASSIGN RESPONSE", assignResult);
        } else {
          setToast(Toast.SaveFailed);

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
        const rejectResult = await rejectResponse.text();
        console.log("REJECT RESPONSE", rejectResult);

        // Reload the current page to update the page statuses
        // router.reload();
        router.push(`/moderation/task/${modifiedTaskId}`);
        setToast(Toast.RejectSucceeded);
      } else {
        setToast(Toast.SaveFailed);

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
          const assignResult = await assignResponse.json();
          console.log("ASSIGN RESPONSE", assignResult);
        } else {
          setToast(Toast.SaveFailed);

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
        const deleteResult = await deleteResponse.text();
        console.log("DELETE RESPONSE", deleteResult);

        // Reload the current page to update the page statuses
        // router.reload();
        router.push(`/moderation/task/${modifiedTaskId}`);
        setToast(Toast.DeleteSucceeded);
      } else {
        setToast(Toast.SaveFailed);

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

export const saveModerationChangeRequest = async (
  tip: ChangeRequestSchema,
  router: NextRouter,
  setToast: Dispatch<SetStateAction<Toast | undefined>>
): Promise<void> => {
  try {
    // TODO - fix notifier validation
    // const valid = validateNotificationData(modifiedTask);
    const valid = true;

    if (valid) {
      // Send the Cross Site Request Forgery token, otherwise the backend returns the error "CSRF Failed: CSRF token missing or incorrect."
      const csrftoken = Cookies.get("csrftoken");

      // If the tip is about a new place, use a null target id
      const { item_type, target } = tip;
      const postData = { ...tip, target: item_type === ItemType.ChangeRequestAdd ? null : target };

      console.log("SENDING", postData);

      const changeRequestResponse = await fetch(`${getOrigin(router)}/api/moderation/moderator_edit/`, {
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

        if (changeRequestResult.id) {
          // Redirect to the task page showing the new change request already in edit mode
          // 21.6.2021 - Separate edit mode not used anymore due to changes to the moderation workflow, but left here in case needed later
          // router.push(`/moderation/task/${changeRequestResult.id}/?edit=1`);
          router.push(`/moderation/task/${changeRequestResult.id}`);
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

export const saveModerationTranslationRequest = async (
  currentUser: User | undefined,
  requestDetail: ModerationTranslationRequest,
  router: NextRouter,
  dispatchValidation: Dispatch<ModerationTranslationAction>,
  setToast: Dispatch<SetStateAction<Toast | undefined>>
): Promise<void> => {
  try {
    const valid = isModerationTranslationRequestPageValid(requestDetail, dispatchValidation);

    if (currentUser?.authenticated && valid) {
      // Send the Cross Site Request Forgery token, otherwise the backend returns the error "CSRF Failed: CSRF token missing or incorrect."
      const csrftoken = Cookies.get("csrftoken");

      const { requestId, selectedPlaces, language, message, translator } = requestDetail;

      const postData = {
        ...(requestId > 0 && { id: requestId }),
        // request,
        // draft,
        targets: selectedPlaces.map((place) => place.id),
        language,
        message,
        translator,
      };

      console.log("SENDING", postData);

      // Save the translation request
      const saveResponse = await fetch(`${getOrigin(router)}/api/moderation_translation/save_request/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken as string,
        },
        mode: "same-origin",
        body: JSON.stringify(postData),
      });
      if (saveResponse.ok) {
        const saveResult = await saveResponse.json();
        console.log("SAVE RESPONSE", saveResult);

        if (saveResult.id) {
          // Reload the current page to update the page statuses
          // router.reload();
          router.push(`/moderation/translation/request/${saveResult.id}`);
          setToast(Toast.SaveSucceeded);
        } else {
          setToast(Toast.SaveFailed);
        }
      } else {
        setToast(Toast.SaveFailed);

        const saveResult = await saveResponse.text();
        console.log("SAVE FAILED", saveResult);
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

export const cancelModerationTranslationRequest = async (
  currentUser: User | undefined,
  requestId: number,
  router: NextRouter,
  setToast: Dispatch<SetStateAction<Toast | undefined>>
): Promise<void> => {
  try {
    const valid = true;

    if (currentUser?.authenticated && valid) {
      // Send the Cross Site Request Forgery token, otherwise the backend returns the error "CSRF Failed: CSRF token missing or incorrect."
      const csrftoken = Cookies.get("csrftoken");

      // Cancel the translation request
      const cancelResponse = await fetch(`${getOrigin(router)}/api/moderation_translation/cancel_request/${requestId}/`, {
        method: "DELETE",
        headers: {
          "X-CSRFToken": csrftoken as string,
        },
      });
      if (cancelResponse.ok) {
        const cancelResult = await cancelResponse.json();
        console.log("CANCEL RESPONSE", cancelResult);

        if (cancelResult.id) {
          // Reload the current page to update the page statuses
          // router.reload();
          router.push(`/moderation/translation/request/${requestId}`);
          setToast(Toast.SaveSucceeded);
        } else {
          setToast(Toast.SaveFailed);
        }
      } else {
        setToast(Toast.SaveFailed);

        const saveResult = await cancelResponse.text();
        console.log("CANCEL FAILED", saveResult);
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

export const saveModerationTranslation = async (
  currentUser: User | undefined,
  translatedTaskId: number,
  translatedTask: TranslationSchema,
  translationExtra: TranslationExtra,
  draft: boolean,
  router: NextRouter,
  dispatchValidation: Dispatch<TranslationAction>,
  setToast: Dispatch<SetStateAction<Toast | undefined>>
): Promise<void> => {
  try {
    const valid = isTranslationTaskPageValid("moderation", translatedTask, translationExtra, dispatchValidation);

    if (currentUser?.authenticated && valid) {
      // Send the Cross Site Request Forgery token, otherwise the backend returns the error "CSRF Failed: CSRF token missing or incorrect."
      const csrftoken = Cookies.get("csrftoken");

      const { photosTranslated } = translationExtra;

      const postData = {
        draft,
        data: {
          ...translatedTask,
          images: photosTranslated.map((photo, index) => {
            const { uuid, altText: alt_text, source } = photo;
            return { index, uuid, alt_text, source };
          }),
        },
      };

      console.log("SENDING", postData);

      // Save the translation task
      const saveResponse = await fetch(`${getOrigin(router)}/api/moderation/translation/save_task/${translatedTaskId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken as string,
        },
        mode: "same-origin",
        body: JSON.stringify(postData),
      });
      if (saveResponse.ok) {
        const saveResult = await saveResponse.json();
        console.log("SAVE RESPONSE", saveResult);

        if (saveResult.id) {
          // Reload the current page to update the page statuses
          // router.reload();
          router.push(`/moderation/translation/task/${translatedTaskId}`);
          setToast(Toast.SaveSucceeded);
        } else {
          setToast(Toast.SaveFailed);
        }
      } else {
        setToast(Toast.SaveFailed);

        const saveResult = await saveResponse.text();
        console.log("SAVE FAILED", saveResult);
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
