import React, { Dispatch, ReactElement, SetStateAction } from "react";
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
import styles from "./NotificationFooter.module.scss";

interface NotificationFooterProps {
  smallButtons?: boolean;
  setToast?: Dispatch<SetStateAction<Toast | undefined>>;
}

const NotificationFooter = ({ smallButtons, setToast }: NotificationFooterProps): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const dispatchValidation = useDispatch<Dispatch<NotificationValidationAction>>();
  const router = useRouter();

  const currentPage = useSelector((state: RootState) => state.notification.page);
  const currentUser = useSelector((state: RootState) => state.general.user);
  const notificationId = useSelector((state: RootState) => state.notification.notificationId);
  const notification = useSelector((state: RootState) => state.notification.notification);
  const notificationExtra = useSelector((state: RootState) => state.notification.notificationExtra);

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
    <div className={styles.notificationFooter}>
      {currentPage === 1 && smallButtons && (
        <div className={`${styles.flexButton} ${styles.smallButton}`}>
          <Button variant="supplementary" size="small" iconLeft={<IconArrowLeft />} onClick={cancelNotification}>
            {i18n.t("notification.button.cancel")}
          </Button>
        </div>
      )}
      {currentPage === 1 && !smallButtons && (
        <div className={styles.flexButton}>
          <Button variant="secondary" size="default" iconLeft={<IconArrowLeft />} onClick={cancelNotification}>
            {i18n.t("notification.button.cancel")}
          </Button>
        </div>
      )}

      {currentPage > 1 && smallButtons && (
        <div className={`${styles.flexButton} ${styles.smallButton}`}>
          <Button variant="supplementary" size="small" iconLeft={<IconArrowLeft />} onClick={previousPage}>
            {i18n.t("notification.button.previous")}
          </Button>
        </div>
      )}
      {currentPage > 1 && !smallButtons && (
        <div className={styles.flexButton}>
          <Button variant="secondary" size="default" iconLeft={<IconArrowLeft />} onClick={previousPage}>
            {i18n.t("notification.button.previous")}
          </Button>
        </div>
      )}

      {currentPage < MAX_PAGE && smallButtons && (
        <div className={`${styles.flexButton} ${styles.smallButton} ${styles.flexButtonRight}`}>
          <Button variant="supplementary" size="small" iconLeft={<IconArrowRight />} onClick={nextPage}>
            {i18n.t("notification.button.next")}
          </Button>
        </div>
      )}
      {currentPage < MAX_PAGE && !smallButtons && (
        <div className={`${styles.flexButton} ${styles.flexButtonRight}`}>
          <Button variant="primary" size="default" iconLeft={<IconArrowRight />} onClick={nextPage}>
            {i18n.t("notification.button.next")}
          </Button>
        </div>
      )}

      {currentPage === MAX_PAGE && smallButtons && setToast && (
        <div className={`${styles.flexButton} ${styles.smallButton} ${styles.flexButtonRight}`}>
          <Button variant="supplementary" size="small" iconLeft={<IconArrowRight />} onClick={sendNotification}>
            {i18n.t("notification.button.send")}
          </Button>
        </div>
      )}
      {currentPage === MAX_PAGE && !smallButtons && setToast && (
        <div className={`${styles.flexButton} ${styles.flexButtonRight}`}>
          <Button variant="primary" size="default" iconLeft={<IconArrowRight />} onClick={sendNotification}>
            {i18n.t("notification.button.send")}
          </Button>
        </div>
      )}
    </div>
  );
};

NotificationFooter.defaultProps = {
  smallButtons: false,
  setToast: undefined,
};

export default NotificationFooter;
