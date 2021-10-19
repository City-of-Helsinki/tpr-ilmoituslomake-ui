import React, { Dispatch, ReactElement, SetStateAction } from "react";
import { useI18n } from "next-localization";
import { Toast } from "../../types/constants";
import NotificationFooter from "./NotificationFooter";

interface NotificationFooterNavProps {
  setToast: Dispatch<SetStateAction<Toast | undefined>>;
}

const NotificationFooterNav = ({ setToast }: NotificationFooterNavProps): ReactElement => {
  const i18n = useI18n();

  return (
    <nav aria-label={i18n.t("notification.navigationFooter")}>
      <NotificationFooter setToast={setToast} />
    </nav>
  );
};

export default NotificationFooterNav;
