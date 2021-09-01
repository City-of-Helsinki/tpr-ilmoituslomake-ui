import React, { ReactElement } from "react";
import { useI18n } from "next-localization";
import { Button, IconCheck, IconCross } from "hds-react";
import { ModerationStatus, TaskStatus } from "../../types/constants";
import styles from "./ActionButton.module.scss";

interface ActionButtonProps {
  className?: string;
  fieldName: string;
  moderationStatus: ModerationStatus;
  taskStatus: TaskStatus;
  actionCallback: (fieldName: string, status: ModerationStatus) => void;
  hidden?: boolean;
}

const ActionButton = ({ className, fieldName, moderationStatus, taskStatus, actionCallback, hidden }: ActionButtonProps): ReactElement => {
  const i18n = useI18n();

  return (
    <div className={`${styles.action} ${className}`}>
      {moderationStatus === ModerationStatus.Edited && !hidden && (
        <div className={styles.buttonRow}>
          <Button
            className={taskStatus !== TaskStatus.Closed ? styles.approveSecondary : ""}
            variant="secondary"
            size="small"
            aria-label={i18n.t("moderation.button.approve")}
            onClick={() => actionCallback(fieldName, ModerationStatus.Approved)}
            disabled={taskStatus === TaskStatus.Closed}
          >
            <IconCheck aria-hidden />
          </Button>
          <Button
            className={taskStatus !== TaskStatus.Closed ? styles.rejectSecondary : ""}
            variant="secondary"
            size="small"
            aria-label={i18n.t("moderation.button.reject")}
            onClick={() => actionCallback(fieldName, ModerationStatus.Rejected)}
            disabled={taskStatus === TaskStatus.Closed}
          >
            <IconCross aria-hidden />
          </Button>
        </div>
      )}
      {moderationStatus === ModerationStatus.Approved && !hidden && (
        <div className={styles.buttonRow}>
          <Button
            className={styles.approve}
            iconLeft={<IconCheck aria-hidden />}
            variant="success"
            onClick={() => actionCallback(fieldName, ModerationStatus.Edited)}
            disabled={taskStatus === TaskStatus.Closed}
          >
            {i18n.t("moderation.button.approved")}
          </Button>
        </div>
      )}
      {moderationStatus === ModerationStatus.Rejected && !hidden && (
        <div className={styles.buttonRow}>
          <Button
            className={styles.reject}
            iconLeft={<IconCross aria-hidden />}
            variant="danger"
            onClick={() => actionCallback(fieldName, ModerationStatus.Edited)}
            disabled={taskStatus === TaskStatus.Closed}
          >
            {i18n.t("moderation.button.rejected")}
          </Button>
        </div>
      )}
    </div>
  );
};

ActionButton.defaultProps = {
  className: "",
  hidden: false,
};

export default ActionButton;
