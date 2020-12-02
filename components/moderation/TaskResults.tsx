import React, { ReactElement } from "react";
import { useI18n } from "next-localization";

const TaskResults = (): ReactElement => {
  const i18n = useI18n();

  return (
    <div className="formSection">
      <h3>{`${i18n.t("moderation.taskResults.found")} ??? ${i18n.t("moderation.taskResults.places")}`}</h3>
      <div>LIST HERE</div>
    </div>
  );
};

export default TaskResults;
