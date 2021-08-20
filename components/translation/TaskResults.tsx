import React, { Dispatch, ReactElement, Fragment, useCallback, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, IconPen } from "hds-react";
import { LinearProgress } from "@material-ui/core";
import moment from "moment";
import { TranslationAction } from "../../state/actions/translationTypes";
import { setTranslationTaskResults, setTranslationTaskSearch } from "../../state/actions/translation";
import { RootState } from "../../state/reducers";
import { TaskStatus } from "../../types/constants";
import { TranslationRequestResult, TranslationRequestResultTask, TranslationTodoResult } from "../../types/general";
import { getTaskStatus, getTaskType } from "../../utils/conversion";
import { getDisplayName } from "../../utils/helper";
import { defaultLocale } from "../../utils/i18n";
import TaskStatusLabel from "../common/TaskStatusLabel";
import TaskStatusFilter from "./TaskStatusFilter";
import TaskResultsFilter from "./TaskResultsFilter";
import styles from "./TaskResults.module.scss";

const TaskResults = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<TranslationAction>>();
  const router = useRouter();

  const taskResults = useSelector((state: RootState) => state.translation.taskResults);
  const { results, count, next } = taskResults;
  const taskSearch = useSelector((state: RootState) => state.translation.taskSearch);
  const { request: searchRequest, searchDone } = taskSearch;

  const [showStatus, setShowStatus] = useState<string>("all");
  const [showResults, setShowResults] = useState<string>("requests");

  const fetchMoreResults = async () => {
    if (next) {
      const taskResponse = await fetch(next);
      if (taskResponse.ok) {
        const taskResult = await (taskResponse.json() as Promise<{ count: number; next: string; results: TranslationTodoResult[] }>);

        console.log("TASK RESPONSE", taskResult);

        if (taskResult && taskResult.results && taskResult.results.length > 0) {
          const { results: moreResults, next: nextBatch } = taskResult;

          dispatch(
            setTranslationTaskResults({
              results: [
                ...results,
                ...moreResults.map((result) => {
                  return {
                    ...result,
                    created: moment(result.created_at).toDate(),
                    updated: moment(result.updated_at).toDate(),
                    taskType: getTaskType(result.category, result.item_type),
                    taskStatus: getTaskStatus(result.status),
                  };
                }),
              ],
              count,
              next: nextBatch,
            })
          );
        }
      }
    }
  };

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
          const { requestId, request, language, moderator, updated_at, updated } = result;
          const newRequestResult = {
            id: requestId,
            request,
            language,
            tasks: [taskResult],
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
        const { request: resultRequest, tasks } = result;
        return (searchRequest.length === 0 || searchRequest === resultRequest) && filterStatus(requestStatus(tasks));
      }),
    [requestResults, searchRequest, filterStatus, requestStatus]
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
      {showResults === "requests" && filteredRequestResults.length > 0 && (
        <h2>{`${i18n.t("translation.requestResults.found")} ${filteredRequestResults.length} / ${requestResults.length} ${i18n.t(
          "translation.requestResults.requests"
        )}`}</h2>
      )}

      {showResults === "tasks" && filteredTaskResults.length > 0 && (
        <h2>{`${i18n.t("translation.taskResults.found")} ${filteredTaskResults.length} / ${count} ${i18n.t("translation.taskResults.tasks")}`}</h2>
      )}

      {searchDone && showResults === "requests" && filteredRequestResults.length === 0 && <h2>{i18n.t("translation.requestResults.notFound")}</h2>}

      {searchDone && showResults === "tasks" && filteredTaskResults.length === 0 && <h2>{i18n.t("translation.taskResults.notFound")}</h2>}

      <div className={styles.resultsFilter}>
        <TaskStatusFilter showStatus={showStatus} setShowStatus={setShowStatus} />
        <div className="flexSpace" />
        <TaskResultsFilter showResults={showResults} setShowResults={setShowResults} />
      </div>

      {showResults === "requests" && filteredRequestResults.length > 0 && (
        <div className={`gridLayoutContainer ${styles.results}`}>
          <div className={`${styles.gridColumn1} ${styles.gridHeader}`}>{i18n.t("translation.requestResults.translationRequest")}</div>
          <div className={`${styles.gridColumn2} ${styles.gridHeader}`}>{i18n.t("translation.requestResults.moderator")}</div>
          <div className={`${styles.gridColumn3} ${styles.gridHeader}`}>{i18n.t("translation.requestResults.type")}</div>
          <div className={`${styles.gridColumn4} ${styles.gridHeader}`}>{i18n.t("translation.requestResults.status")}</div>

          {filteredRequestResults
            .sort((a: TranslationRequestResult, b: TranslationRequestResult) => b.updated.getTime() - a.updated.getTime())
            .map((result) => {
              const { id: requestId, request: resultRequest, moderator, tasks } = result;
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
                      onClick={() => updateSearchRequestOption(resultRequest)}
                    >
                      {resultRequest}
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

      {showResults === "tasks" && filteredTaskResults.length > 0 && (
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

      <div className={styles.nextResults}>
        {next && (
          <Button variant="secondary" onClick={fetchMoreResults}>
            {i18n.t("translation.button.showMore")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default TaskResults;
