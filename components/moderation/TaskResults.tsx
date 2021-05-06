import React, { ReactElement, Fragment } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, IconPen } from "hds-react";
import moment from "moment";
import { RootState } from "../../state/reducers";
import { DATETIME_FORMAT, TaskType } from "../../types/constants";
import { ModerationTodoResult } from "../../types/general";
import { getTaskStatus } from "../../utils/conversion";
import { getDisplayName } from "../../utils/helper";
import { defaultLocale } from "../../utils/i18n";
import TaskStatusLabel from "./TaskStatusLabel";
import styles from "./TaskResults.module.scss";

const TaskResults = (): ReactElement => {
  const i18n = useI18n();
  const router = useRouter();

  const taskResults = useSelector((state: RootState) => state.moderation.taskResults);

  return (
    <div className={`formSection ${styles.taskResults}`}>
      <h2 className="moderation">{`${i18n.t("moderation.taskResults.found")} ${taskResults.length} ${i18n.t("moderation.taskResults.tasks")}`}</h2>
      <div className={`gridLayoutContainer ${styles.results}`}>
        <h3 className={`${styles.gridColumn1} gridHeader moderation`}>{i18n.t("moderation.taskResults.nameId")}</h3>
        <h3 className={`${styles.gridColumn2} gridHeader moderation`}>{i18n.t("moderation.taskResults.type")}</h3>
        <h3 className={`${styles.gridColumn3} gridHeader moderation`}>{i18n.t("moderation.taskResults.notified")}</h3>
        <h3 className={`${styles.gridColumn4} gridHeader moderation`}>{i18n.t("moderation.taskResults.status")}</h3>
        {taskResults
          .sort((a: ModerationTodoResult, b: ModerationTodoResult) => b.created.getTime() - a.created.getTime())
          .map((result) => {
            const { id, target, notification_target, taskType, created, status, user_place_name } = result;
            const { id: targetId, name } = target || notification_target || {};

            return (
              <Fragment key={`taskresult_${id}`}>
                <div className={`${styles.gridColumn1} ${styles.gridContent} ${styles.gridButton}`}>
                  <Link href={`/moderation/task/${id}`}>
                    <Button variant="supplementary" size="small" iconLeft={<IconPen aria-hidden />}>
                      {`${getDisplayName(router.locale || defaultLocale, name, user_place_name)}${targetId ? ` (${targetId})` : ""}`}
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
    </div>
  );
};

export default TaskResults;
