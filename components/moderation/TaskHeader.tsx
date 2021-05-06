import React, { Dispatch, ReactElement, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, IconArrowRight, IconArrowUndo, IconCheck, IconCross, IconTrash } from "hds-react";
import moment from "moment";
import { ModerationStatusAction } from "../../state/actions/types";
import { RootState } from "../../state/reducers";
import { DATETIME_FORMAT, ModerationStatus, NotifierType, TaskType, Toast } from "../../types/constants";
import { getDisplayName } from "../../utils/helper";
import { defaultLocale } from "../../utils/i18n";
import { rejectModeration, saveModeration } from "../../utils/save";
import setModerationStatus from "../../utils/status";
import ModalConfirmation from "../common/ModalConfirmation";
import ToastNotification from "../common/ToastNotification";
import TaskStatusLabel from "./TaskStatusLabel";
import styles from "./TaskHeader.module.scss";

interface TaskHeaderProps {
  isModerated: boolean;
}

const TaskHeader = ({ isModerated }: TaskHeaderProps): ReactElement => {
  const i18n = useI18n();
  const dispatchStatus = useDispatch<Dispatch<ModerationStatusAction>>();
  const router = useRouter();

  const currentUser = useSelector((state: RootState) => state.general.user);
  const selectedTaskId = useSelector((state: RootState) => state.moderation.selectedTaskId);
  const selectedTask = useSelector((state: RootState) => state.moderation.selectedTask);
  const { name: placeNameSelected, comments } = selectedTask;

  const modifiedTaskId = useSelector((state: RootState) => state.moderation.modifiedTaskId);
  const modifiedTask = useSelector((state: RootState) => state.moderation.modifiedTask);
  const { name: placeNameModified, notifier: { notifier_type, full_name, email, phone } = {} } = modifiedTask;

  const moderationExtra = useSelector((state: RootState) => state.moderation.moderationExtra);
  const {
    photosSelected,
    created_at,
    taskType,
    status,
    userPlaceName,
    userComments,
    userDetails,
    moderator: { fullName: moderatorName },
  } = moderationExtra;
  const pageStatus = useSelector((state: RootState) => state.moderationStatus.pageStatus);
  const moderationStatus = useSelector((state: RootState) => state.moderationStatus.moderationStatus);

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

  const getApprovedValue = (statusToCheck: ModerationStatus, selectedValue: string, modifiedValue: string) => {
    return statusToCheck === ModerationStatus.Approved ? modifiedValue : selectedValue;
  };

  const saveTask = () => {
    // Save the moderated data for new or changed places using approved values only
    // For tip change requests just use the modified values
    // TODO - handle images
    const approvedTask =
      taskType === TaskType.NewPlace || taskType === TaskType.PlaceChange
        ? {
            ...modifiedTask,
            name: {
              fi: getApprovedValue(moderationStatus.name.fi, selectedTask.name.fi, modifiedTask.name.fi),
              sv: getApprovedValue(moderationStatus.name.sv, selectedTask.name.sv, modifiedTask.name.sv),
              en: getApprovedValue(moderationStatus.name.en, selectedTask.name.en, modifiedTask.name.en),
            },
            location: moderationStatus.location === ModerationStatus.Approved ? modifiedTask.location : selectedTask.location,
            description: {
              short: {
                fi: getApprovedValue(moderationStatus.description.short.fi, selectedTask.description.short.fi, modifiedTask.description.short.fi),
                sv: getApprovedValue(moderationStatus.description.short.sv, selectedTask.description.short.sv, modifiedTask.description.short.sv),
                en: getApprovedValue(moderationStatus.description.short.en, selectedTask.description.short.en, modifiedTask.description.short.en),
              },
              long: {
                fi: getApprovedValue(moderationStatus.description.long.fi, selectedTask.description.long.fi, modifiedTask.description.long.fi),
                sv: getApprovedValue(moderationStatus.description.long.sv, selectedTask.description.long.sv, modifiedTask.description.long.sv),
                en: getApprovedValue(moderationStatus.description.long.en, selectedTask.description.long.en, modifiedTask.description.long.en),
              },
            },
            address: {
              fi: {
                street: getApprovedValue(moderationStatus.address.fi.street, selectedTask.address.fi.street, modifiedTask.address.fi.street),
                postal_code: getApprovedValue(
                  moderationStatus.address.fi.postal_code,
                  selectedTask.address.fi.postal_code,
                  modifiedTask.address.fi.postal_code
                ),
                post_office: getApprovedValue(
                  moderationStatus.address.fi.post_office,
                  selectedTask.address.fi.post_office,
                  modifiedTask.address.fi.post_office
                ),
                neighborhood: getApprovedValue(
                  moderationStatus.address.fi.neighborhood,
                  selectedTask.address.fi.neighborhood,
                  modifiedTask.address.fi.neighborhood
                ),
              },
              sv: {
                street: getApprovedValue(moderationStatus.address.sv.street, selectedTask.address.sv.street, modifiedTask.address.sv.street),
                postal_code: getApprovedValue(
                  moderationStatus.address.sv.postal_code,
                  selectedTask.address.sv.postal_code,
                  modifiedTask.address.sv.postal_code
                ),
                post_office: getApprovedValue(
                  moderationStatus.address.sv.post_office,
                  selectedTask.address.sv.post_office,
                  modifiedTask.address.sv.post_office
                ),
                neighborhood: getApprovedValue(
                  moderationStatus.address.sv.neighborhood,
                  selectedTask.address.sv.neighborhood,
                  modifiedTask.address.sv.neighborhood
                ),
              },
            },
            phone: getApprovedValue(moderationStatus.phone, selectedTask.phone, modifiedTask.phone),
            email: getApprovedValue(moderationStatus.email, selectedTask.email, modifiedTask.email),
            website: {
              fi: getApprovedValue(moderationStatus.website.fi, selectedTask.website.fi, modifiedTask.website.fi),
              sv: getApprovedValue(moderationStatus.website.sv, selectedTask.website.sv, modifiedTask.website.sv),
              en: getApprovedValue(moderationStatus.website.en, selectedTask.website.en, modifiedTask.website.en),
            },
            images: modifiedTask.images,
            ontology_ids: moderationStatus.ontology_ids === ModerationStatus.Approved ? modifiedTask.ontology_ids : selectedTask.ontology_ids,
          }
        : modifiedTask;

    saveModeration(currentUser, modifiedTaskId, approvedTask, moderationExtra, router, setToast);
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
        {getDisplayName(router.locale || defaultLocale, selectedTaskId > 0 ? placeNameSelected : placeNameModified, userPlaceName)}
        {selectedTaskId ? ` (${selectedTaskId})` : ""}
      </h1>

      {(taskType === TaskType.NewPlace || taskType === TaskType.PlaceChange) && (
        <div className={styles.buttonRow}>
          {/* <Button variant="secondary">{i18n.t("moderation.button.requestTranslation")}</Button> */}
          <Button variant="secondary" iconRight={<IconArrowUndo aria-hidden />} onClick={openRejectionConfirmation}>
            {i18n.t("moderation.button.rejectChangeRequest")}
          </Button>
          <Button
            variant="secondary"
            iconRight={<IconTrash aria-hidden />}
            onClick={openDeletionConfirmation}
            disabled={taskType === TaskType.NewPlace}
          >
            {i18n.t("moderation.button.removePlace")}
          </Button>
          <Button iconRight={<IconArrowRight aria-hidden />} onClick={saveTask} disabled={!isModerated}>
            {i18n.t("moderation.button.saveInformation")}
          </Button>
        </div>
      )}

      {(taskType === TaskType.ChangeTip || taskType === TaskType.AddTip || taskType === TaskType.RemoveTip) && (
        <div className={styles.buttonRow}>
          {/* <Button variant="secondary">{i18n.t("moderation.button.requestTranslation")}</Button> */}
          <Button variant="secondary" iconRight={<IconArrowUndo aria-hidden />} onClick={openRejectionConfirmation}>
            {i18n.t("moderation.button.rejectChangeRequest")}
          </Button>
          {pageStatus !== ModerationStatus.Edited && (
            <Button variant="secondary" onClick={modifyTask}>
              {i18n.t("moderation.button.openForModifying")}
            </Button>
          )}
          {pageStatus === ModerationStatus.Edited && (
            <Button iconRight={<IconArrowRight aria-hidden />} onClick={saveTask}>
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
                <IconCheck size="s" aria-hidden />
                <div>{i18n.t("moderation.taskHeader.representative")}</div>
              </>
            ) : (
              <>
                <IconCross size="s" aria-hidden />
                <div>{i18n.t("moderation.taskHeader.notRepresentative")}</div>
              </>
            )}
          </div>
          {(taskType === TaskType.ChangeTip || taskType === TaskType.AddTip || taskType === TaskType.RemoveTip) && <div>{userDetails}</div>}
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
          {(taskType === TaskType.ChangeTip || taskType === TaskType.AddTip || taskType === TaskType.RemoveTip) && (
            <>
              {taskType === TaskType.AddTip && (
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
