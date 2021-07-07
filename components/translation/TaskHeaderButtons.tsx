import React, { ReactElement, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, IconArrowRight } from "hds-react";
import { RootState } from "../../state/reducers";
import { TaskStatus, TaskType, Toast } from "../../types/constants";
import { saveTranslation } from "../../utils/translation";
import ModalConfirmation from "../common/ModalConfirmation";
import ToastNotification from "../common/ToastNotification";
import styles from "./TaskHeaderButtons.module.scss";

interface TaskHeaderButtonsProps {
  isTranslated?: boolean;
}

const TaskHeaderButtons = ({ isTranslated }: TaskHeaderButtonsProps): ReactElement => {
  const i18n = useI18n();
  const router = useRouter();

  const currentUser = useSelector((state: RootState) => state.general.user);

  const translatedTaskId = useSelector((state: RootState) => state.translation.translatedTaskId);
  const translatedTask = useSelector((state: RootState) => state.translation.translatedTask);

  const translationExtra = useSelector((state: RootState) => state.translation.translationExtra);
  const { photosTranslated, taskType, taskStatus } = translationExtra;

  const [toast, setToast] = useState<Toast>();
  const [confirmSave, setConfirmSave] = useState(false);
  const [confirmSaveDraft, setConfirmSaveDraft] = useState(false);

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
    closeSaveConfirmation();
    closeSaveDraftConfirmation();

    saveTranslation(currentUser, translatedTaskId, translatedTask, photosTranslated, draft, router, setToast);
  };

  return (
    <div className={styles.taskHeaderButtons}>
      {taskType === TaskType.Translation && (
        <div className={styles.buttonRow}>
          <Link href="/translation/request">
            <Button variant="secondary" className={styles.returnButton}>
              {i18n.t("translation.button.returnToRequests")}
            </Button>
          </Link>
          <div className="flexSpace" />
          <Button variant="secondary" onClick={openSaveDraftConfirmation} disabled={taskStatus === TaskStatus.Closed}>
            {i18n.t("translation.button.saveDraft")}
          </Button>
          <Button
            iconRight={<IconArrowRight aria-hidden />}
            onClick={openSaveConfirmation}
            disabled={!isTranslated || taskStatus === TaskStatus.Closed}
          >
            {i18n.t("translation.button.sendTranslation")}
          </Button>
        </div>
      )}

      {confirmSave && (
        <ModalConfirmation
          open={confirmSave}
          titleKey="translation.button.sendTranslation"
          messageKey="translation.confirmation.sendTranslation"
          cancelKey="translation.button.back"
          confirmKey="translation.button.save"
          closeCallback={closeSaveConfirmation}
          confirmCallback={() => saveTask(false)}
        />
      )}

      {confirmSaveDraft && (
        <ModalConfirmation
          open={confirmSaveDraft}
          titleKey="translation.button.saveDraft"
          messageKey="translation.confirmation.saveDraft"
          cancelKey="translation.button.back"
          confirmKey="translation.button.save"
          closeCallback={closeSaveDraftConfirmation}
          confirmCallback={() => saveTask(true)}
        />
      )}

      {toast && <ToastNotification prefix="translation" toast={toast} setToast={setToast} />}
    </div>
  );
};

TaskHeaderButtons.defaultProps = {
  isTranslated: false,
};

export default TaskHeaderButtons;
