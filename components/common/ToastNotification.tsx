import React, { Dispatch, ReactElement, SetStateAction, useEffect, useRef } from "react";
import { useI18n } from "next-localization";
import { Notification as HdsNotification } from "hds-react";
import { Toast } from "../../types/constants";
import styles from "./ToastNotification.module.scss";

interface NoticeProps {
  prefix: string;
  toast: Toast;
  setToast: Dispatch<SetStateAction<Toast | undefined>>;
}

const ToastNotification = ({ prefix, toast, setToast }: NoticeProps): ReactElement => {
  const i18n = useI18n();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      window.scrollTo(0, 0);
      ref.current.scrollIntoView();
      ref.current.focus();
    }
  }, []);

  const cleanupToast = () => {
    setToast(undefined);
  };

  return toast ? (
    <div className={styles.toastNotification} ref={ref} tabIndex={-1}>
      <HdsNotification
        // position="top-right"
        label={i18n.t(`${prefix}.message.${toast}.title`)}
        type={toast === Toast.SaveSucceeded || toast === Toast.RejectSucceeded || toast === Toast.DeleteSucceeded ? "success" : "error"}
        closeButtonLabelText={i18n.t(`${prefix}.message.close`)}
        onClose={cleanupToast}
        // autoClose
        // autoCloseDuration={15000}
        dismissible
      >
        {i18n.t(`${prefix}.message.${toast}.message`)}
      </HdsNotification>
    </div>
  ) : (
    <></>
  );
};

export default ToastNotification;
