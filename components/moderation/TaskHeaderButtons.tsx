import React, { ReactElement, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, IconArrowRight, IconArrowUndo, IconTrash } from "hds-react";
import { RootState } from "../../state/reducers";
import { ItemType, ModerationStatus, TaskStatus, TaskType, Toast } from "../../types/constants";
import { approveModeration, deleteModeration, saveModerationChangeRequest, rejectModeration } from "../../utils/moderation";
import ModalConfirmation from "../common/ModalConfirmation";
import ToastNotification from "../common/ToastNotification";
import styles from "./TaskHeaderButtons.module.scss";

interface TaskHeaderButtonsProps {
  isModerated?: boolean;
}

const TaskHeaderButtons = ({ isModerated }: TaskHeaderButtonsProps): ReactElement => {
  const i18n = useI18n();
  const router = useRouter();

  const currentUser = useSelector((state: RootState) => state.general.user);
  const selectedTaskId = useSelector((state: RootState) => state.moderation.selectedTaskId);
  const selectedTask = useSelector((state: RootState) => state.moderation.selectedTask);

  const modifiedTaskId = useSelector((state: RootState) => state.moderation.modifiedTaskId);
  const modifiedTask = useSelector((state: RootState) => state.moderation.modifiedTask);

  const moderationExtra = useSelector((state: RootState) => state.moderation.moderationExtra);
  const { photosUuids, photosSelected, photosModified, taskType, taskStatus } = moderationExtra;
  const moderationStatus = useSelector((state: RootState) => state.moderationStatus.moderationStatus);
  const { photos: photosStatus } = moderationStatus;

  const [toast, setToast] = useState<Toast>();
  const [confirmApproval, setConfirmApproval] = useState(false);
  const [confirmRejection, setConfirmRejection] = useState(false);
  const [confirmSave, setConfirmSave] = useState(false);
  const [confirmDeletion, setConfirmDeletion] = useState(false);
  const [confirmAddCancellation, setConfirmAddCancellation] = useState(false);
  const [confirmChangeCancellation, setConfirmChangeCancellation] = useState(false);
  const [confirmDeleteCancellation, setConfirmDeleteCancellation] = useState(false);

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

  const openSaveConfirmation = () => {
    setConfirmSave(true);
  };

  const closeSaveConfirmation = () => {
    setConfirmSave(false);
  };

  const openDeletionConfirmation = () => {
    setConfirmDeletion(true);
  };

  const closeDeletionConfirmation = () => {
    setConfirmDeletion(false);
  };

  const openAddCancellationConfirmation = () => {
    setConfirmAddCancellation(true);
  };

  const closeAddCancellationConfirmation = () => {
    setConfirmAddCancellation(false);
  };

  const openChangeCancellationConfirmation = () => {
    setConfirmChangeCancellation(true);
  };

  const closeChangeCancellationConfirmation = () => {
    setConfirmChangeCancellation(false);
  };

  const openDeleteCancellationConfirmation = () => {
    setConfirmDeleteCancellation(true);
  };

  const closeDeleteCancellationConfirmation = () => {
    setConfirmDeleteCancellation(false);
  };

  const getApprovedValue = (statusToCheck: ModerationStatus, selectedValue: string, modifiedValue: string) => {
    return statusToCheck === ModerationStatus.Approved ? modifiedValue : selectedValue;
  };

  const approveTask = () => {
    closeApprovalConfirmation();
    closeSaveConfirmation();

    // Save the moderated data for new or changed places using approved values only
    // For tip change requests just use the modified values
    const approvedTask =
      taskType === TaskType.NewPlace || taskType === TaskType.PlaceChange || taskType === TaskType.ChangeTip || taskType === TaskType.AddTip
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
                neighborhood_id: getApprovedValue(
                  moderationStatus.address.fi.neighborhood_id,
                  selectedTask.address.fi.neighborhood_id,
                  modifiedTask.address.fi.neighborhood_id
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
                neighborhood_id: getApprovedValue(
                  moderationStatus.address.sv.neighborhood_id,
                  selectedTask.address.sv.neighborhood_id,
                  modifiedTask.address.sv.neighborhood_id
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
            images: [],
            ontology_ids: moderationStatus.ontology_ids === ModerationStatus.Approved ? modifiedTask.ontology_ids : selectedTask.ontology_ids,
            extra_keywords: moderationStatus.extra_keywords === ModerationStatus.Approved ? modifiedTask.extra_keywords : selectedTask.extra_keywords,
          }
        : modifiedTask;

    // Save the moderated image data for new or changed places using approved values only
    // For tip change requests, the images are handled by the moderator themselves, so use the modified image values as specified
    // The moderation approval for new images needs both the original url and the proxied preview url
    // Filter out photos that the user has removed
    // After checking, filter out any invalid images, so those with an empty url
    const approvedPhotos =
      taskType === TaskType.NewPlace || taskType === TaskType.PlaceChange || taskType === TaskType.ChangeTip || taskType === TaskType.AddTip
        ? photosUuids
            .map((uuid, index) => {
              const photoSelected = photosSelected[index];
              const photoModified = photosModified[index];
              const photoStatus = photosStatus[index];
              const { sourceType, new: isNewImage } = photoModified;
              const isPhotoToBeApproved = photosModified.some((photo) => photo.uuid === uuid);

              return isPhotoToBeApproved
                ? {
                    index,
                    uuid,
                    sourceType,
                    url: getApprovedValue(photoStatus.url, photoSelected.url, photoModified.url),
                    altText: {
                      fi: getApprovedValue(photoStatus.altText.fi, photoSelected.altText.fi ?? "", photoModified.altText.fi ?? ""),
                      sv: getApprovedValue(photoStatus.altText.sv, photoSelected.altText.sv ?? "", photoModified.altText.sv ?? ""),
                      en: getApprovedValue(photoStatus.altText.en, photoSelected.altText.en ?? "", photoModified.altText.en ?? ""),
                    },
                    permission: getApprovedValue(photoStatus.permission, photoSelected.permission as string, photoModified.permission as string),
                    source: getApprovedValue(photoStatus.source, photoSelected.source, photoModified.source),
                    new: isNewImage,
                    base64: getApprovedValue(photoStatus.url, photoSelected.base64 as string, photoModified.base64 as string),
                    preview: getApprovedValue(photoStatus.url, photoSelected.preview as string, photoModified.preview as string),
                  }
                : {
                    index,
                    uuid,
                    sourceType: "",
                    url: "",
                    altText: {
                      fi: "",
                      sv: "",
                      en: "",
                    },
                    permission: "",
                    source: "",
                    new: isNewImage,
                    base64: "",
                    preview: "",
                  };
            })
            .filter((photo) => !!photo.url && photo.url.length > 0)
        : photosUuids
            .map((uuid, index) => {
              const photoModified = photosModified[index];
              const { sourceType, new: isNewImage } = photoModified;
              const isPhotoToBeApproved = photosModified.some((photo) => photo.uuid === uuid);

              return isPhotoToBeApproved
                ? {
                    index,
                    uuid,
                    sourceType,
                    url: photoModified.url,
                    altText: {
                      fi: photoModified.altText.fi ?? "",
                      sv: photoModified.altText.sv ?? "",
                      en: photoModified.altText.en ?? "",
                    },
                    permission: photoModified.permission,
                    source: photoModified.source,
                    new: isNewImage,
                    base64: photoModified.base64,
                    preview: photoModified.preview,
                  }
                : {
                    index,
                    uuid,
                    sourceType: "",
                    url: "",
                    altText: {
                      fi: "",
                      sv: "",
                      en: "",
                    },
                    permission: "",
                    source: "",
                    new: isNewImage,
                    base64: "",
                    preview: "",
                  };
            })
            .filter((photo) => !!photo.url && photo.url.length > 0);

    approveModeration(currentUser, modifiedTaskId, approvedTask, approvedPhotos, moderationExtra, router, setToast);
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
            onClick={taskType === TaskType.ChangeTip ? openChangeCancellationConfirmation : openAddCancellationConfirmation}
            disabled={taskStatus === TaskStatus.Closed}
          >
            {taskType === TaskType.ChangeTip ? i18n.t("moderation.button.cancelChange") : i18n.t("moderation.button.cancelAdd")}
          </Button>
          <Button
            iconRight={<IconArrowRight aria-hidden />}
            onClick={openSaveConfirmation}
            disabled={!isModerated || taskStatus === TaskStatus.Closed}
          >
            {i18n.t("moderation.button.saveInformation")}
          </Button>
        </div>
      )}

      {taskType === TaskType.RemoveTip && (
        <div className={styles.buttonRow}>
          <Button
            variant="secondary"
            iconRight={<IconArrowUndo aria-hidden />}
            onClick={openDeleteCancellationConfirmation}
            disabled={taskStatus === TaskStatus.Closed}
          >
            {i18n.t("moderation.button.cancelRemove")}
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
          cancelKey="moderation.button.back"
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
          cancelKey="moderation.button.back"
          confirmKey="moderation.button.reject"
          closeCallback={closeRejectionConfirmation}
          confirmCallback={rejectTask}
        />
      )}

      {confirmSave && (
        <ModalConfirmation
          open={confirmSave}
          titleKey="moderation.button.savePlace"
          messageKey="moderation.confirmation.savePlace"
          cancelKey="moderation.button.back"
          confirmKey="moderation.button.save"
          closeCallback={closeSaveConfirmation}
          confirmCallback={approveTask}
        />
      )}

      {confirmDeletion && (
        <ModalConfirmation
          open={confirmDeletion}
          titleKey="moderation.button.removePlace"
          messageKey="moderation.confirmation.removePlace"
          cancelKey="moderation.button.back"
          confirmKey="moderation.button.remove"
          closeCallback={closeDeletionConfirmation}
          confirmCallback={removePlace}
        />
      )}

      {confirmAddCancellation && (
        <ModalConfirmation
          open={confirmAddCancellation}
          titleKey="moderation.button.cancelAdd"
          messageKey="moderation.confirmation.cancelAdd"
          cancelKey="moderation.button.back"
          confirmKey="moderation.button.cancelAdd"
          closeCallback={closeAddCancellationConfirmation}
          confirmCallback={rejectTask}
        />
      )}

      {confirmChangeCancellation && (
        <ModalConfirmation
          open={confirmChangeCancellation}
          titleKey="moderation.button.cancelChange"
          messageKey="moderation.confirmation.cancelChange"
          cancelKey="moderation.button.back"
          confirmKey="moderation.button.cancelChange"
          closeCallback={closeChangeCancellationConfirmation}
          confirmCallback={rejectTask}
        />
      )}

      {confirmDeleteCancellation && (
        <ModalConfirmation
          open={confirmDeleteCancellation}
          titleKey="moderation.button.cancelRemove"
          messageKey="moderation.confirmation.cancelRemove"
          cancelKey="moderation.button.back"
          confirmKey="moderation.button.cancelRemove"
          closeCallback={closeDeleteCancellationConfirmation}
          confirmCallback={rejectTask}
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
