import React, { Dispatch, ReactElement, SetStateAction } from "react";
import { useI18n } from "next-localization";
import { RadioButton, SelectionGroup } from "hds-react";
import { useMediaQuery } from "react-responsive";
import styles from "./TaskResultsFilter.module.scss";

interface TaskResultsFilterProps {
  prefix: string;
  showResults: string;
  setShowResults: Dispatch<SetStateAction<string>>;
  isHorizontalWhenXS?: boolean;
}

const TaskResultsFilter = ({ prefix, showResults, setShowResults, isHorizontalWhenXS }: TaskResultsFilterProps): ReactElement => {
  const i18n = useI18n();

  // Note: this only works for client-side rendering
  const isScreenSizeXS = useMediaQuery({ query: `only screen and (max-width: ${styles.max_breakpoint_xs})` });

  return (
    <div className={styles.showResults}>
      <div className={styles.showResultsLabel}>{i18n.t(`${prefix}.taskSearch.showResults.show`)}</div>
      <SelectionGroup id="showResults" direction={isHorizontalWhenXS && isScreenSizeXS ? "vertical" : "horizontal"}>
        <RadioButton
          id="showResults_requests"
          label={i18n.t(`${prefix}.taskSearch.showResults.requests`)}
          name="showResult"
          value="requests"
          checked={showResults === "requests"}
          onChange={() => setShowResults("requests")}
        />
        <RadioButton
          id="showResults_tasks"
          label={i18n.t(`${prefix}.taskSearch.showResults.tasks`)}
          name="showResult"
          value="tasks"
          checked={showResults === "tasks"}
          onChange={() => setShowResults("tasks")}
        />
      </SelectionGroup>
    </div>
  );
};

TaskResultsFilter.defaultProps = {
  isHorizontalWhenXS: false,
};

export default TaskResultsFilter;
