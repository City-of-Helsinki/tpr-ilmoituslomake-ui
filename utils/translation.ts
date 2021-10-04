import { Dispatch, SetStateAction } from "react";
import { NextRouter } from "next/router";
import Cookies from "js-cookie";
import { TranslationAction } from "../state/actions/translationTypes";
import { Toast } from "../types/constants";
import { TranslationExtra, User } from "../types/general";
import { NotificationSchema } from "../types/notification_schema";
import { TranslationSchema } from "../types/translation_schema";
import getOrigin from "./request";
import { isTranslationTaskPageValid } from "./translationValidation";

export const saveTranslation = async (
  currentUser: User | undefined,
  translatedTaskId: number,
  selectedTask: NotificationSchema,
  translatedTask: TranslationSchema,
  translationExtra: TranslationExtra,
  draft: boolean,
  router: NextRouter,
  dispatchValidation: Dispatch<TranslationAction>,
  setToast: Dispatch<SetStateAction<Toast | undefined>>
): Promise<void> => {
  try {
    const valid = isTranslationTaskPageValid("translation", selectedTask, translatedTask, translationExtra, dispatchValidation);

    if (currentUser?.authenticated && (draft || valid)) {
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
