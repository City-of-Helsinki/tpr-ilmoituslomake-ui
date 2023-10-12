import React, { Dispatch, ReactElement, SetStateAction } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button } from "hds-react";
import { NotificationAction } from "../../state/actions/notificationTypes";
import { NotificationValidationAction } from "../../state/actions/notificationValidationTypes";
import { setNotificationSending } from "../../state/actions/notification";
import { setNotificationTipValidationSummary, setPageValid } from "../../state/actions/notificationValidation";
import { RootState } from "../../state/reducers";
import { Toast } from "../../types/constants";
import { saveTip } from "../../utils/save";
import { getTipPageValidationSummary, isTipPageValid } from "../../utils/validation";
import styles from "./TipFooter.module.scss";

interface TipFooterProps {
  setToast: Dispatch<SetStateAction<Toast | undefined>>;
}

const TipFooter = ({ setToast }: TipFooterProps): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<NotificationAction>>();
  const dispatchValidation = useDispatch<Dispatch<NotificationValidationAction>>();
  const router = useRouter();

  const tip = useSelector((state: RootState) => state.notification.tip);
  const isSending = useSelector((state: RootState) => state.notification.isSending.tip);

  const sendTip = async () => {
    if (isTipPageValid(tip, dispatchValidation)) {
      // The page is valid, so save the tip
      dispatchValidation(setNotificationTipValidationSummary({}));
      dispatch(setNotificationSending({ tip: true }));
      await saveTip(tip, router, dispatchValidation, setToast);
      dispatch(setNotificationSending({ tip: false }));
      dispatchValidation(setPageValid(true));
    } else {
      // The page is not valid, but set the page to valid then invalid to force the page to show the general validation message
      dispatchValidation(setNotificationTipValidationSummary(getTipPageValidationSummary(tip, i18n)));
      dispatchValidation(setPageValid(true));
      dispatchValidation(setPageValid(false));
    }
  };

  return (
    <div className={styles.tipFooter}>
      <div className={styles.flexButton}>
        <Button onClick={sendTip} disabled={isSending}>
          {i18n.t("notification.button.send")}
        </Button>
      </div>

      <div className={`${styles.flexButton} ${styles.flexButtonRight}`}>
        <Link href="/">
          <Button variant="secondary">{i18n.t("notification.button.close")}</Button>
        </Link>
      </div>
    </div>
  );
};

export default TipFooter;
