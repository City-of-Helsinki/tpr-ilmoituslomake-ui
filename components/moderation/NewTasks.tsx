import React, { ReactElement, Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, IconPen } from "hds-react";
import moment from "moment";
import { DATETIME_FORMAT, TaskType } from "../../types/constants";
import { ModerationTodoResult } from "../../types/general";
import { getTaskStatus, getTaskType } from "../../utils/conversion";
import { getDisplayName } from "../../utils/helper";
import { defaultLocale } from "../../utils/i18n";
import getOrigin from "../../utils/request";
import TaskStatusLabel from "../common/TaskStatusLabel";
import styles from "./NewTasks.module.scss";

const NewTasks = (): ReactElement => {
  const i18n = useI18n();
  const router = useRouter();

  const [taskResults, setTaskResults] = useState<ModerationTodoResult[]>([]);

  const searchTasks = async () => {
    const taskResponse = await fetch(`${getOrigin(router)}/api/moderation/todos/recent/`);
    if (taskResponse.ok) {
      const taskResult = await (taskResponse.json() as Promise<{ results: ModerationTodoResult[] }>);

      console.log("TASK RESPONSE", taskResult);

      if (taskResult && taskResult.results && taskResult.results.length > 0) {
        // Parse the date strings to date objects
        const results = taskResult.results.map((result) => {
          return {
            ...result,
            created: moment(result.created_at).toDate(),
            updated: moment(result.updated_at).toDate(),
            taskType: getTaskType(result.category, result.item_type),
            taskStatus: getTaskStatus(result.status),
          };
        });
        setTaskResults(results);
      } else {
        setTaskResults([]);
      }
    }
  };

  // Search all tasks on first render only, using a workaround utilising useEffect with empty dependency array
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const useMountEffect = (fun: () => void) => useEffect(fun, []);
  useMountEffect(searchTasks);

  return (
    <div className={`formSection ${styles.newTasks}`}>
      <h2 className="moderation">{`${i18n.t("moderation.newTasks.title")} (${taskResults.length})`}</h2>

      <div className={`formInput gridLayoutContainer ${styles.taskResults}`}>
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

        {taskResults
          .sort((a: ModerationTodoResult, b: ModerationTodoResult) => b.created.getTime() - a.created.getTime())
          .map((result) => {
            const { id, target, notification_target, taskType, created, status, user_place_name } = result;
            const { id: targetId, name } = target || notification_target || {};

            return (
              <Fragment key={`taskresult_${id}`}>
                <div className={`${styles.gridColumn1} ${styles.gridContent}`}>
                  <div className={styles.flexItem}>
                    <Link href={`/moderation/task/${id}`}>
                      <Button variant="supplementary" size="small" iconLeft={<IconPen aria-hidden />}>
                        {`${getDisplayName(router.locale || defaultLocale, name, user_place_name)}${targetId ? ` (${targetId})` : ""}`}
                      </Button>
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

      <Link href="/moderation/task">
        <Button>{i18n.t("moderation.button.showAllRequests")}</Button>
      </Link>
    </div>
  );
};

export default NewTasks;
