import React, { Dispatch, ReactElement, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button } from "hds-react";
import { NotificationValidationAction } from "../../state/actions/notificationValidationTypes";
import { setPageValid } from "../../state/actions/notificationValidation";
import { RootState } from "../../state/reducers";
import { Toast } from "../../types/constants";
import { saveTip } from "../../utils/save";
import { isTipPageValid } from "../../utils/validation";
import ToastNotification from "../common/ToastNotification";
import styles from "./TipFooter.module.scss";

const TipFooter = (): ReactElement => {
  const i18n = useI18n();
  const dispatchValidation = useDispatch<Dispatch<NotificationValidationAction>>();
  const router = useRouter();

  const tip = useSelector((state: RootState) => state.notification.tip);

  const [toast, setToast] = useState<Toast>();

  const sendTip = () => {
    if (isTipPageValid(tip, dispatchValidation)) {
      // The page is valid, so save the tip
      saveTip(tip, router, dispatchValidation, setToast);
      dispatchValidation(setPageValid(true));
    } else {
      // The page is not valid, but set the page to valid then invalid to force the page to show the general validation message
      dispatchValidation(setPageValid(true));
      dispatchValidation(setPageValid(false));
    }
  };

  return (
    <div className={styles.tipFooter}>
      <div className={styles.flexButton}>
        <Button onClick={sendTip}>{i18n.t("notification.button.send")}</Button>
      </div>

      <div className={`${styles.flexButton} ${styles.flexButtonRight}`}>
        <Link href="/">
          <Button variant="secondary">{i18n.t("notification.button.close")}</Button>
        </Link>
      </div>

      {toast && <ToastNotification prefix="notification" toast={toast} setToast={setToast} />}
    </div>
  );
};

export default TipFooter;
