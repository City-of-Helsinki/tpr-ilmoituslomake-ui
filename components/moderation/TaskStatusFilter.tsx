import React, { Dispatch, ReactElement, SetStateAction } from "react";
import { useI18n } from "next-localization";
import { RadioButton, SelectionGroup } from "hds-react";
import { useMediaQuery } from "react-responsive";
import styles from "./TaskStatusFilter.module.scss";

interface TaskStatusFilterProps {
  showStatus: string;
  setShowStatus: Dispatch<SetStateAction<string>>;
  isHorizontalWhenXS?: boolean;
}

const TaskStatusFilter = ({ showStatus, setShowStatus, isHorizontalWhenXS }: TaskStatusFilterProps): ReactElement => {
  const i18n = useI18n();

  // Note: this only works for client-side rendering
  const isScreenSizeXS = useMediaQuery({ query: `only screen and (max-width: ${styles.max_breakpoint_xs})` });

  return (
    <div className={styles.showStatus}>
      <div className={styles.showResultsLabel}>{i18n.t("moderation.taskSearch.showStatus.show")}</div>
      <SelectionGroup id="showStatus" direction={isHorizontalWhenXS && isScreenSizeXS ? "vertical" : "horizontal"}>
        <RadioButton
          id="showStatus_all"
          label={i18n.t("moderation.taskSearch.showStatus.all")}
          name="showStatus"
          value="all"
          checked={showStatus === "all"}
          onChange={() => setShowStatus("all")}
        />
        <RadioButton
          id="showStatus_open"
          label={i18n.t("moderation.taskSearch.showStatus.open")}
          name="showStatus"
          value="open"
          checked={showStatus === "open"}
          onChange={() => setShowStatus("open")}
        />
        <RadioButton
          id="showStatus_closed"
          label={i18n.t("moderation.taskSearch.showStatus.closed")}
          name="showStatus"
          value="closed"
          checked={showStatus === "closed"}
          onChange={() => setShowStatus("closed")}
        />
        <RadioButton
          id="showStatus_rejected"
          label={i18n.t("moderation.taskSearch.showStatus.rejected")}
          name="showStatus"
          value="rejected"
          checked={showStatus === "rejected"}
          onChange={() => setShowStatus("rejected")}
        />
      </SelectionGroup>
    </div>
  );
};

TaskStatusFilter.defaultProps = {
  isHorizontalWhenXS: false,
};

export default TaskStatusFilter;
