import React, { Dispatch, ReactElement, SetStateAction, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, IconArrowRight } from "hds-react";
import {
  setModerationTranslationRequestPageValid,
  setModerationTranslationRequestValidationSummary,
} from "../../../state/actions/moderationTranslation";
import { ModerationTranslationAction } from "../../../state/actions/moderationTranslationTypes";
import { RootState } from "../../../state/reducers";
import { TaskStatus, TaskType, Toast } from "../../../types/constants";
import { ModerationTranslationRequestResultTask } from "../../../types/general";
import { cancelModerationTranslationRequest, saveModerationTranslationRequest } from "../../../utils/moderation";
import {
  getModerationTranslationRequestPageValidationSummary,
  isModerationTranslationRequestPageChanged,
  isModerationTranslationRequestPageValid,
} from "../../../utils/moderationValidation";
import ModalConfirmation from "../../common/ModalConfirmation";
import styles from "./RequestButtons.module.scss";

interface RequestButtonsProps {
  requestStatus: (tasks: ModerationTranslationRequestResultTask[]) => TaskStatus;
  setToast: Dispatch<SetStateAction<Toast | undefined>>;
}

const RequestButtons = ({ requestStatus, setToast }: RequestButtonsProps): ReactElement => {
  const i18n = useI18n();
  const dispatchValidation = useDispatch<Dispatch<ModerationTranslationAction>>();
  const router = useRouter();

  const currentUser = useSelector((state: RootState) => state.general.user);
  const requestValidation = useSelector((state: RootState) => state.moderationTranslation.requestValidation);

  const requestDetail = useSelector((state: RootState) => state.moderationTranslation.requestDetail);
  const { id: requestId, taskType, tasks } = requestDetail;
  const taskStatus = useMemo(() => requestStatus(tasks), [requestStatus, tasks]);

  const [confirmSave, setConfirmSave] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [confirmUnsavedChanges, setConfirmUnsavedChanges] = useState(false);

  const openSaveConfirmation = () => {
    setConfirmSave(true);
  };

  const closeSaveConfirmation = () => {
    setConfirmSave(false);
  };

  const openCancelConfirmation = () => {
    setConfirmCancel(true);
  };

  const closeCancelConfirmation = () => {
    setConfirmCancel(false);
  };

  const openUnsavedChangesConfirmation = () => {
    setConfirmUnsavedChanges(true);
  };

  const closeUnsavedChangesConfirmation = () => {
    setConfirmUnsavedChanges(false);
  };

  const saveRequest = () => {
    closeSaveConfirmation();

    if (isModerationTranslationRequestPageValid(requestDetail, dispatchValidation)) {
      // The page is valid, so save the request
      dispatchValidation(setModerationTranslationRequestValidationSummary({}));
      saveModerationTranslationRequest(currentUser, requestDetail, router, dispatchValidation, setToast);
      dispatchValidation(setModerationTranslationRequestPageValid(true));
    } else {
      // The page is not valid, but set the page to valid then invalid to force the page to show the general validation message
      dispatchValidation(setModerationTranslationRequestValidationSummary(getModerationTranslationRequestPageValidationSummary(requestDetail, i18n)));
      dispatchValidation(setModerationTranslationRequestPageValid(true));
      dispatchValidation(setModerationTranslationRequestPageValid(false));
    }
  };

  const cancelRequest = () => {
    closeCancelConfirmation();

    cancelModerationTranslationRequest(currentUser, requestId, router, setToast);
  };

  const goBackToList = () => {
    router.push("/moderation/translation");
  };

  const checkUnsavedChanges = () => {
    const changes = isModerationTranslationRequestPageChanged(requestValidation);
    if (changes) {
      openUnsavedChangesConfirmation();
    } else {
      goBackToList();
    }
  };

  return (
    <div className={styles.requestHeaderButtons}>
      {taskType === TaskType.Translation && (
        <div className={styles.buttonRow}>
          <div className={styles.flexButton}>
            <Button variant="secondary" onClick={checkUnsavedChanges}>
              {i18n.t("moderation.button.close")}
            </Button>
          </div>
          <div className="flexSpace" />
          {requestId > 0 && (
            <div className={styles.flexButton}>
              <Button
                variant="secondary"
                onClick={openCancelConfirmation}
                disabled={taskStatus === TaskStatus.InProgress || taskStatus === TaskStatus.Closed || taskStatus === TaskStatus.Cancelled}
              >
                {i18n.t("moderation.button.cancelTranslationRequest")}
              </Button>
            </div>
          )}
          <div className={`${styles.flexButton} ${styles.sendButton}`}>
            <Button
              iconRight={<IconArrowRight aria-hidden />}
              onClick={openSaveConfirmation}
              disabled={taskStatus === TaskStatus.Closed || taskStatus === TaskStatus.Cancelled}
            >
              {i18n.t("moderation.button.sendTranslationRequest")}
            </Button>
          </div>
        </div>
      )}

      {confirmSave && (
        <ModalConfirmation
          open={confirmSave}
          titleKey="moderation.button.sendTranslationRequest"
          messageKey="moderation.confirmation.sendTranslationRequest"
          cancelKey="moderation.button.no"
          confirmKey="moderation.button.yes"
          closeCallback={closeSaveConfirmation}
          confirmCallback={() => saveRequest()}
        />
      )}

      {confirmCancel && (
        <ModalConfirmation
          open={confirmCancel}
          titleKey="moderation.button.cancelTranslationRequest"
          messageKey="moderation.confirmation.cancelTranslationRequest"
          cancelKey="moderation.button.no"
          confirmKey="moderation.button.yes"
          closeCallback={closeCancelConfirmation}
          confirmCallback={() => cancelRequest()}
        />
      )}

      {confirmUnsavedChanges && (
        <ModalConfirmation
          open={confirmUnsavedChanges}
          titleKey="moderation.confirmation.unsavedChanges.title"
          messageKey="moderation.confirmation.unsavedChanges.message"
          cancelKey="moderation.button.no"
          confirmKey="moderation.button.yes"
          closeCallback={closeUnsavedChangesConfirmation}
          confirmCallback={goBackToList}
        />
      )}
    </div>
  );
};

export default RequestButtons;
