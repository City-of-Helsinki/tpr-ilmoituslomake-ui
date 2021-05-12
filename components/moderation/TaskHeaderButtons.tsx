import React, { Dispatch, ReactElement, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, IconArrowRight, IconArrowUndo, IconTrash } from "hds-react";
import { ModerationStatusAction } from "../../state/actions/types";
import { RootState } from "../../state/reducers";
import { ItemType, ModerationStatus, TaskStatus, TaskType, Toast } from "../../types/constants";
import { approveModeration, deleteModeration, saveModerationChangeRequest, rejectModeration } from "../../utils/moderation";
import setModerationStatus from "../../utils/status";
import ModalConfirmation from "../common/ModalConfirmation";
import ToastNotification from "../common/ToastNotification";
import styles from "./TaskHeaderButtons.module.scss";

interface TaskHeaderButtonsProps {
  isModerated?: boolean;
}

const TaskHeaderButtons = ({ isModerated }: TaskHeaderButtonsProps): ReactElement => {
  const i18n = useI18n();
  const dispatchStatus = useDispatch<Dispatch<ModerationStatusAction>>();
  const router = useRouter();

  const currentUser = useSelector((state: RootState) => state.general.user);
  const selectedTaskId = useSelector((state: RootState) => state.moderation.selectedTaskId);
  const selectedTask = useSelector((state: RootState) => state.moderation.selectedTask);

  const modifiedTaskId = useSelector((state: RootState) => state.moderation.modifiedTaskId);
  const modifiedTask = useSelector((state: RootState) => state.moderation.modifiedTask);

  const moderationExtra = useSelector((state: RootState) => state.moderation.moderationExtra);
  const { photosModified, taskType, taskStatus } = moderationExtra;
  const pageStatus = useSelector((state: RootState) => state.moderationStatus.pageStatus);
  const moderationStatus = useSelector((state: RootState) => state.moderationStatus.moderationStatus);

  const [toast, setToast] = useState<Toast>();
  const [confirmApproval, setConfirmApproval] = useState(false);
  const [confirmRejection, setConfirmRejection] = useState(false);
  const [confirmDeletion, setConfirmDeletion] = useState(false);

  const modifyTask = () => {
    // Make the components editable for using tip info
    setModerationStatus(photosModified, dispatchStatus);
  };

  const makePlaceInfoChangeRequest = (itemType: ItemType) => {
    // Make a new moderation task for the notification place by making a change request
    const placeInfoChangeRequest = {
      target: selectedTaskId,
      item_type: itemType,
      user_place_name: "",
      user_comments: i18n.t("moderation.taskHeader.moderatorChangeRequest"),
      user_details: currentUser ? `${currentUser.first_name} ${currentUser.last_name}`.trim() : "",
    };
    saveModerationChangeRequest(placeInfoChangeRequest, router, setToast);
  };

  const openApprovalConfirmation = () => {
    setConfirmApproval(true);
  };

  const closeApprovalConfirmation = () => {
    setConfirmApproval(false);
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

  const approveTask = () => {
    closeApprovalConfirmation();

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

    approveModeration(currentUser, modifiedTaskId, approvedTask, moderationExtra, router, setToast);
  };

  const rejectTask = () => {
    closeRejectionConfirmation();
    rejectModeration(currentUser, modifiedTaskId, moderationExtra, router, setToast);
  };

  const removePlace = () => {
    closeDeletionConfirmation();
    deleteModeration(currentUser, modifiedTaskId, moderationExtra, router, setToast);
  };

  return (
    <div className={styles.taskHeaderButtons}>
      {(taskType === TaskType.NewPlace || taskType === TaskType.PlaceChange) && (
        <div className={styles.buttonRow}>
          {/* <Button variant="secondary">{i18n.t("moderation.button.requestTranslation")}</Button> */}
          <Button
            variant="secondary"
            iconRight={<IconArrowUndo aria-hidden />}
            onClick={openRejectionConfirmation}
            disabled={taskStatus === TaskStatus.Closed}
          >
            {i18n.t("moderation.button.rejectChangeRequest")}
          </Button>
          <Button
            iconRight={<IconArrowRight aria-hidden />}
            onClick={openApprovalConfirmation}
            disabled={!isModerated || taskStatus === TaskStatus.Closed}
          >
            {i18n.t("moderation.button.saveInformation")}
          </Button>
        </div>
      )}

      {(taskType === TaskType.ChangeTip || taskType === TaskType.AddTip) && (
        <div className={styles.buttonRow}>
          {/* <Button variant="secondary">{i18n.t("moderation.button.requestTranslation")}</Button> */}
          <Button
            variant="secondary"
            iconRight={<IconArrowUndo aria-hidden />}
            onClick={openRejectionConfirmation}
            disabled={taskStatus === TaskStatus.Closed}
          >
            {i18n.t("moderation.button.rejectChangeRequest")}
          </Button>
          {pageStatus !== ModerationStatus.Edited && (
            <Button variant="secondary" onClick={modifyTask} disabled={taskStatus === TaskStatus.Closed}>
              {i18n.t("moderation.button.openForModifying")}
            </Button>
          )}
          {pageStatus === ModerationStatus.Edited && (
            <Button iconRight={<IconArrowRight aria-hidden />} onClick={openApprovalConfirmation} disabled={taskStatus === TaskStatus.Closed}>
              {i18n.t("moderation.button.saveInformation")}
            </Button>
          )}
        </div>
      )}

      {taskType === TaskType.RemoveTip && (
        <div className={styles.buttonRow}>
          <Button
            variant="secondary"
            iconRight={<IconArrowUndo aria-hidden />}
            onClick={openRejectionConfirmation}
            disabled={taskStatus === TaskStatus.Closed}
          >
            {i18n.t("moderation.button.rejectChangeRequest")}
          </Button>
          <Button iconRight={<IconTrash aria-hidden />} onClick={openDeletionConfirmation} disabled={taskStatus === TaskStatus.Closed}>
            {i18n.t("moderation.button.removePlace")}
          </Button>
        </div>
      )}

      {taskType === TaskType.PlaceInfo && (
        <div className={styles.buttonRow}>
          <Button
            variant="secondary"
            onClick={() => makePlaceInfoChangeRequest(ItemType.ChangeRequestChange)}
            disabled={taskStatus === TaskStatus.Closed}
          >
            {i18n.t("moderation.button.openForModifying")}
          </Button>
          <Button
            variant="secondary"
            iconRight={<IconTrash aria-hidden />}
            onClick={() => makePlaceInfoChangeRequest(ItemType.ChangeRequestDelete)}
            disabled={taskStatus === TaskStatus.Closed}
          >
            {i18n.t("moderation.button.removePlace")}
          </Button>
        </div>
      )}

      {confirmApproval && (
        <ModalConfirmation
          open={confirmApproval}
          titleKey="moderation.button.approveChangeRequest"
          messageKey="moderation.confirmation.approveChangeRequest"
          cancelKey="moderation.button.cancel"
          confirmKey="moderation.button.approve"
          closeCallback={closeApprovalConfirmation}
          confirmCallback={approveTask}
        />
      )}

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

TaskHeaderButtons.defaultProps = {
  isModerated: false,
};

export default TaskHeaderButtons;
