import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { IconCheck, IconCross } from "hds-react";
import moment from "moment";
import { RootState } from "../../state/reducers";
import { DATETIME_FORMAT, NotifierType, TaskType } from "../../types/constants";
import { getDisplayName } from "../../utils/helper";
import { defaultLocale } from "../../utils/i18n";
import TaskStatusLabel from "./TaskStatusLabel";
import TaskHeaderButtons from "./TaskHeaderButtons";
import styles from "./TaskHeader.module.scss";

interface TaskHeaderProps {
  isModerated?: boolean;
}

const TaskHeader = ({ isModerated }: TaskHeaderProps): ReactElement => {
  const i18n = useI18n();
  const router = useRouter();

  const selectedTaskId = useSelector((state: RootState) => state.moderation.selectedTaskId);
  const selectedTask = useSelector((state: RootState) => state.moderation.selectedTask);
  const { name: placeNameSelected } = selectedTask;

  const modifiedTask = useSelector((state: RootState) => state.moderation.modifiedTask);
  const { name: placeNameModified, notifier: { notifier_type, full_name, email, phone } = {}, comments } = modifiedTask;

  const moderationExtra = useSelector((state: RootState) => state.moderation.moderationExtra);
  const {
    published,
    created_at,
    taskType,
    taskStatus,
    userPlaceName,
    userComments,
    userDetails,
    moderator: { fullName: moderatorName },
  } = moderationExtra;

  return (
    <div className={styles.taskHeader}>
      <h1 className="moderation">
        {getDisplayName(router.locale || defaultLocale, selectedTaskId > 0 ? placeNameSelected : placeNameModified, userPlaceName)}
        {selectedTaskId ? ` (${selectedTaskId})` : ""}
      </h1>

      <TaskHeaderButtons isModerated={isModerated} />

      <div className={styles.upperRow}>
        <div>
          <div className={styles.bold}>{i18n.t("moderation.taskHeader.taskType")}</div>
          <div>{taskType !== TaskType.Unknown ? i18n.t(`moderation.taskType.${taskType}`) : ""}</div>
          <div>{moment(created_at).format(DATETIME_FORMAT)}</div>
        </div>
        <div>
          <div className={styles.bold}>{i18n.t("moderation.taskHeader.publishPermission.label")}</div>
          <div>{published ? i18n.t("moderation.taskHeader.publishPermission.yes") : i18n.t("moderation.taskHeader.publishPermission.no")}</div>
        </div>
        <div>
          <div className={styles.bold}>{i18n.t("moderation.taskHeader.status")}</div>
          <div>
            <TaskStatusLabel status={taskStatus} />
          </div>
        </div>
        <div>
          <div className={styles.bold}>{i18n.t("moderation.taskHeader.moderator")}</div>
          <div>{moderatorName}</div>
        </div>
      </div>

      <div className={styles.lowerRow}>
        <div className={styles.notifier}>
          <div className={styles.notifierType}>
            <div className={styles.bold}>{i18n.t("moderation.taskHeader.notifier")}</div>
            {(taskType === TaskType.NewPlace || taskType === TaskType.PlaceChange || taskType === TaskType.PlaceInfo) &&
              (notifier_type === NotifierType.Representative ? (
                <>
                  <IconCheck size="s" aria-hidden />
                  <div>{i18n.t("moderation.taskHeader.representative")}</div>
                </>
              ) : (
                <>
                  <IconCross size="s" aria-hidden />
                  <div>{i18n.t("moderation.taskHeader.notRepresentative")}</div>
                </>
              ))}
          </div>
          {(taskType === TaskType.ChangeTip || taskType === TaskType.AddTip || taskType === TaskType.RemoveTip) && <div>{userDetails}</div>}
          {(taskType === TaskType.NewPlace || taskType === TaskType.PlaceChange || taskType === TaskType.PlaceInfo) && (
            <>
              <div>{full_name}</div>
              <div>{email}</div>
              <div>{phone}</div>
            </>
          )}
        </div>
        <div className={styles.comment}>
          <div className={styles.bold}>{i18n.t("moderation.taskHeader.messageFromNotifier")}</div>
          {(taskType === TaskType.ChangeTip || taskType === TaskType.AddTip || taskType === TaskType.RemoveTip) && (
            <>
              {taskType === TaskType.AddTip && userPlaceName.length > 0 && (
                <div>
                  {i18n.t("moderation.taskHeader.addPlaceName")}: {userPlaceName}
                </div>
              )}
              <div>{userComments}</div>
            </>
          )}
          {(taskType === TaskType.NewPlace || taskType === TaskType.PlaceChange) && <div>{comments}</div>}
        </div>
      </div>
    </div>
  );
};

TaskHeader.defaultProps = {
  isModerated: false,
};

export default TaskHeader;
