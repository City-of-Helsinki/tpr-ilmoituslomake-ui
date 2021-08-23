import React, { Dispatch, ReactElement, SetStateAction } from "react";
import { useI18n } from "next-localization";
import { RadioButton, SelectionGroup } from "hds-react";
import styles from "./TaskResultsFilter.module.scss";

interface TaskResultsFilterProps {
  prefix: string;
  showResults: string;
  setShowResults: Dispatch<SetStateAction<string>>;
}

const TaskResultsFilter = ({ prefix, showResults, setShowResults }: TaskResultsFilterProps): ReactElement => {
  const i18n = useI18n();

  return (
    <div className={styles.showResults}>
      <div>{i18n.t(`${prefix}.taskSearch.showResults.show`)}</div>
      <SelectionGroup id="showResults" direction="horizontal">
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

export default TaskResultsFilter;
