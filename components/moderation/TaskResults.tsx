import React, { Dispatch, ReactElement, Fragment, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, Link as HdsLink } from "hds-react";
import moment from "moment";
import { ModerationAction } from "../../state/actions/moderationTypes";
import { setModerationTaskResults } from "../../state/actions/moderation";
import { RootState } from "../../state/reducers";
import { DATETIME_FORMAT, TaskStatus, TaskType } from "../../types/constants";
import { ModerationTodoResult } from "../../types/general";
import { getTaskStatus, getTaskType } from "../../utils/conversion";
import { getDisplayName } from "../../utils/helper";
import { defaultLocale } from "../../utils/i18n";
import TaskStatusLabel from "../common/TaskStatusLabel";
import styles from "./TaskResults.module.scss";

interface TaskResultsProps {
  showStatus: string;
}

const TaskResults = ({ showStatus }: TaskResultsProps): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<ModerationAction>>();
  const router = useRouter();

  const taskResults = useSelector((state: RootState) => state.moderation.taskResults);
  const { results, count, next } = taskResults;
  const taskSearch = useSelector((state: RootState) => state.moderation.taskSearch);
  const { searchDone } = taskSearch;

  const fetchMoreResults = async () => {
    if (next) {
      const taskResponse = await fetch(next);
      if (taskResponse.ok) {
        const taskResult = await (taskResponse.json() as Promise<{ count: number; next: string; results: ModerationTodoResult[] }>);

        console.log("TASK RESPONSE", taskResult);

        if (taskResult && taskResult.results && taskResult.results.length > 0) {
          const { results: moreResults, next: nextBatch } = taskResult;

          // Parse the date strings to date objects
          dispatch(
            setModerationTaskResults({
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

  const filterStatus = useCallback(
    (taskStatus: TaskStatus) => {
      switch (showStatus) {
        case "open": {
          return taskStatus === TaskStatus.Open;
        }
        case "closed": {
          return taskStatus === TaskStatus.Closed;
        }
        case "rejected": {
          return taskStatus === TaskStatus.Rejected;
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
        const { taskStatus } = result;
        return filterStatus(taskStatus);
      }),
    [results, filterStatus]
  );

  return (
    <div className={`formSection ${styles.taskResults}`}>
      {filteredTaskResults.length > 0 && (
        <h2 className="moderation">{`${i18n.t("moderation.taskResults.found")} ${filteredTaskResults.length} / ${count} ${i18n.t(
          "moderation.taskResults.tasks"
        )}`}</h2>
      )}

      {searchDone && filteredTaskResults.length === 0 && <h2 className="moderation">{i18n.t("moderation.taskResults.notFound")}</h2>}

      {filteredTaskResults.length > 0 && (
        <div className={`gridLayoutContainer ${styles.results}`}>
          <div className={`${styles.gridColumn1} ${styles.gridHeader} moderation`}>
            <div className={styles.flexItem}>{i18n.t("moderation.taskResults.nameId")}</div>
          </div>
          <div className={`${styles.gridColumn2} ${styles.gridHeader} moderation`}>
            <div className={styles.flexItem}>{i18n.t("moderation.taskResults.type")}</div>
          </div>
          <div className={`${styles.gridColumn3} ${styles.gridHeader} moderation`}>
            <div className={styles.flexItem}>{i18n.t("moderation.taskResults.notified")}</div>
          </div>
          <div className={`${styles.gridColumn4} ${styles.gridHeader} moderation`}>
            <div className={styles.flexItem}>{i18n.t("moderation.taskResults.status")}</div>
          </div>

          {filteredTaskResults
            .sort((a: ModerationTodoResult, b: ModerationTodoResult) => b.created.getTime() - a.created.getTime())
            .map((result) => {
              const { id, target, notification_target, taskType, created, status, user_place_name } = result;
              const { id: targetId, name } = target || notification_target || {};

              return (
                <Fragment key={`taskresult_${id}`}>
                  <div className={`${styles.gridColumn1} ${styles.gridContent}`}>
                    <div className={styles.flexItem}>
                      <Link href={`/moderation/task/${id}`}>
                        <HdsLink href="#" size="M" disableVisitedStyles>
                          {`${getDisplayName(
                            router.locale || defaultLocale,
                            name,
                            user_place_name,
                            taskType === TaskType.ModeratorAdd ? i18n.t("moderation.taskResults.emptyMod") : i18n.t("moderation.taskResults.empty")
                          )}${targetId ? ` (${targetId})` : ""}`}
                        </HdsLink>
                      </Link>
                    </div>
                  </div>
                  <div className={`${styles.gridColumn2} ${styles.gridContent}`}>
                    <div className={styles.flexItem}>
                      <span className={styles.mobileOnly}>{`${i18n.t("moderation.taskResults.type")}: `}</span>
                      {taskType !== TaskType.Unknown ? i18n.t(`moderation.taskType.${taskType}`) : ""}
                    </div>
                  </div>
                  <div className={`${styles.gridColumn3} ${styles.gridContent}`}>
                    <div className={styles.flexItem}>
                      <span className={styles.mobileOnly}>{`${i18n.t("moderation.taskResults.notified")}: `}</span>
                      {moment(created).format(DATETIME_FORMAT)}
                    </div>
                  </div>
                  <div className={`${styles.gridColumn4} ${styles.gridContent}`}>
                    <div className={styles.flexItem}>
                      <span className={styles.mobileOnly}>{`${i18n.t("moderation.taskResults.status")}: `}</span>
                      <TaskStatusLabel prefix="moderation" status={getTaskStatus(status)} />
                    </div>
                  </div>
                </Fragment>
              );
            })}
        </div>
      )}

      <div className={styles.nextResults}>
        {next && (
          <Button variant="secondary" onClick={fetchMoreResults}>
            {i18n.t("moderation.button.showMore")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default TaskResults;
