import React, { Dispatch, ReactElement, SetStateAction, Fragment, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, IconPen } from "hds-react";
import { RootState } from "../../state/reducers";
import { TaskStatus } from "../../types/constants";
import { TranslationTodoResult } from "../../types/general";
import { getDisplayName } from "../../utils/helper";
import { defaultLocale } from "../../utils/i18n";
import TaskStatusLabel from "../common/TaskStatusLabel";
import TaskStatusFilter from "./TaskStatusFilter";
import TaskResultsFilter from "./TaskResultsFilter";
import styles from "./TaskResults.module.scss";

interface TaskResultsProps {
  showStatus: string;
  showResults: string;
  setShowStatus: Dispatch<SetStateAction<string>>;
  setShowResults: Dispatch<SetStateAction<string>>;
}

const TaskResults = ({ showStatus, showResults, setShowStatus, setShowResults }: TaskResultsProps): ReactElement => {
  const i18n = useI18n();
  const router = useRouter();

  const taskResults = useSelector((state: RootState) => state.translation.taskResults);
  const { results, count } = taskResults;
  const taskSearch = useSelector((state: RootState) => state.translation.taskSearch);
  const { request: searchRequest, searchDone } = taskSearch;

  const filterStatus = useCallback(
    (taskStatus: TaskStatus) => {
      switch (showStatus) {
        case "active": {
          return taskStatus === TaskStatus.Open || taskStatus === TaskStatus.InProgress;
        }
        case "submitted": {
          return taskStatus === TaskStatus.Closed;
        }
        default: {
          return true;
        }
      }
    },
    [showStatus]
  );

  const filteredTaskResults = useMemo(
    () =>
      results.filter((result) => {
        const { request: resultRequest, taskStatus } = result;
        return (searchRequest.length === 0 || searchRequest === resultRequest) && filterStatus(taskStatus);
      }),
    [results, searchRequest, filterStatus]
  );

  return (
    <div className={`formSection ${styles.taskResults}`}>
      {filteredTaskResults.length > 0 && (
        <h2>{`${i18n.t("translation.taskResults.found")} ${filteredTaskResults.length} / ${count} ${i18n.t("translation.taskResults.tasks")}`}</h2>
      )}

      {searchDone && filteredTaskResults.length === 0 && <h2>{i18n.t("translation.taskResults.notFound")}</h2>}

      <div className={styles.resultsFilter}>
        <TaskStatusFilter prefix="translation" showStatus={showStatus} setShowStatus={setShowStatus} />
        <div className="flexSpace" />
        <TaskResultsFilter prefix="translation" showResults={showResults} setShowResults={setShowResults} />
      </div>

      {filteredTaskResults.length > 0 && (
        <div className={`gridLayoutContainer ${styles.results}`}>
          <div className={`${styles.gridColumn1} ${styles.gridHeader}`}>{i18n.t("translation.taskResults.translationTask")}</div>
          <div className={`${styles.gridColumn2} ${styles.gridHeader}`}>{i18n.t("translation.taskResults.request")}</div>
          <div className={`${styles.gridColumn3} ${styles.gridHeader}`}>{i18n.t("translation.taskResults.moderator")}</div>
          <div className={`${styles.gridColumn4} ${styles.gridHeader}`}>{i18n.t("translation.taskResults.status")}</div>

          {filteredTaskResults
            .sort((a: TranslationTodoResult, b: TranslationTodoResult) => b.updated.getTime() - a.updated.getTime())
            .map((result) => {
              const { id: taskId, request: resultRequest, target, moderator, taskStatus } = result;
              const { id: targetId, name } = target || {};

              return (
                <Fragment key={`taskresult_${taskId}`}>
                  <div className={`${styles.gridColumn1} ${styles.gridContent} ${styles.gridButton}`}>
                    <Link href={`/translation/task/${taskId}`}>
                      <Button variant="supplementary" size="small" iconLeft={<IconPen aria-hidden />}>
                        {`${getDisplayName(router.locale || defaultLocale, name, undefined, i18n.t("translation.taskResults.empty"))}${
                          targetId ? ` (${targetId})` : ""
                        }`}
                      </Button>
                    </Link>
                  </div>
                  <div className={`${styles.gridColumn2} ${styles.gridContent}`}>{resultRequest}</div>
                  <div className={`${styles.gridColumn3} ${styles.gridContent}`}>
                    {moderator ? `${moderator.first_name} ${moderator.last_name}`.trim() : ""}
                  </div>
                  <div className={`${styles.gridColumn4} ${styles.gridContent}`}>
                    <TaskStatusLabel prefix="translation" status={taskStatus} includeIcons />
                  </div>
                </Fragment>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default TaskResults;
