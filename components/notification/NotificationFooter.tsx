import React, { Dispatch, ReactElement, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, IconArrowLeft, IconArrowRight, Notification as HdsNotification } from "hds-react";
import { NotificationAction, NotificationValidationAction } from "../../state/actions/types";
import { setPage } from "../../state/actions/notification";
import { setPageValid } from "../../state/actions/notificationValidation";
import { RootState } from "../../state/reducers";
import { MAX_PAGE } from "../../types/constants";
import validateNotificationData, { isPageValid } from "../../utils/validation";
import styles from "./NotificationFooter.module.scss";

const NotificationFooter = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const dispatchValidation = useDispatch<Dispatch<NotificationValidationAction>>();
  const router = useRouter();

  const currentPage = useSelector((state: RootState) => state.notification.page);
  const currentUser = useSelector((state: RootState) => state.notification.user);
  const notification = useSelector((state: RootState) => state.notification.notification);
  const notificationExtra = useSelector((state: RootState) => state.notification.notificationExtra);

  enum Toast {
    NotAuthenticated = "notAuthenticated",
    ValidationFailed = "validationFailed",
    SaveFailed = "saveFailed",
    SaveSucceeded = "saveSucceeded",
  }
  const [toast, setToast] = useState<Toast>();

  const previousPage = () => {
    dispatch(setPage(currentPage - 1));
  };

  const nextPage = () => {
    if (isPageValid(currentPage, router.locale, notification, notificationExtra, dispatchValidation)) {
      dispatch(setPage(currentPage + 1));
      dispatchValidation(setPageValid(true));
    } else {
      dispatchValidation(setPageValid(false));
    }
  };

  const sendNotification = async () => {
    try {
      const valid = validateNotificationData(notification);

      if (currentUser?.authenticated && valid) {
        // Add the photos to the post data
        // TODO - add the id when available
        const { photos } = notificationExtra;

        const postData = {
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
            setToast(Toast.SaveSucceeded);
          } else {
            setToast(Toast.SaveFailed);
          }
        } else {
          setToast(Toast.SaveFailed);

          // TODO - handle error
          const notificationResult = await createResponse.json();
          console.log("RESPONSE", notificationResult);
          if (notificationResult && notificationResult.data) {
            console.log(notificationResult.data);
          }
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

  const cancelNotification = () => {
    router.push("/");
  };

  const cleanupToast = () => {
    setToast(undefined);
  };

  return (
    <div className={styles.notificationFooter}>
      {currentPage === 1 && (
        <Button variant="secondary" iconLeft={<IconArrowLeft />} onClick={cancelNotification}>
          {i18n.t("notification.button.cancel")}
        </Button>
      )}
      {currentPage > 1 && (
        <Button variant="secondary" iconLeft={<IconArrowLeft />} onClick={previousPage}>
          {i18n.t("notification.button.previous")}
        </Button>
      )}

      <div className="flexSpace" />

      {currentPage < MAX_PAGE && (
        <Button iconRight={<IconArrowRight />} onClick={nextPage}>
          {i18n.t("notification.button.next")}
        </Button>
      )}
      {currentPage === MAX_PAGE && (
        <Button iconRight={<IconArrowRight />} onClick={sendNotification}>
          {i18n.t("notification.button.send")}
        </Button>
      )}

      {toast && (
        <HdsNotification
          position="top-right"
          label={i18n.t(`notification.toast.${toast}.title`)}
          type={toast === Toast.SaveSucceeded ? "success" : "error"}
          closeButtonLabelText={i18n.t("notification.toast.close")}
          onClose={cleanupToast}
          autoClose
          dismissible
        >
          {i18n.t(`notification.toast.${toast}.message`)}
        </HdsNotification>
      )}
    </div>
  );
};

export default NotificationFooter;
