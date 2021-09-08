import React, { ReactElement, ReactNode } from "react";
import { useI18n } from "next-localization";
import { Button, IconPen } from "hds-react";
import { ModerationStatus, TaskStatus } from "../../types/constants";
import styles from "./ModifyButton.module.scss";

interface ModifyButtonProps {
  className?: string;
  label?: string;
  fieldName: string;
  moderationStatus: ModerationStatus;
  taskStatus: TaskStatus;
  modifyCallback: (fieldName: string, status: ModerationStatus) => void;
  hidden?: boolean;
  children: ReactNode;
}

const ModifyButton = ({
  className,
  label,
  fieldName,
  moderationStatus,
  taskStatus,
  modifyCallback,
  hidden,
  children,
}: ModifyButtonProps): ReactElement => {
  const i18n = useI18n();

  return (
    <div className={className}>
      {moderationStatus === ModerationStatus.Unknown && !hidden && (
        <Button
          className={styles.gridButton}
          variant="secondary"
          onClick={() => modifyCallback(fieldName, ModerationStatus.Edited)}
          disabled={taskStatus === TaskStatus.Closed}
        >{`${i18n.t("moderation.button.modify")} ${label ? label.toLowerCase() : ""}`}</Button>
      )}
      {moderationStatus === ModerationStatus.Edited && children}
      {(moderationStatus === ModerationStatus.Approved || moderationStatus === ModerationStatus.Rejected) && (
        <>
          {children}
          {!hidden && (
            <Button
              variant="supplementary"
              size="small"
              iconLeft={<IconPen aria-hidden />}
              onClick={() => modifyCallback(fieldName, ModerationStatus.Edited)}
              disabled={taskStatus === TaskStatus.Closed}
            >
              {i18n.t("moderation.button.modify")}
            </Button>
          )}
        </>
      )}
    </div>
  );
};

ModifyButton.defaultProps = {
  className: "",
  label: undefined,
  hidden: false,
};

export default ModifyButton;
