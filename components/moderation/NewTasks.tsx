import React, { ReactElement } from "react";
import Link from "next/link";
import { useI18n } from "next-localization";
import { Button } from "hds-react";

const NewTasks = (): ReactElement => {
  const i18n = useI18n();

  return (
    <div className="formSection">
      <h3>{i18n.t("moderation.newTasks.title")}</h3>
      <div className="formInput">LIST HERE</div>
      <Link href="/moderation/task">
        <Button>{i18n.t("moderation.button.showAllRequests")}</Button>
      </Link>
    </div>
  );
};

export default NewTasks;
