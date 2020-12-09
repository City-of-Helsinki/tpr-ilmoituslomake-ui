import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { useI18n } from "next-localization";
import { Button, IconArrowRight, IconArrowUndo, IconTrash } from "hds-react";
import { RootState } from "../../state/reducers";
import { TaskType } from "../../types/constants";
import TaskStatusLabel from "./TaskStatusLabel";
import styles from "./TaskHeader.module.scss";

const TaskHeader = (): ReactElement => {
  const i18n = useI18n();

  const selectedTaskId = useSelector((state: RootState) => state.moderation.selectedTaskId);
  const selectedTask = useSelector((state: RootState) => state.moderation.selectedTask);
  const {
    name: { fi, sv, en },
    comments,
  } = selectedTask;
  const placeNameSelected = fi ?? sv ?? en;

  const moderationExtra = useSelector((state: RootState) => state.moderation.moderationExtra);
  const {
    taskType,
    status,
    moderator: { fullName: moderatorName },
  } = moderationExtra;

  return (
    <div className={styles.taskHeader}>
      <h3>
        {placeNameSelected} ({selectedTaskId})
      </h3>

      <div className={styles.buttonRow}>
        <Button variant="secondary">{i18n.t("moderation.button.requestTranslation")}</Button>
        <Button variant="secondary" iconRight={<IconArrowUndo />}>
          {i18n.t("moderation.button.rejectChangeRequest")}
        </Button>
        <Button variant="secondary" iconRight={<IconTrash />}>
          {i18n.t("moderation.button.removePlace")}
        </Button>
        <Button variant="secondary">{i18n.t("moderation.button.saveIncomplete")}</Button>
        <Button iconRight={<IconArrowRight />}>{i18n.t("moderation.button.saveInformation")}</Button>
      </div>

      <div className={styles.upperRow}>
        <div>
          <div className={styles.bold}>{i18n.t("moderation.taskHeader.taskType")}</div>
          <div>{taskType !== TaskType.Unknown ? i18n.t(`moderation.taskType.${taskType}`) : ""}</div>
        </div>
        <div>
          <div className={styles.bold}>{i18n.t("moderation.taskHeader.publishPermission")}</div>
          <div>TODO</div>
        </div>
        <div>
          <div className={styles.bold}>{i18n.t("moderation.taskHeader.status")}</div>
          <div>
            <TaskStatusLabel status={status} />
          </div>
        </div>
        <div>
          <div className={styles.bold}>{i18n.t("moderation.taskHeader.moderator")}</div>
          <div>{moderatorName}</div>
        </div>
      </div>

      <div className={styles.lowerRow}>
        <div className={styles.notifier}>
          <div className={styles.bold}>{i18n.t("moderation.taskHeader.notifier")}</div>
          <div>TODO</div>
        </div>
        <div className={styles.comment}>
          <div className={styles.bold}>{i18n.t("moderation.taskHeader.messageFromNotifier")}</div>
          <div>{comments}</div>
        </div>
      </div>
    </div>
  );
};

export default TaskHeader;
