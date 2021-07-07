import { Dispatch, SetStateAction } from "react";
import { NextRouter } from "next/router";
import Cookies from "js-cookie";
import { Toast } from "../types/constants";
import { PhotoTranslation, User } from "../types/general";
import { TranslationSchema } from "../types/translation_schema";
import getOrigin from "./request";

export const saveTranslation = async (
  currentUser: User | undefined,
  translatedTaskId: number,
  translatedTask: TranslationSchema,
  translatedPhotos: PhotoTranslation[],
  draft: boolean,
  router: NextRouter,
  setToast: Dispatch<SetStateAction<Toast | undefined>>
): Promise<void> => {
  try {
    // TODO - fix validation
    // const valid = validateTranslationData(translatedTask);
    const valid = true;

    if (currentUser?.authenticated && valid) {
      // Send the Cross Site Request Forgery token, otherwise the backend returns the error "CSRF Failed: CSRF token missing or incorrect."
      const csrftoken = Cookies.get("csrftoken");

      const postData = {
        draft,
        data: {
          ...translatedTask,
          images: translatedPhotos.map((photo, index) => {
            const { uuid, sourceType: source_type, url, altText: alt_text, permission, source } = photo;
            return { index, uuid, source_type, url, alt_text, permission, source };
          }),
        },
      };

      console.log("SENDING", postData);

      // Save and approve the moderation task with the possibly modified data
      // Note: this will also make the notificaton data available to normal users
      const saveResponse = await fetch(`${getOrigin(router)}/api/translation/save/${translatedTaskId}/`, {
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
          router.push(`/translation/task/${translatedTaskId}`);
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

export default saveTranslation;
