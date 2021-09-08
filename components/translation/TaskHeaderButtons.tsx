import React, { Dispatch, ReactElement, SetStateAction, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, IconArrowRight } from "hds-react";
import { setTranslationTaskPageValid } from "../../state/actions/translation";
import { TranslationAction } from "../../state/actions/translationTypes";
import { RootState } from "../../state/reducers";
import { TaskStatus, TaskType, Toast } from "../../types/constants";
import { TranslationExtra, User } from "../../types/general";
import { TranslationSchema } from "../../types/translation_schema";
import { isTranslationTaskPageValid } from "../../utils/translationValidation";
import ModalConfirmation from "../common/ModalConfirmation";
import ToastNotification from "../common/ToastNotification";
import styles from "./TaskHeaderButtons.module.scss";

interface TaskHeaderButtonsProps {
  prefix: string;
  backHref: string;
  isModeration: boolean;
  saveTranslation: (
    currentUser: User | undefined,
    translatedTaskId: number,
    translatedTask: TranslationSchema,
    translationExtra: TranslationExtra,
    draft: boolean,
    router: NextRouter,
    dispatchValidation: Dispatch<TranslationAction>,
    setToast: Dispatch<SetStateAction<Toast | undefined>>
  ) => void;
}

const TaskHeaderButtons = ({ prefix, backHref, isModeration, saveTranslation }: TaskHeaderButtonsProps): ReactElement => {
  const i18n = useI18n();
  const dispatchValidation = useDispatch<Dispatch<TranslationAction>>();
  const router = useRouter();

  const currentUser = useSelector((state: RootState) => state.general.user);

  const translatedTaskId = useSelector((state: RootState) => state.translation.translatedTaskId);
  const translatedTask = useSelector((state: RootState) => state.translation.translatedTask);

  const translationExtra = useSelector((state: RootState) => state.translation.translationExtra);
  const {
    translationTask: { taskType, taskStatus },
  } = translationExtra;

  const [toast, setToast] = useState<Toast>();
  const [confirmSend, setConfirmSend] = useState(false);
  const [confirmSave, setConfirmSave] = useState(false);
  const [confirmSaveDraft, setConfirmSaveDraft] = useState(false);

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

  const saveTask = (draft: boolean) => {
    closeSendConfirmation();
    closeSaveConfirmation();
    closeSaveDraftConfirmation();

    if (draft || isTranslationTaskPageValid(prefix, translatedTask, translationExtra, dispatchValidation)) {
      // The page is valid, or this is a draft, so save the task
      saveTranslation(currentUser, translatedTaskId, translatedTask, translationExtra, draft, router, dispatchValidation, setToast);
      dispatchValidation(setTranslationTaskPageValid(true));
    } else {
      // The page is not valid, but set the page to valid then invalid to force the page to show the general validation message
      dispatchValidation(setTranslationTaskPageValid(true));
      dispatchValidation(setTranslationTaskPageValid(false));
    }
  };

  return (
    <div className={styles.taskHeaderButtons}>
      {taskType === TaskType.Translation && (
        <div className={styles.buttonRow}>
          <div className={styles.flexButton}>
            <Link href={backHref}>
              <Button variant="secondary">{i18n.t(`${prefix}.button.returnToRequests`)}</Button>
            </Link>
          </div>
          <div className="flexSpace" />
          <div className={styles.flexButton}>
            <Button variant="secondary" onClick={openSaveDraftConfirmation} disabled={taskStatus === TaskStatus.Closed}>
              {i18n.t(`${prefix}.button.saveDraft`)}
            </Button>
          </div>
          {!isModeration && (
            <div className={`${styles.flexButton} ${styles.sendButton}`}>
              <Button iconRight={<IconArrowRight aria-hidden />} onClick={openSendConfirmation} disabled={taskStatus === TaskStatus.Closed}>
                {i18n.t(`${prefix}.button.sendTranslation`)}
              </Button>
            </div>
          )}
          {isModeration && (
            <div className={`${styles.flexButton} ${styles.saveButton}`}>
              <Button iconRight={<IconArrowRight aria-hidden />} onClick={openSaveConfirmation} disabled={taskStatus === TaskStatus.Closed}>
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

      {toast && <ToastNotification prefix={prefix} toast={toast} setToast={setToast} />}
    </div>
  );
};

export default TaskHeaderButtons;
