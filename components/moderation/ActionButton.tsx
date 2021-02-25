import React, { ReactElement } from "react";
import { useI18n } from "next-localization";
import { Button, IconCheck, IconCross } from "hds-react";
import { ModerationStatus } from "../../types/constants";
import styles from "./ActionButton.module.scss";

interface ActionButtonProps {
  className?: string;
  fieldName: string;
  status: ModerationStatus;
  actionCallback: (fieldName: string, status: ModerationStatus) => void;
}

const ActionButton = ({ className, fieldName, status, actionCallback }: ActionButtonProps): ReactElement => {
  const i18n = useI18n();

  return (
    <div className={`${styles.action} ${className}`}>
      {status === ModerationStatus.Edited && (
        <div>
          <Button
            className={styles.approveSecondary}
            variant="secondary"
            size="small"
            aria-label={i18n.t("moderation.button.approve")}
            onClick={() => actionCallback(fieldName, ModerationStatus.Approved)}
          >
            <IconCheck aria-hidden />
          </Button>
          <Button
            className={styles.rejectSecondary}
            variant="secondary"
            size="small"
            aria-label={i18n.t("moderation.button.reject")}
            onClick={() => actionCallback(fieldName, ModerationStatus.Rejected)}
          >
            <IconCross aria-hidden />
          </Button>
        </div>
      )}
      {status === ModerationStatus.Approved && (
        <Button
          className={styles.approve}
          iconLeft={<IconCheck aria-hidden />}
          variant="success"
          onClick={() => actionCallback(fieldName, ModerationStatus.Edited)}
        >
          {i18n.t("moderation.button.approved")}
        </Button>
      )}
      {status === ModerationStatus.Rejected && (
        <Button
          className={styles.reject}
          iconLeft={<IconCross aria-hidden />}
          variant="danger"
          onClick={() => actionCallback(fieldName, ModerationStatus.Edited)}
        >
          {i18n.t("moderation.button.rejected")}
        </Button>
      )}
    </div>
  );
};

ActionButton.defaultProps = {
  className: "",
};

export default ActionButton;
