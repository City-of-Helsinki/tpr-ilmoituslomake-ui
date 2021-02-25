import React, { ReactElement, useState } from "react";
import { useI18n } from "next-localization";
import { Toast } from "../../types/constants";
import ToastNotification from "../common/ToastNotification";
import NotificationFooter from "./NotificationFooter";

const NotificationFooterNav = (): ReactElement => {
  const i18n = useI18n();

  const [toast, setToast] = useState<Toast>();

  return (
    <nav aria-label={i18n.t("notification.navigationFooter")}>
      <NotificationFooter setToast={setToast} />

      {toast && <ToastNotification prefix="notification" toast={toast} setToast={setToast} />}
    </nav>
  );
};

export default NotificationFooterNav;
