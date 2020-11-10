import React, { Dispatch, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button } from "hds-react";
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

  const previousPage = () => {
    dispatch(setPage(currentPage - 1));
  };

  const nextPage = () => {
    dispatch(setPage(currentPage + 1));
  };

  const sendNotification = async () => {
    try {
      console.log("VALIDATED", validateNotificationData(notification));
      console.log("SENDING", notification);

      const createRequest = await fetch("/api/notification/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: notification }),
      });
      const createResponse = await createRequest.json();
      console.log("RESPONSE", createResponse);
    } catch (err) {
      console.log("ERROR", err);
    }
  };

  const cancelNotification = () => {
    router.push("/", "/");
  };

  return (
    <div className={styles.notificationFooter}>
      {currentPage === 1 && (
        <Button variant="secondary" onClick={cancelNotification}>
          {i18n.t("notification.button.cancel")}
        </Button>
      )}
      {currentPage > 1 && (
        <Button variant="secondary" onClick={previousPage}>
          {i18n.t("notification.button.previous")}
        </Button>
      )}
      <div className={styles.space} />
      {currentPage < MAX_PAGE && <Button onClick={nextPage}>{i18n.t("notification.button.next")}</Button>}
      {currentPage === MAX_PAGE && <Button onClick={sendNotification}>{i18n.t("notification.button.send")}</Button>}
    </div>
  );
};

export default Footer;
