import React, { ReactElement } from "react";
import { useI18n } from "next-localization";
import { Button, ButtonSize, ButtonVariant, IconCheck, IconCross } from "hds-react";
import { ModerationStatus, TaskStatus } from "../../types/constants";
import styles from "./ActionButton.module.scss";

interface ActionButtonProps {
  id?: string;
  className?: string;
  fieldName: string;
  moderationStatus: ModerationStatus;
  taskStatus: TaskStatus;
  actionCallback: (fieldName: string, status: ModerationStatus) => void;
  hidden?: boolean;
}

const ActionButton = ({ id, className, fieldName, moderationStatus, taskStatus, actionCallback, hidden }: ActionButtonProps): ReactElement => {
  const i18n = useI18n();

  return (
    <div id={id} className={`${styles.action} ${className}`}>
      {moderationStatus === ModerationStatus.Edited && !hidden && (
        <div className={styles.buttonRow}>
          <Button
            className={
              taskStatus !== TaskStatus.Closed && taskStatus !== TaskStatus.Rejected && taskStatus !== TaskStatus.Cancelled
                ? styles.approveSecondary
                : ""
            }
            variant={ButtonVariant.Secondary}
            size={ButtonSize.Small}
            aria-label={i18n.t("moderation.button.approve")}
            onClick={() => actionCallback(fieldName, ModerationStatus.Approved)}
            disabled={taskStatus === TaskStatus.Closed || taskStatus === TaskStatus.Rejected || taskStatus === TaskStatus.Cancelled}
            iconStart={ <IconCheck aria-hidden />}
          >
            {i18n.t("moderation.button.approve")}
          </Button>
          <Button
            className={
              taskStatus !== TaskStatus.Closed && taskStatus !== TaskStatus.Rejected && taskStatus !== TaskStatus.Cancelled
                ? styles.rejectSecondary
                : ""
            }
            variant={ButtonVariant.Secondary}
            size={ButtonSize.Small}
            aria-label={i18n.t("moderation.button.reject")}
            onClick={() => actionCallback(fieldName, ModerationStatus.Rejected)}
            disabled={taskStatus === TaskStatus.Closed || taskStatus === TaskStatus.Rejected || taskStatus === TaskStatus.Cancelled}
            iconStart={<IconCross aria-hidden />}
          >{i18n.t("moderation.button.reject")}
          </Button>
        </div>
      )}
      {moderationStatus === ModerationStatus.Approved && !hidden && (
        <div className={styles.buttonRow}>
          <Button
            className={styles.approve}
            iconStart={<IconCheck aria-hidden />}
            variant={ButtonVariant.Success}
            onClick={() => actionCallback(fieldName, ModerationStatus.Edited)}
            disabled={taskStatus === TaskStatus.Closed || taskStatus === TaskStatus.Rejected || taskStatus === TaskStatus.Cancelled}
          >
            {i18n.t("moderation.button.approved")}
          </Button>
        </div>
      )}
      {moderationStatus === ModerationStatus.Rejected && !hidden && (
        <div className={styles.buttonRow}>
          <Button
            className={styles.reject}
            iconStart={<IconCross aria-hidden />}
            variant={ButtonVariant.Danger}
            onClick={() => actionCallback(fieldName, ModerationStatus.Edited)}
            disabled={taskStatus === TaskStatus.Closed || taskStatus === TaskStatus.Rejected || taskStatus === TaskStatus.Cancelled}
          >
            {i18n.t("moderation.button.rejected")}
          </Button>
        </div>
      )}
    </div>
  );
};

ActionButton.defaultProps = {
  id: undefined,
  className: "",
  hidden: false,
};

export default ActionButton;
