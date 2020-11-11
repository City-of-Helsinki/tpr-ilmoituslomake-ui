import React, { Dispatch, ReactElement, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, IconArrowLeft, IconArrowRight, Notification as HdsNotification } from "hds-react";
import { NotificationAction } from "../../state/actions/types";
import { setPage } from "../../state/actions/notification";
import { RootState } from "../../state/reducers";
import { MAX_PAGE } from "../../types/constants";
import validateNotificationData from "../../utils/validation";
import styles from "./Footer.module.scss";

const Footer = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const router = useRouter();

  const currentPage = useSelector((state: RootState) => state.notification.page);
  const notification = useSelector((state: RootState) => state.notification.notification);

  enum Toast {
    ValidationFailed = "validationFailed",
    SaveFailed = "saveFailed",
    SaveSucceeded = "saveSucceeded",
  }
  const [toast, setToast] = useState<Toast>();

  const previousPage = () => {
    dispatch(setPage(currentPage - 1));
  };

  const nextPage = () => {
    dispatch(setPage(currentPage + 1));
  };

  const sendNotification = async () => {
    try {
      const valid = validateNotificationData(notification);

      if (valid) {
        console.log("SENDING", notification);

        const createRequest = await fetch("/api/notification/create/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: notification }),
        });
        const createResponse = await createRequest.json();

        // TODO - handle response
        console.log("RESPONSE", createResponse);

        setToast(Toast.SaveSucceeded);
      } else {
        setToast(Toast.ValidationFailed);
      }
    } catch (err) {
      console.log("ERROR", err);
      setToast(Toast.SaveFailed);
    }
  };

  const cancelNotification = () => {
    router.push("/", "/");
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

      <div className={styles.space} />

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

export default Footer;
