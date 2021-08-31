import React, { Dispatch, ReactElement, SetStateAction } from "react";
import { useI18n } from "next-localization";
import { RadioButton, SelectionGroup } from "hds-react";
import { useMediaQuery } from "react-responsive";
import styles from "./TaskStatusFilter.module.scss";

interface TaskStatusFilterProps {
  prefix: string;
  showStatus: string;
  setShowStatus: Dispatch<SetStateAction<string>>;
  isHorizontalWhenXS?: boolean;
}

const TaskStatusFilter = ({ prefix, showStatus, setShowStatus, isHorizontalWhenXS }: TaskStatusFilterProps): ReactElement => {
  const i18n = useI18n();

  // Note: this only works for client-side rendering
  const isScreenSizeXS = useMediaQuery({ query: `only screen and (max-width: ${styles.max_breakpoint_xs})` });

  return (
    <div className={styles.showStatus}>
      <div className={styles.showResultsLabel}>{i18n.t(`${prefix}.taskSearch.showStatus.show`)}</div>
      <SelectionGroup id="showStatus" direction={isHorizontalWhenXS && isScreenSizeXS ? "vertical" : "horizontal"}>
        <RadioButton
          id="showStatus_all"
          label={i18n.t(`${prefix}.taskSearch.showStatus.all`)}
          name="showStatus"
          value="all"
          checked={showStatus === "all"}
          onChange={() => setShowStatus("all")}
        />
        <RadioButton
          id="showStatus_active"
          label={i18n.t(`${prefix}.taskSearch.showStatus.active`)}
          name="showStatus"
          value="active"
          checked={showStatus === "active"}
          onChange={() => setShowStatus("active")}
        />
        <RadioButton
          id="showStatus_submitted"
          label={i18n.t(`${prefix}.taskSearch.showStatus.submitted`)}
          name="showStatus"
          value="submitted"
          checked={showStatus === "submitted"}
          onChange={() => setShowStatus("submitted")}
        />
      </SelectionGroup>
    </div>
  );
};

TaskStatusFilter.defaultProps = {
  isHorizontalWhenXS: false,
};

export default TaskStatusFilter;
