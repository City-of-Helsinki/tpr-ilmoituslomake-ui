import React, { Dispatch, ReactElement, SetStateAction, Fragment, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { Button, IconPen } from "hds-react";
import { LinearProgress } from "@material-ui/core";
import { TranslationAction } from "../../state/actions/translationTypes";
import { setTranslationTaskSearch } from "../../state/actions/translation";
import { RootState } from "../../state/reducers";
import { TaskStatus } from "../../types/constants";
import { TranslationRequestResult, TranslationRequestResultTask } from "../../types/general";
import TaskStatusLabel from "../common/TaskStatusLabel";
import TaskStatusFilter from "./TaskStatusFilter";
import TaskResultsFilter from "./TaskResultsFilter";
import styles from "./RequestResults.module.scss";

interface RequestResultsProps {
  showStatus: string;
  showResults: string;
  setShowStatus: Dispatch<SetStateAction<string>>;
  setShowResults: Dispatch<SetStateAction<string>>;
}

const RequestResults = ({ showStatus, showResults, setShowStatus, setShowResults }: RequestResultsProps): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<TranslationAction>>();

  const taskResults = useSelector((state: RootState) => state.translation.taskResults);
  const { results } = taskResults;
  const taskSearch = useSelector((state: RootState) => state.translation.taskSearch);
  const { request: searchRequest, searchDone } = taskSearch;

  const updateSearchRequestOption = (request: string) => {
    dispatch(setTranslationTaskSearch({ ...taskSearch, request }));
    setShowResults("tasks");
  };

  const requestResults = useMemo(
    () =>
      results.reduce((acc: TranslationRequestResult[], result) => {
        const { id: taskId, target, taskType, taskStatus } = result;
        const taskResult = { id: taskId, target, taskType, taskStatus };

        const requestResult = acc.find((r) => r.id === result.requestId);
        if (!requestResult) {
          // Create the request data
          const { requestId, request, formattedRequest, language, translator, moderator, updated_at, updated } = result;
          const newRequestResult = {
            id: requestId,
            request,
            formattedRequest,
            language,
            tasks: [taskResult],
            translator,
            moderator,
            updated_at,
            updated,
          };
          return [...acc, newRequestResult];
        }

        // Add the task to the existing request data
        requestResult.tasks = [...requestResult.tasks, taskResult];
        return acc;
      }, []),
    [results]
  );

  const taskCounts = (tasks: TranslationRequestResultTask[]) => {
    return tasks.reduce(
      (acc: { [key: string]: number }, task) => {
        acc[task.taskStatus] += 1;
        return acc;
      },
      { [TaskStatus.Open]: 0, [TaskStatus.InProgress]: 0, [TaskStatus.Closed]: 0 }
    );
  };

  const requestStatus = useCallback((tasks: TranslationRequestResultTask[]) => {
    const counts = taskCounts(tasks);
    if (counts[TaskStatus.Open] === tasks.length) {
      // All the tasks are open, so the request is open
      return TaskStatus.Open;
    }
    if (counts[TaskStatus.Closed] === tasks.length) {
      // All the tasks are closed, so the request is closed
      return TaskStatus.Closed;
    }
    // There is a mixed status, so the request is in progress
    return TaskStatus.InProgress;
  }, []);

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

  const filteredRequestResults = useMemo(
    () =>
      requestResults.filter((result) => {
        const { formattedRequest, tasks } = result;
        return (searchRequest.length === 0 || searchRequest === formattedRequest) && filterStatus(requestStatus(tasks));
      }),
    [requestResults, searchRequest, filterStatus, requestStatus]
  );

  return (
    <div className={`formSection ${styles.requestResults}`}>
      {filteredRequestResults.length > 0 && (
        <h2>{`${i18n.t("translation.requestResults.found")} ${filteredRequestResults.length} / ${requestResults.length} ${i18n.t(
          "translation.requestResults.requests"
        )}`}</h2>
      )}

      {searchDone && filteredRequestResults.length === 0 && <h2>{i18n.t("translation.requestResults.notFound")}</h2>}

      <div className={styles.resultsFilter}>
        <TaskStatusFilter prefix="translation" showStatus={showStatus} setShowStatus={setShowStatus} />
        <div className="flexSpace" />
        <TaskResultsFilter prefix="translation" showResults={showResults} setShowResults={setShowResults} />
      </div>

      {filteredRequestResults.length > 0 && (
        <div className={`gridLayoutContainer ${styles.results}`}>
          <div className={`${styles.gridColumn1} ${styles.gridHeader}`}>{i18n.t("translation.requestResults.translationRequest")}</div>
          <div className={`${styles.gridColumn2} ${styles.gridHeader}`}>{i18n.t("translation.requestResults.moderator")}</div>
          <div className={`${styles.gridColumn3} ${styles.gridHeader}`}>{i18n.t("translation.requestResults.type")}</div>
          <div className={`${styles.gridColumn4} ${styles.gridHeader}`}>{i18n.t("translation.requestResults.status")}</div>

          {filteredRequestResults
            .sort((a: TranslationRequestResult, b: TranslationRequestResult) => b.updated.getTime() - a.updated.getTime())
            .map((result) => {
              const { id: requestId, formattedRequest, moderator, tasks } = result;
              const status = requestStatus(tasks);
              const counts = taskCounts(tasks);
              const completed = (100 * counts[TaskStatus.Closed]) / tasks.length;

              return (
                <Fragment key={`requestresult_${requestId}`}>
                  <div className={`${styles.gridColumn1} ${styles.gridContent} ${styles.gridButton}`}>
                    <Button
                      variant="supplementary"
                      size="small"
                      iconLeft={<IconPen aria-hidden />}
                      onClick={() => updateSearchRequestOption(formattedRequest)}
                    >
                      {formattedRequest}
                    </Button>
                  </div>
                  <div className={`${styles.gridColumn2} ${styles.gridContent}`}>
                    {moderator ? `${moderator.first_name} ${moderator.last_name}`.trim() : ""}
                  </div>
                  <div className={`${styles.gridColumn3} ${styles.gridContent}`}>
                    <TaskStatusLabel prefix="translation" status={status} includeIcons />
                  </div>
                  <div className={`${styles.gridColumn4} ${styles.gridContent}`}>
                    <div className={styles.progressBar}>
                      <LinearProgress variant="determinate" value={completed} />
                    </div>
                    <div className={styles.counts}>
                      <span className={styles.count}>{`${completed.toFixed()}%`}</span>
                      <span className={styles.label}>{i18n.t("translation.requestResults.counts.completed")}</span>
                      <span className={styles.count}>{counts[TaskStatus.Open]}</span>
                      <span className={styles.label}>{i18n.t("translation.requestResults.counts.new")}</span>
                      <span className={styles.count}>{counts[TaskStatus.InProgress]}</span>
                      <span className={styles.label}>{i18n.t("translation.requestResults.counts.draft")}</span>
                      <span className={styles.count}>{counts[TaskStatus.Closed]}</span>
                      <span className={styles.label}>{i18n.t("translation.requestResults.counts.done")}</span>
                    </div>
                  </div>
                </Fragment>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default RequestResults;
