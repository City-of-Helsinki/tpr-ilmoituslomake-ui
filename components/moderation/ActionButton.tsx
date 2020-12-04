import React, { ReactElement } from "react";
import { useI18n } from "next-localization";
import { Button, IconCheck, IconCross } from "hds-react";
import { Status } from "../../types/constants";
import styles from "./ActionButton.module.scss";

interface ActionButtonProps {
  className?: string;
  fieldName: string;
  status: Status;
  actionCallback: (fieldName: string, status: Status) => void;
}

const ActionButton = ({ className, fieldName, status, actionCallback }: ActionButtonProps): ReactElement => {
  const i18n = useI18n();

  return (
    <div className={`${styles.action} ${className}`}>
      {status === Status.Edited && (
        <div>
          <Button
            className={styles.approveSecondary}
            variant="secondary"
            size="small"
            aria-label={i18n.t("moderation.button.approve")}
            onClick={() => actionCallback(fieldName, Status.Approved)}
          >
            <IconCheck />
          </Button>
          <Button
            className={styles.rejectSecondary}
            variant="secondary"
            size="small"
            aria-label={i18n.t("moderation.button.reject")}
            onClick={() => actionCallback(fieldName, Status.Rejected)}
          >
            <IconCross />
          </Button>
        </div>
      )}
      {status === Status.Approved && (
        <Button className={styles.approve} iconLeft={<IconCheck />} variant="success" onClick={() => actionCallback(fieldName, Status.Edited)}>
          {i18n.t("moderation.button.approved")}
        </Button>
      )}
      {status === Status.Rejected && (
        <Button className={styles.reject} iconLeft={<IconCross />} variant="danger" onClick={() => actionCallback(fieldName, Status.Edited)}>
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
