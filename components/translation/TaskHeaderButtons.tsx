import React, { Dispatch, ReactElement, SetStateAction, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NextRouter, useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, IconArrowRight } from "hds-react";
import { setTranslationTaskPageValid, setTranslationTaskValidationSummary } from "../../state/actions/translation";
import { TranslationAction } from "../../state/actions/translationTypes";
import { RootState } from "../../state/reducers";
import { TaskStatus, TaskType, Toast } from "../../types/constants";
import { TranslationExtra, User } from "../../types/general";
import { NotificationSchema } from "../../types/notification_schema";
import { TranslationSchema } from "../../types/translation_schema";
import { getTranslationTaskPageValidationSummary, isTranslationTaskPageChanged, isTranslationTaskPageValid } from "../../utils/translationValidation";
import ModalConfirmation from "../common/ModalConfirmation";
import styles from "./TaskHeaderButtons.module.scss";

interface TaskHeaderButtonsProps {
  prefix: string;
  backHref: string;
  isModeration: boolean;
  saveTranslation: (
    currentUser: User | undefined,
    translatedTaskId: number,
    selectedTask: NotificationSchema,
    translatedTask: TranslationSchema,
    translationExtra: TranslationExtra,
    draft: boolean,
    router: NextRouter,
    dispatchValidation: Dispatch<TranslationAction>,
    setToast: Dispatch<SetStateAction<Toast | undefined>>
  ) => void;
  setToast: Dispatch<SetStateAction<Toast | undefined>>;
}

const TaskHeaderButtons = ({ prefix, backHref, isModeration, saveTranslation, setToast }: TaskHeaderButtonsProps): ReactElement => {
  const i18n = useI18n();
  const dispatchValidation = useDispatch<Dispatch<TranslationAction>>();
  const router = useRouter();

  const currentUser = useSelector((state: RootState) => state.general.user);

  const translatedTaskId = useSelector((state: RootState) => state.translation.translatedTaskId);
  const selectedTask = useSelector((state: RootState) => state.translation.selectedTask);
  const translatedTask = useSelector((state: RootState) => state.translation.translatedTask);
  const taskValidation = useSelector((state: RootState) => state.translation.taskValidation);

  const translationExtra = useSelector((state: RootState) => state.translation.translationExtra);
  const {
    translationTask: { taskType, taskStatus },
  } = translationExtra;

  const [confirmSend, setConfirmSend] = useState(false);
  const [confirmSave, setConfirmSave] = useState(false);
  const [confirmSaveDraft, setConfirmSaveDraft] = useState(false);
  const [confirmUnsavedChanges, setConfirmUnsavedChanges] = useState(false);

  const openSendConfirmation = () => {
    setConfirmSend(true);
  };

  const closeSendConfirmation = () => {
    setConfirmSend(false);
  };

  const openSaveConfirmation = () => {
    setConfirmSave(true);
  };

  const closeSaveConfirmation = () => {
    setConfirmSave(false);
  };

  const openSaveDraftConfirmation = () => {
    setConfirmSaveDraft(true);
  };

  const closeSaveDraftConfirmation = () => {
    setConfirmSaveDraft(false);
  };

  const openUnsavedChangesConfirmation = () => {
    setConfirmUnsavedChanges(true);
  };

  const closeUnsavedChangesConfirmation = () => {
    setConfirmUnsavedChanges(false);
  };

  const saveTask = (draft: boolean) => {
    closeSendConfirmation();
    closeSaveConfirmation();
    closeSaveDraftConfirmation();

    if (draft || isTranslationTaskPageValid(prefix, selectedTask, translatedTask, translationExtra, dispatchValidation)) {
      // The page is valid, or this is a draft, so save the task
      dispatchValidation(setTranslationTaskValidationSummary({}));
      saveTranslation(currentUser, translatedTaskId, selectedTask, translatedTask, translationExtra, draft, router, dispatchValidation, setToast);
      dispatchValidation(setTranslationTaskPageValid(true));
    } else {
      // The page is not valid, but set the page to valid then invalid to force the page to show the general validation message
      dispatchValidation(
        setTranslationTaskValidationSummary(getTranslationTaskPageValidationSummary(prefix, selectedTask, translatedTask, translationExtra, i18n))
      );
      dispatchValidation(setTranslationTaskPageValid(true));
      dispatchValidation(setTranslationTaskPageValid(false));
    }
  };

  const goBackToList = () => {
    router.push(backHref);
  };

  const checkUnsavedChanges = () => {
    const changes = isTranslationTaskPageChanged(translationExtra, taskValidation);
    if (changes) {
      openUnsavedChangesConfirmation();
    } else {
      goBackToList();
    }
  };

  return (
    <div className={styles.taskHeaderButtons}>
      {taskType === TaskType.Translation && (
        <div className={styles.buttonRow}>
          <div className={styles.flexButton}>
            <Button variant="secondary" onClick={checkUnsavedChanges}>
              {i18n.t(`${prefix}.button.back`)}
            </Button>
          </div>
          <div className="flexSpace" />
          <div className={styles.flexButton}>
            <Button
              variant="secondary"
              onClick={openSaveDraftConfirmation}
              disabled={taskStatus === TaskStatus.Closed || taskStatus === TaskStatus.Cancelled}
            >
              {i18n.t(`${prefix}.button.saveDraft`)}
            </Button>
          </div>
          {!isModeration && (
            <div className={`${styles.flexButton} ${styles.sendButton}`}>
              <Button
                iconRight={<IconArrowRight aria-hidden />}
                onClick={openSendConfirmation}
                disabled={taskStatus === TaskStatus.Closed || taskStatus === TaskStatus.Cancelled}
              >
                {i18n.t(`${prefix}.button.sendTranslation`)}
              </Button>
            </div>
          )}
          {isModeration && (
            <div className={`${styles.flexButton} ${styles.saveButton}`}>
              <Button
                iconRight={<IconArrowRight aria-hidden />}
                onClick={openSaveConfirmation}
                disabled={taskStatus === TaskStatus.Closed || taskStatus === TaskStatus.Cancelled}
              >
                {i18n.t(`${prefix}.button.saveTranslation`)}
              </Button>
            </div>
          )}
        </div>
      )}

      {confirmSend && (
        <ModalConfirmation
          open={confirmSend}
          titleKey={`${prefix}.button.sendTranslation`}
          messageKey={`${prefix}.confirmation.sendTranslation`}
          cancelKey={`${prefix}.button.no`}
          confirmKey={`${prefix}.button.yes`}
          closeCallback={closeSendConfirmation}
          confirmCallback={() => saveTask(false)}
        />
      )}

      {confirmSave && (
        <ModalConfirmation
          open={confirmSave}
          titleKey={`${prefix}.button.saveTranslation`}
          messageKey={`${prefix}.confirmation.saveTranslation`}
          cancelKey={`${prefix}.button.no`}
          confirmKey={`${prefix}.button.yes`}
          closeCallback={closeSaveConfirmation}
          confirmCallback={() => saveTask(false)}
        />
      )}

      {confirmSaveDraft && (
        <ModalConfirmation
          open={confirmSaveDraft}
          titleKey={`${prefix}.button.saveDraft`}
          messageKey={`${prefix}.confirmation.saveDraft`}
          cancelKey={`${prefix}.button.no`}
          confirmKey={`${prefix}.button.yes`}
          closeCallback={closeSaveDraftConfirmation}
          confirmCallback={() => saveTask(true)}
        />
      )}

      {confirmUnsavedChanges && (
        <ModalConfirmation
          open={confirmUnsavedChanges}
          titleKey={`${prefix}.confirmation.unsavedChanges.title`}
          messageKey={`${prefix}.confirmation.unsavedChanges.message`}
          cancelKey={`${prefix}.button.no`}
          confirmKey={`${prefix}.button.yes`}
          closeCallback={closeUnsavedChangesConfirmation}
          confirmCallback={goBackToList}
        />
      )}
    </div>
  );
};

export default TaskHeaderButtons;
