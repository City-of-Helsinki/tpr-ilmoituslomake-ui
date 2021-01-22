import React, { Dispatch, ReactElement, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { Button, IconArrowRight, IconArrowUndo, IconCheck, IconCross, IconTrash, Notification as HdsNotification } from "hds-react";
import moment from "moment";
import { ModerationStatusAction } from "../../state/actions/types";
import { RootState } from "../../state/reducers";
import { DATETIME_FORMAT, ModerationStatus, NotifierType, TaskType, Toast } from "../../types/constants";
import { saveModeration } from "../../utils/save";
import setModerationStatus from "../../utils/status";
import TaskStatusLabel from "./TaskStatusLabel";
import styles from "./TaskHeader.module.scss";

const TaskHeader = (): ReactElement => {
  const i18n = useI18n();
  const dispatchStatus = useDispatch<Dispatch<ModerationStatusAction>>();

  const currentUser = useSelector((state: RootState) => state.notification.user);
  const selectedTaskId = useSelector((state: RootState) => state.moderation.selectedTaskId);
  const selectedTask = useSelector((state: RootState) => state.moderation.selectedTask);
  const {
    name: { fi, sv, en },
    notifier: { notifier_type, full_name, email, phone },
    comments,
  } = selectedTask;
  const placeNameSelected = fi ?? sv ?? en;

  const modifiedTaskId = useSelector((state: RootState) => state.moderation.modifiedTaskId);
  const modifiedTask = useSelector((state: RootState) => state.moderation.modifiedTask);
  const moderationExtra = useSelector((state: RootState) => state.moderation.moderationExtra);
  const {
    photosSelected,
    changeRequest: { description, contact_details } = {},
    created_at,
    taskType,
    status,
    moderator: { fullName: moderatorName },
  } = moderationExtra;
  const pageStatus = useSelector((state: RootState) => state.moderationStatus.pageStatus);

  const [toast, setToast] = useState<Toast>();

  const cleanupToast = () => {
    setToast(undefined);
  };

  const openForModifying = () => {
    setModerationStatus(photosSelected, dispatchStatus);
  };

  return (
    <div className={styles.taskHeader}>
      <h1 className="moderation">
        {placeNameSelected} ({selectedTaskId})
      </h1>

      {(taskType === TaskType.NewPlace || taskType === TaskType.PlaceChange) && (
        <div className={styles.buttonRow}>
          <Button variant="secondary">{i18n.t("moderation.button.requestTranslation")}</Button>
          <Button variant="secondary" iconRight={<IconArrowUndo />}>
            {i18n.t("moderation.button.rejectChangeRequest")}
          </Button>
          <Button variant="secondary" iconRight={<IconTrash />}>
            {i18n.t("moderation.button.removePlace")}
          </Button>
          <Button iconRight={<IconArrowRight />} onClick={() => saveModeration(currentUser, modifiedTaskId, modifiedTask, moderationExtra, setToast)}>
            {i18n.t("moderation.button.saveInformation")}
          </Button>
        </div>
      )}

      {(taskType === TaskType.ChangeTip || taskType === TaskType.RemoveTip) && (
        <div className={styles.buttonRow}>
          <Button variant="secondary">{i18n.t("moderation.button.requestTranslation")}</Button>
          <Button variant="secondary" iconRight={<IconArrowUndo />}>
            {i18n.t("moderation.button.rejectChangeRequest")}
          </Button>
          {pageStatus !== ModerationStatus.Edited && (
            <Button variant="secondary" onClick={openForModifying}>
              {i18n.t("moderation.button.openForModifying")}
            </Button>
          )}
          {pageStatus === ModerationStatus.Edited && (
            <Button
              iconRight={<IconArrowRight />}
              onClick={() => saveModeration(currentUser, modifiedTaskId, modifiedTask, moderationExtra, setToast)}
            >
              {i18n.t("moderation.button.saveInformation")}
            </Button>
          )}
        </div>
      )}

      <div className={styles.upperRow}>
        <div>
          <div className={styles.bold}>{i18n.t("moderation.taskHeader.taskType")}</div>
          <div>{taskType !== TaskType.Unknown ? i18n.t(`moderation.taskType.${taskType}`) : ""}</div>
          <div>{moment(created_at).format(DATETIME_FORMAT)}</div>
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
          <div className={styles.notifierType}>
            <div className={styles.bold}>{i18n.t("moderation.taskHeader.notifier")}</div>
            {notifier_type === NotifierType.Representative ? (
              <>
                <IconCheck size="s" aria-hidden="true" />
                <div>{i18n.t("moderation.taskHeader.representative")}</div>
              </>
            ) : (
              <>
                <IconCross size="s" aria-hidden="true" />
                <div>{i18n.t("moderation.taskHeader.notRepresentative")}</div>
              </>
            )}
          </div>
          {(taskType === TaskType.ChangeTip || taskType === TaskType.RemoveTip) && <div>{contact_details}</div>}
          {(taskType === TaskType.NewPlace || taskType === TaskType.PlaceChange) && (
            <>
              <div>{full_name}</div>
              <div>{email}</div>
              <div>{phone}</div>
            </>
          )}
        </div>
        <div className={styles.comment}>
          <div className={styles.bold}>{i18n.t("moderation.taskHeader.messageFromNotifier")}</div>
          <div>{taskType === TaskType.ChangeTip || taskType === TaskType.RemoveTip ? description : comments}</div>
        </div>
      </div>

      {toast && (
        <HdsNotification
          position="top-right"
          label={i18n.t(`notification.message.${toast}.title`)}
          type={toast === Toast.SaveSucceeded ? "success" : "error"}
          closeButtonLabelText={i18n.t("notification.message.close")}
          onClose={cleanupToast}
          autoClose
          dismissible
        >
          {i18n.t(`notification.message.${toast}.message`)}
        </HdsNotification>
      )}
    </div>
  );
};

export default TaskHeader;
