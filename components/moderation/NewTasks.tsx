import React, { ReactElement, Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "next-localization";
import { Button, IconPen } from "hds-react";
import moment from "moment";
import { DATETIME_FORMAT, TaskType } from "../../types/constants";
import { ModerationTodoResult } from "../../types/general";
import { getTaskStatus, getTaskType } from "../../utils/conversion";
import TaskStatusLabel from "./TaskStatusLabel";
import styles from "./NewTasks.module.scss";

const NewTasks = (): ReactElement => {
  const i18n = useI18n();

  const [init, setInit] = useState<boolean>(true);
  const [taskResults, setTaskResults] = useState<ModerationTodoResult[]>([]);

  const searchTasks = async () => {
    const taskResponse = await fetch("/api/moderation/todos/recent/");
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
            taskType: getTaskType(result.category),
            taskStatus: getTaskStatus(result.status),
          };
        });
        setTaskResults(results);
      } else {
        setTaskResults([]);
      }
    }
  };

  useEffect(() => {
    if (init) {
      searchTasks();
    }
    setInit(false);
  }, [init, setInit]);

  return (
    <div className={`formSection ${styles.newTasks}`}>
      <h3>{`${i18n.t("moderation.newTasks.title")} (${taskResults.length})`}</h3>

      <div className={`formInput gridLayoutContainer ${styles.taskResults}`}>
        <h5 className={`${styles.gridColumn1} gridHeader`}>{i18n.t("moderation.taskResults.nameId")}</h5>
        <h5 className={`${styles.gridColumn2} gridHeader`}>{i18n.t("moderation.taskResults.type")}</h5>
        <h5 className={`${styles.gridColumn3} gridHeader`}>{i18n.t("moderation.taskResults.notified")}</h5>
        <h5 className={`${styles.gridColumn4} gridHeader`}>{i18n.t("moderation.taskResults.status")}</h5>
        {taskResults
          .sort((a: ModerationTodoResult, b: ModerationTodoResult) => b.created.getTime() - a.created.getTime())
          .map((result) => {
            const {
              id,
              target: { id: targetId, name },
              taskType,
              created,
              status,
            } = result;
            return (
              <Fragment key={`taskresult_${id}`}>
                <div className={`${styles.gridColumn1} ${styles.gridContent} ${styles.gridButton}`}>
                  <Link href={`/moderation/task/${id}`}>
                    <Button variant="supplementary" size="small" iconLeft={<IconPen />}>
                      {`${name} (${targetId})`}
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

      <Link href="/moderation/task">
        <Button>{i18n.t("moderation.button.showAllRequests")}</Button>
      </Link>
    </div>
  );
};

export default NewTasks;
