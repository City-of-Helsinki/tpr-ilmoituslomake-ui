import React, { Dispatch, ReactElement, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, IconArrowLeft, IconArrowRight } from "hds-react";
import { NotificationAction, NotificationValidationAction } from "../../state/actions/types";
import { setPage } from "../../state/actions/notification";
import { setPageValid } from "../../state/actions/notificationValidation";
import { RootState } from "../../state/reducers";
import { MAX_PAGE, Toast } from "../../types/constants";
import { saveNotification } from "../../utils/save";
import { isPageValid } from "../../utils/validation";
import ToastNotification from "../common/ToastNotification";
import styles from "./NotificationFooter.module.scss";

const NotificationFooter = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const dispatchValidation = useDispatch<Dispatch<NotificationValidationAction>>();
  const router = useRouter();

  const currentPage = useSelector((state: RootState) => state.notification.page);
  const currentUser = useSelector((state: RootState) => state.general.user);
  const notificationId = useSelector((state: RootState) => state.notification.notificationId);
  const notification = useSelector((state: RootState) => state.notification.notification);
  const notificationExtra = useSelector((state: RootState) => state.notification.notificationExtra);

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

  const sendNotification = () => {
    saveNotification(currentUser, notificationId, notification, notificationExtra, router, setToast);
  };

  const cancelNotification = () => {
    router.push("/");
  };

  return (
    <nav className={`${styles.notificationFooter}`} aria-label={i18n.t("notification.navigationFooter")}>
      {currentPage === 1 && (
        <div className={styles.flexButton}>
          <Button variant="secondary" iconLeft={<IconArrowLeft />} onClick={cancelNotification}>
            {i18n.t("notification.button.cancel")}
          </Button>
        </div>
      )}
      {currentPage > 1 && (
        <div className={styles.flexButton}>
          <Button variant="secondary" iconLeft={<IconArrowLeft />} onClick={previousPage}>
            {i18n.t("notification.button.previous")}
          </Button>
        </div>
      )}

      {currentPage < MAX_PAGE && (
        <div className={`${styles.flexButton} ${styles.flexButtonRight}`}>
          <Button iconRight={<IconArrowRight />} onClick={nextPage}>
            {i18n.t("notification.button.next")}
          </Button>
        </div>
      )}
      {currentPage === MAX_PAGE && (
        <div className={`${styles.flexButton} ${styles.flexButtonRight}`}>
          <Button iconRight={<IconArrowRight />} onClick={sendNotification}>
            {i18n.t("notification.button.send")}
          </Button>
        </div>
      )}

      {toast && <ToastNotification prefix="notification" toast={toast} setToast={setToast} />}
    </nav>
  );
};

export default NotificationFooter;
