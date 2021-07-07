import React, { ReactElement } from "react";
import { useI18n } from "next-localization";
import { Button, IconCheck } from "hds-react";
import { TaskStatus, TranslationStatus } from "../../types/constants";
import styles from "./ActionButton.module.scss";

interface ActionButtonProps {
  className?: string;
  fieldName: string;
  translationStatus: TranslationStatus;
  taskStatus: TaskStatus;
  actionCallback: (fieldName: string, status: TranslationStatus) => void;
  hidden?: boolean;
}

const ActionButton = ({ className, fieldName, translationStatus, taskStatus, actionCallback, hidden }: ActionButtonProps): ReactElement => {
  const i18n = useI18n();

  return (
    <div className={`${styles.action} ${className}`}>
      {translationStatus === TranslationStatus.Edited && !hidden && (
        <Button
          className={taskStatus !== TaskStatus.Closed ? styles.doneSecondary : ""}
          variant="secondary"
          size="small"
          aria-label={i18n.t("translation.button.done")}
          onClick={() => actionCallback(fieldName, TranslationStatus.Done)}
          disabled={taskStatus === TaskStatus.Closed}
        >
          <IconCheck aria-hidden />
        </Button>
      )}
      {translationStatus === TranslationStatus.Done && !hidden && (
        <Button
          className={styles.done}
          iconLeft={<IconCheck aria-hidden />}
          variant="success"
          onClick={() => actionCallback(fieldName, TranslationStatus.Edited)}
          disabled={taskStatus === TaskStatus.Closed}
        >
          {i18n.t("translation.button.done")}
        </Button>
      )}
    </div>
  );
};

ActionButton.defaultProps = {
  className: "",
  hidden: false,
};

export default ActionButton;
