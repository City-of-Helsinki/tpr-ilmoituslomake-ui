import React, { ReactElement, useState } from "react";
import { useSelector } from "react-redux";
import { useI18n } from "next-localization";
import { Button, IconArrowRight, IconArrowUndo, IconCheck, IconCross, IconTrash, Notification as HdsNotification } from "hds-react";
import Cookies from "js-cookie";
import moment from "moment";
import { RootState } from "../../state/reducers";
import { DATETIME_FORMAT, NotifierType, TaskType } from "../../types/constants";
import validateNotificationData from "../../utils/validation";
import TaskStatusLabel from "./TaskStatusLabel";
import styles from "./TaskHeader.module.scss";

const TaskHeader = (): ReactElement => {
  const i18n = useI18n();

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
    created_at,
    taskType,
    status,
    moderator: { fullName: moderatorName },
  } = moderationExtra;

  enum Toast {
    NotAuthenticated = "notAuthenticated",
    ValidationFailed = "validationFailed",
    SaveFailed = "saveFailed",
    SaveSucceeded = "saveSucceeded",
  }
  const [toast, setToast] = useState<Toast>();

  const saveModeration = async () => {
    try {
      const valid = validateNotificationData(modifiedTask);

      if (currentUser?.authenticated && valid) {
        // Send the Cross Site Request Forgery token, otherwise the backend returns the error "CSRF Failed: CSRF token missing or incorrect."
        const csrftoken = Cookies.get("csrftoken");

        // Check if this task has already been assigned to a moderator
        if (moderatorName.length === 0) {
          // Assign the moderation task to the current user
          const assignResponse = await fetch(`/api/moderation/assign/${modifiedTaskId}/`, {
            method: "PUT",
            headers: {
              "X-CSRFToken": csrftoken as string,
            },
          });
          if (assignResponse.ok) {
            const assignResult = await assignResponse.json();

            // TODO - handle response
            console.log("ASSIGN RESPONSE", assignResult);
          } else {
            setToast(Toast.SaveFailed);

            // TODO - handle error
            const assignResult = await assignResponse.text();
            console.log("ASSIGN FAILED", assignResult);
          }
        }

        // TODO - handle photos
        const postData = {
          data: { ...modifiedTask },
        };

        console.log("SENDING", postData);

        // Save the moderation task with the possibly modified data
        const createResponse = await fetch(`/api/moderation/todos/${modifiedTaskId}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken as string,
          },
          mode: "same-origin",
          body: JSON.stringify(postData),
        });
        if (createResponse.ok) {
          const moderationResult = await createResponse.json();

          // TODO - handle response
          console.log("SAVE RESPONSE", moderationResult);

          if (moderationResult.id) {
            setToast(Toast.SaveSucceeded);
          } else {
            setToast(Toast.SaveFailed);
          }
        } else {
          setToast(Toast.SaveFailed);

          // TODO - handle error
          const moderationResult = await createResponse.text();
          console.log("SAVE FAILED", moderationResult);
        }
      } else if (!valid) {
        setToast(Toast.ValidationFailed);
      } else {
        setToast(Toast.NotAuthenticated);
      }
    } catch (err) {
      console.log("ERROR", err);
      setToast(Toast.SaveFailed);
    }
  };

  const cleanupToast = () => {
    setToast(undefined);
  };

  return (
    <div className={styles.taskHeader}>
      <h3>
        {placeNameSelected} ({selectedTaskId})
      </h3>

      <div className={styles.buttonRow}>
        <Button variant="secondary">{i18n.t("moderation.button.requestTranslation")}</Button>
        <Button variant="secondary" iconRight={<IconArrowUndo />}>
          {i18n.t("moderation.button.rejectChangeRequest")}
        </Button>
        <Button variant="secondary" iconRight={<IconTrash />}>
          {i18n.t("moderation.button.removePlace")}
        </Button>
        <Button iconRight={<IconArrowRight />} onClick={saveModeration}>
          {i18n.t("moderation.button.saveInformation")}
        </Button>
      </div>

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
          <div>{full_name}</div>
          <div>{email}</div>
          <div>{phone}</div>
        </div>
        <div className={styles.comment}>
          <div className={styles.bold}>{i18n.t("moderation.taskHeader.messageFromNotifier")}</div>
          <div>{comments}</div>
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
