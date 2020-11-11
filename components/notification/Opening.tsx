import React, { ReactElement } from "react";
import { useI18n } from "next-localization";
import { Notification as HdsNotification } from "hds-react";

const Opening = (): ReactElement => {
  const i18n = useI18n();

  return (
    <div className="formSection">
      <h2>{i18n.t("notification.opening.title")}</h2>
      <HdsNotification size="small" className="formNotification">
        {i18n.t("notification.opening.notice")}
      </HdsNotification>
    </div>
  );
};

export default Opening;
