import React, { ReactElement, Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "next-localization";
import { Button, IconPen } from "hds-react";
import moment from "moment";
import { ModerationTask } from "../../types/general";
import styles from "./NewTasks.module.scss";

const NewTasks = (): ReactElement => {
  const i18n = useI18n();

  const [init, setInit] = useState<boolean>(true);
  const [taskResults, setTaskResults] = useState<ModerationTask[]>([]);

  const searchTasks = async () => {
    const taskResponse = await fetch("/api/moderation/todos/recent/");
    if (taskResponse.ok) {
      const taskResult = await (taskResponse.json() as Promise<{ results: ModerationTask[] }>);

      console.log("TASK RESPONSE", taskResult);

      if (taskResult && taskResult.results && taskResult.results.length > 0) {
        // Parse the date strings to date objects
        const results = taskResult.results.map((result) => {
          return { ...result, created: moment(result.created_at).toDate(), updated: moment(result.updated_at).toDate() };
        });
        setTaskResults(results);
      } else {
        setTaskResults([]);
      }
    }
  };

  const selectResult = (id: number) => {
    console.log("TODO", id);
  };

  useEffect(() => {
    if (init) {
      searchTasks();
    }
    setInit(false);
  }, [init, setInit]);

  return (
    <div className="formSection">
      <h3>{`${i18n.t("moderation.newTasks.title")} (${taskResults.length})`}</h3>

      <div className={`formInput ${styles.taskResults}`}>
        <h5 className="gridColumn1 gridHeader">{i18n.t("moderation.taskResults.nameId")}</h5>
        <h5 className="gridColumn2 gridHeader">{i18n.t("moderation.taskResults.type")}</h5>
        <h5 className="gridColumn3 gridHeader">{i18n.t("moderation.taskResults.notified")}</h5>
        <h5 className="gridColumn4 gridHeader">{i18n.t("moderation.taskResults.status")}</h5>
        {taskResults
          .sort((a: ModerationTask, b: ModerationTask) => b.created.getTime() - a.created.getTime())
          .map((result) => {
            const {
              id,
              target: { id: targetId, name },
              category,
              created,
              status,
            } = result;
            return (
              <Fragment key={`taskresult_${id}`}>
                <div className={`gridColumn1 ${styles.gridContent} ${styles.gridButton}`}>
                  <Button variant="supplementary" size="small" iconLeft={<IconPen />} onClick={() => selectResult(id)}>
                    {`${name} (${targetId})`}
                  </Button>
                </div>
                <div className={`gridColumn2 ${styles.gridContent}`}>{category}</div>
                <div className={`gridColumn3 ${styles.gridContent}`}>{moment(created).format("D.M.YYYY H:m")}</div>
                <div className={`gridColumn4 ${styles.gridContent}`}>{status}</div>
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
