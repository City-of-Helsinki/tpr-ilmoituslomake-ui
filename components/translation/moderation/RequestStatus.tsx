import React, { ReactElement, useMemo } from "react";
import { useSelector } from "react-redux";
import { useI18n } from "next-localization";
import { RootState } from "../../../state/reducers";
import TaskStatusLabel from "../../common/TaskStatusLabel";
import { TaskStatus } from "../../../types/constants";
import { ModerationTranslationRequestResultTask } from "../../../types/general";
import styles from "./RequestStatus.module.scss";

interface RequestStatusProps {
  taskCounts: (tasks: ModerationTranslationRequestResultTask[]) => {
    [key: string]: number;
  };
  requestStatus: (tasks: ModerationTranslationRequestResultTask[]) => TaskStatus;
}

const RequestStatus = ({ taskCounts, requestStatus }: RequestStatusProps): ReactElement => {
  const i18n = useI18n();

  const requestDetail = useSelector((state: RootState) => state.moderationTranslation.requestDetail);
  const { tasks: requestTasks } = requestDetail;
  const counts = useMemo(() => taskCounts(requestTasks), [taskCounts, requestTasks]);
  const taskStatus = useMemo(() => requestStatus(requestTasks), [requestStatus, requestTasks]);

  return (
    <div className="formSection">
      <h2 className="moderation">{i18n.t("moderation.translation.request.status")}</h2>

      <div className={styles.statusRow}>
        <div className={styles.statusItem}>
          <div className={styles.bold}>{i18n.t("moderation.translation.request.request")}</div>
          <div>
            <TaskStatusLabel prefix="moderation.translation" status={taskStatus} includeIcons />
          </div>
        </div>
        <div className={styles.statusItem}>
          <div className={styles.bold}>{i18n.t("moderation.translation.request.translationTasks")}</div>
          <div className={styles.counts}>
            <span className={styles.count}>{`${counts[TaskStatus.Closed]} / ${requestTasks.length}`}</span>
            <span className={styles.label}>{i18n.t("moderation.translation.requestResults.counts.done")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestStatus;
