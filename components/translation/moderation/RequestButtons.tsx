import React, { Dispatch, ReactElement, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, IconArrowRight } from "hds-react";
import { setModerationTranslationRequestPageValid } from "../../../state/actions/moderationTranslation";
import { ModerationTranslationAction } from "../../../state/actions/moderationTranslationTypes";
import { RootState } from "../../../state/reducers";
import { TaskStatus, TaskType, Toast } from "../../../types/constants";
import { cancelModerationTranslationRequest, saveModerationTranslationRequest } from "../../../utils/moderation";
import { isModerationTranslationRequestPageValid } from "../../../utils/moderationValidation";
import ModalConfirmation from "../../common/ModalConfirmation";
import ToastNotification from "../../common/ToastNotification";
import styles from "./RequestButtons.module.scss";

const RequestButtons = (): ReactElement => {
  const i18n = useI18n();
  const dispatchValidation = useDispatch<Dispatch<ModerationTranslationAction>>();
  const router = useRouter();

  const currentUser = useSelector((state: RootState) => state.general.user);

  const requestDetail = useSelector((state: RootState) => state.moderationTranslation.requestDetail);
  const { requestId, taskType, taskStatus } = requestDetail;

  const [toast, setToast] = useState<Toast>();
  const [confirmSave, setConfirmSave] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

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

  const saveRequest = () => {
    closeSaveConfirmation();

    if (isModerationTranslationRequestPageValid(requestDetail, dispatchValidation)) {
      // The page is valid, so save the request
      saveModerationTranslationRequest(currentUser, requestDetail, router, dispatchValidation, setToast);
      dispatchValidation(setModerationTranslationRequestPageValid(true));
    } else {
      // The page is not valid, but set the page to valid then invalid to force the page to show the general validation message
      dispatchValidation(setModerationTranslationRequestPageValid(true));
      dispatchValidation(setModerationTranslationRequestPageValid(false));
    }
  };

  const cancelRequest = () => {
    closeCancelConfirmation();

    cancelModerationTranslationRequest(currentUser, requestId, router, setToast);
  };

  return (
    <div className={styles.requestHeaderButtons}>
      {taskType === TaskType.Translation && (
        <div className={styles.buttonRow}>
          <div className={styles.flexButton}>
            <Link href="/moderation/translation">
              <Button variant="secondary">{i18n.t("moderation.button.close")}</Button>
            </Link>
          </div>
          <div className="flexSpace" />
          {requestId > 0 && (
            <div className={styles.flexButton}>
              <Button variant="secondary" onClick={openCancelConfirmation} disabled={taskStatus === TaskStatus.Closed}>
                {i18n.t("moderation.button.cancelTranslationRequest")}
              </Button>
            </div>
          )}
          <div className={`${styles.flexButton} ${styles.sendButton}`}>
            <Button iconRight={<IconArrowRight aria-hidden />} onClick={openSaveConfirmation} disabled={taskStatus === TaskStatus.Closed}>
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
          cancelKey="moderation.button.back"
          confirmKey="moderation.button.send"
          closeCallback={closeSaveConfirmation}
          confirmCallback={() => saveRequest()}
        />
      )}

      {confirmCancel && (
        <ModalConfirmation
          open={confirmCancel}
          titleKey="moderation.button.cancelTranslationRequest"
          messageKey="moderation.confirmation.cancelTranslationRequest"
          cancelKey="moderation.button.back"
          confirmKey="moderation.button.cancel2"
          closeCallback={closeCancelConfirmation}
          confirmCallback={() => cancelRequest()}
        />
      )}

      {toast && <ToastNotification prefix="moderation" toast={toast} setToast={setToast} />}
    </div>
  );
};

RequestButtons.defaultProps = {
  isTranslated: false,
};

export default RequestButtons;
