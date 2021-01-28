import React, { Dispatch, ReactElement, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, IconArrowRight, IconArrowUndo, IconCheck, IconCross, IconTrash } from "hds-react";
import moment from "moment";
import { ModerationStatusAction } from "../../state/actions/types";
import { RootState } from "../../state/reducers";
import { DATETIME_FORMAT, ModerationStatus, NotifierType, TaskType, Toast } from "../../types/constants";
import { rejectModeration, saveModeration } from "../../utils/save";
import setModerationStatus from "../../utils/status";
import ModalConfirmation from "../common/ModalConfirmation";
import ToastNotification from "../common/ToastNotification";
import TaskStatusLabel from "./TaskStatusLabel";
import styles from "./TaskHeader.module.scss";

const TaskHeader = (): ReactElement => {
  const i18n = useI18n();
  const dispatchStatus = useDispatch<Dispatch<ModerationStatusAction>>();
  const router = useRouter();

  const currentUser = useSelector((state: RootState) => state.notification.user);
  const selectedTaskId = useSelector((state: RootState) => state.moderation.selectedTaskId);
  const selectedTask = useSelector((state: RootState) => state.moderation.selectedTask);
  const {
    name: { fi, sv, en },
    comments,
  } = selectedTask;
  const placeNameSelected = fi ?? sv ?? en;

  const modifiedTaskId = useSelector((state: RootState) => state.moderation.modifiedTaskId);
  const modifiedTask = useSelector((state: RootState) => state.moderation.modifiedTask);
  const {
    notifier: { notifier_type, full_name, email, phone },
  } = modifiedTask;

  const moderationExtra = useSelector((state: RootState) => state.moderation.moderationExtra);
  const {
    photosSelected,
    created_at,
    taskType,
    status,
    userComments,
    userDetails,
    moderator: { fullName: moderatorName },
  } = moderationExtra;
  const pageStatus = useSelector((state: RootState) => state.moderationStatus.pageStatus);

  const [toast, setToast] = useState<Toast>();
  const [confirmRejection, setConfirmRejection] = useState(false);
  const [confirmDeletion, setConfirmDeletion] = useState(false);

  const modifyTask = () => {
    setModerationStatus(photosSelected, dispatchStatus);
  };

  const openRejectionConfirmation = () => {
    setConfirmRejection(true);
  };

  const closeRejectionConfirmation = () => {
    setConfirmRejection(false);
  };

  const openDeletionConfirmation = () => {
    setConfirmDeletion(true);
  };

  const closeDeletionConfirmation = () => {
    setConfirmDeletion(false);
  };

  const saveTask = () => {
    saveModeration(currentUser, modifiedTaskId, modifiedTask, moderationExtra, router, setToast);
  };

  const rejectTask = () => {
    closeRejectionConfirmation();
    rejectModeration(currentUser, modifiedTaskId, moderationExtra, router, setToast);
  };

  const removePlace = () => {
    closeDeletionConfirmation();

    // TODO - remove place
  };

  return (
    <div className={styles.taskHeader}>
      <h1 className="moderation">
        {placeNameSelected} ({selectedTaskId})
      </h1>

      {(taskType === TaskType.NewPlace || taskType === TaskType.PlaceChange) && (
        <div className={styles.buttonRow}>
          <Button variant="secondary">{i18n.t("moderation.button.requestTranslation")}</Button>
          <Button variant="secondary" iconRight={<IconArrowUndo />} onClick={openRejectionConfirmation}>
            {i18n.t("moderation.button.rejectChangeRequest")}
          </Button>
          <Button variant="secondary" iconRight={<IconTrash />} onClick={openDeletionConfirmation}>
            {i18n.t("moderation.button.removePlace")}
          </Button>
          <Button iconRight={<IconArrowRight />} onClick={saveTask}>
            {i18n.t("moderation.button.saveInformation")}
          </Button>
        </div>
      )}

      {(taskType === TaskType.ChangeTip || taskType === TaskType.RemoveTip) && (
        <div className={styles.buttonRow}>
          <Button variant="secondary">{i18n.t("moderation.button.requestTranslation")}</Button>
          <Button variant="secondary" iconRight={<IconArrowUndo />} onClick={openRejectionConfirmation}>
            {i18n.t("moderation.button.rejectChangeRequest")}
          </Button>
          {pageStatus !== ModerationStatus.Edited && (
            <Button variant="secondary" onClick={modifyTask}>
              {i18n.t("moderation.button.openForModifying")}
            </Button>
          )}
          {pageStatus === ModerationStatus.Edited && (
            <Button iconRight={<IconArrowRight />} onClick={saveTask}>
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
          {(taskType === TaskType.ChangeTip || taskType === TaskType.RemoveTip) && <div>{userDetails}</div>}
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
          <div>{taskType === TaskType.ChangeTip || taskType === TaskType.RemoveTip ? userComments : comments}</div>
        </div>
      </div>

      {confirmRejection && (
        <ModalConfirmation
          open={confirmRejection}
          titleKey="moderation.button.rejectChangeRequest"
          messageKey="moderation.confirmation.rejectChangeRequest"
          cancelKey="moderation.button.cancel"
          confirmKey="moderation.button.reject"
          closeCallback={closeRejectionConfirmation}
          confirmCallback={rejectTask}
        />
      )}

      {confirmDeletion && (
        <ModalConfirmation
          open={confirmDeletion}
          titleKey="moderation.button.removePlace"
          messageKey="moderation.confirmation.removePlace"
          cancelKey="moderation.button.cancel"
          confirmKey="moderation.button.remove"
          closeCallback={closeDeletionConfirmation}
          confirmCallback={removePlace}
        />
      )}

      {toast && <ToastNotification prefix="moderation" toast={toast} setToast={setToast} />}
    </div>
  );
};

export default TaskHeader;
