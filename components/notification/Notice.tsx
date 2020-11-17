import React, { ReactElement } from "react";
import { useI18n } from "next-localization";
import { Notification as HdsNotification } from "hds-react";

const Notice = ({ messageKey }: { messageKey: string }): ReactElement => {
  const i18n = useI18n();

  return (
    <div>
      <HdsNotification size="small" className="formNotification">
        {i18n.t(messageKey)}
      </HdsNotification>
    </div>
  );
};

export default Notice;
