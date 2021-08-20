import React, { Dispatch, ReactElement, SetStateAction } from "react";
import { useI18n } from "next-localization";
import { RadioButton, SelectionGroup } from "hds-react";
import styles from "./TaskStatusFilter.module.scss";

interface TaskStatusFilterProps {
  showStatus: string;
  setShowStatus: Dispatch<SetStateAction<string>>;
}

const TaskStatusFilter = ({ showStatus, setShowStatus }: TaskStatusFilterProps): ReactElement => {
  const i18n = useI18n();

  return (
    <div className={styles.showStatus}>
      <div>{i18n.t("translation.taskSearch.showStatus.show")}</div>
      <SelectionGroup id="showStatus" direction="horizontal">
        <RadioButton
          id="showStatus_all"
          label={i18n.t("translation.taskSearch.showStatus.all")}
          name="showStatus"
          value="all"
          checked={showStatus === "all"}
          onChange={() => setShowStatus("all")}
        />
        <RadioButton
          id="showStatus_active"
          label={i18n.t("translation.taskSearch.showStatus.active")}
          name="showStatus"
          value="active"
          checked={showStatus === "active"}
          onChange={() => setShowStatus("active")}
        />
        <RadioButton
          id="showStatus_submitted"
          label={i18n.t("translation.taskSearch.showStatus.submitted")}
          name="showStatus"
          value="submitted"
          checked={showStatus === "submitted"}
          onChange={() => setShowStatus("submitted")}
        />
      </SelectionGroup>
    </div>
  );
};

export default TaskStatusFilter;
