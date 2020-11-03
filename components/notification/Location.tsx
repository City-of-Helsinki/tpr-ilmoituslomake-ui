import React, { ReactElement } from "react";
import { useI18n } from "next-localization";

const Location = (): ReactElement => {
  const i18n = useI18n();

  return (
    <div>
      <h2>{i18n.t("notification.contact.location.title")}</h2>
      <div>MAP HERE</div>
    </div>
  );
};

export default Location;
