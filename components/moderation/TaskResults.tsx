import React, { Dispatch, ReactElement, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, IconPen } from "hds-react";
import moment from "moment";
import { ModerationAction } from "../../state/actions/types";
import { setModerationTaskResults } from "../../state/actions/moderation";
import { RootState } from "../../state/reducers";
import { DATETIME_FORMAT, TaskType } from "../../types/constants";
import { ModerationTodoResult } from "../../types/general";
import { getTaskStatus, getTaskType } from "../../utils/conversion";
import { getDisplayName } from "../../utils/helper";
import { defaultLocale } from "../../utils/i18n";
import TaskStatusLabel from "./TaskStatusLabel";
import styles from "./TaskResults.module.scss";

const TaskResults = (): ReactElement => {
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

  return (
    <div className={`formSection ${styles.taskResults}`}>
      {results.length > 0 && (
        <h2 className="moderation">{`${i18n.t("moderation.taskResults.found")} ${results.length} / ${count} ${i18n.t(
          "moderation.taskResults.tasks"
        )}`}</h2>
      )}

      {searchDone && results.length === 0 && <h2 className="moderation">{i18n.t("moderation.taskResults.notFound")}</h2>}

      {results.length > 0 && (
        <div className={`gridLayoutContainer ${styles.results}`}>
          <div className={`${styles.gridColumn1} ${styles.gridHeader} moderation`}>{i18n.t("moderation.taskResults.nameId")}</div>
          <div className={`${styles.gridColumn2} ${styles.gridHeader} moderation`}>{i18n.t("moderation.taskResults.type")}</div>
          <div className={`${styles.gridColumn3} ${styles.gridHeader} moderation`}>{i18n.t("moderation.taskResults.notified")}</div>
          <div className={`${styles.gridColumn4} ${styles.gridHeader} moderation`}>{i18n.t("moderation.taskResults.status")}</div>
          {results
            .sort((a: ModerationTodoResult, b: ModerationTodoResult) => b.created.getTime() - a.created.getTime())
            .map((result) => {
              const { id, target, notification_target, taskType, created, status, user_place_name } = result;
              const { id: targetId, name } = target || notification_target || {};

              return (
                <Fragment key={`taskresult_${id}`}>
                  <div className={`${styles.gridColumn1} ${styles.gridContent} ${styles.gridButton}`}>
                    <Link href={`/moderation/task/${id}`}>
                      <Button variant="supplementary" size="small" iconLeft={<IconPen aria-hidden />}>
                        {`${getDisplayName(
                          router.locale || defaultLocale,
                          name,
                          user_place_name,
                          taskType === TaskType.ModeratorAdd ? i18n.t("moderation.taskResults.emptyMod") : i18n.t("moderation.taskResults.empty")
                        )}${targetId ? ` (${targetId})` : ""}`}
                      </Button>
                    </Link>
                  </div>
                  <div className={`${styles.gridColumn2} ${styles.gridContent}`}>
                    {taskType !== TaskType.Unknown ? i18n.t(`moderation.taskType.${taskType}`) : ""}
                  </div>
                  <div className={`${styles.gridColumn3} ${styles.gridContent}`}>{moment(created).format(DATETIME_FORMAT)}</div>
                  <div className={`${styles.gridColumn4} ${styles.gridContent}`}>
                    <TaskStatusLabel status={getTaskStatus(status)} />
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
