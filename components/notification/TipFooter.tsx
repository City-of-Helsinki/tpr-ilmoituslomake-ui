import React, { Dispatch, ReactElement, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, IconArrowLeft, IconArrowRight } from "hds-react";
import { NotificationValidationAction } from "../../state/actions/types";
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
      saveTip(tip, router, dispatchValidation, setToast);
      dispatchValidation(setPageValid(true));
    } else {
      dispatchValidation(setPageValid(false));
    }
  };

  return (
    <div className={styles.tipFooter}>
      <Link href="/">
        <Button variant="secondary" iconLeft={<IconArrowLeft />}>
          {i18n.t("notification.button.cancel")}
        </Button>
      </Link>

      <div className="flexSpace" />

      <Button iconRight={<IconArrowRight />} onClick={sendTip}>
        {i18n.t("notification.button.send")}
      </Button>

      {toast && <ToastNotification prefix="notification" toast={toast} setToast={setToast} />}
    </div>
  );
};

export default TipFooter;
