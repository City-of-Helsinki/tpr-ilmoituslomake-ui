import React, { ReactElement } from "react";
import { useI18n } from "next-localization";
import { Button } from "hds-react";

const NewRequests = (): ReactElement => {
  const i18n = useI18n();

  return (
    <div className="formSection">
      <h3>{i18n.t("moderation.newRequests.title")}</h3>
      <div className="formInput">LIST HERE</div>
      <Button>{i18n.t("moderation.button.showAllRequests")}</Button>
    </div>
  );
};

export default NewRequests;
