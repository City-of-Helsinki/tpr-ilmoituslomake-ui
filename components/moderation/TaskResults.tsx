import React, { ReactElement, Fragment } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useI18n } from "next-localization";
import { Button, IconPen } from "hds-react";
import moment from "moment";
import { RootState } from "../../state/reducers";
import { TaskType } from "../../types/constants";
import { ModerationTodo } from "../../types/general";
import TaskStatusLabel from "./TaskStatusLabel";
import styles from "./TaskResults.module.scss";

const TaskResults = (): ReactElement => {
  const i18n = useI18n();

  const taskResults = useSelector((state: RootState) => state.moderation.taskResults);

  return (
    <div className="formSection">
      <h3>{`${i18n.t("moderation.taskResults.found")} ${taskResults.length} ${i18n.t("moderation.taskResults.places")}`}</h3>
      <div className={styles.taskResults}>
        <h5 className="gridColumn1 gridHeader">{i18n.t("moderation.taskResults.nameId")}</h5>
        <h5 className="gridColumn2 gridHeader">{i18n.t("moderation.taskResults.type")}</h5>
        <h5 className="gridColumn3 gridHeader">{i18n.t("moderation.taskResults.notified")}</h5>
        <h5 className="gridColumn4 gridHeader">{i18n.t("moderation.taskResults.status")}</h5>
        {taskResults
          .sort((a: ModerationTodo, b: ModerationTodo) => b.created.getTime() - a.created.getTime())
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
                <div className={`gridColumn1 ${styles.gridContent} ${styles.gridButton}`}>
                  <Link href={`/moderation/task/${id}`}>
                    <Button variant="supplementary" size="small" iconLeft={<IconPen />}>
                      {`${name} (${targetId})`}
                    </Button>
                  </Link>
                </div>
                <div className={`gridColumn2 ${styles.gridContent}`}>
                  {taskType !== TaskType.Unknown ? i18n.t(`moderation.taskType.${taskType}`) : ""}
                </div>
                <div className={`gridColumn3 ${styles.gridContent}`}>{moment(created).format("D.M.YYYY H:m")}</div>
                <div className={`gridColumn4 ${styles.gridContent}`}>
                  <TaskStatusLabel status={status} />
                </div>
              </Fragment>
            );
          })}
      </div>
    </div>
  );
};

export default TaskResults;
