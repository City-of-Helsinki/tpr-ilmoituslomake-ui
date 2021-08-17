import React, { ReactElement, ReactNode } from "react";
import { useI18n } from "next-localization";
import { Button, IconPen } from "hds-react";
import { TranslationStatus, TaskStatus } from "../../types/constants";
import styles from "./ModifyButton.module.scss";

interface ModifyButtonProps {
  className?: string;
  prefix: string;
  label: string;
  fieldName: string;
  translationStatus: TranslationStatus;
  taskStatus: TaskStatus;
  modifyCallback: (fieldName: string, status: TranslationStatus) => void;
  hidden?: boolean;
  children: ReactNode;
}

const ModifyButton = ({
  className,
  prefix,
  label,
  fieldName,
  translationStatus,
  taskStatus,
  modifyCallback,
  hidden,
  children,
}: ModifyButtonProps): ReactElement => {
  const i18n = useI18n();

  return (
    <div className={className}>
      {translationStatus === TranslationStatus.Unknown && !hidden && (
        <Button
          className={styles.gridButton}
          variant="secondary"
          onClick={() => modifyCallback(fieldName, TranslationStatus.Edited)}
          disabled={taskStatus === TaskStatus.Closed}
        >{`${i18n.t(`${prefix}.button.modify`)} ${label.toLowerCase()}`}</Button>
      )}
      {translationStatus === TranslationStatus.Edited && children}
      {translationStatus === TranslationStatus.Done && (
        <>
          {children}
          {!hidden && (
            <Button
              variant="supplementary"
              size="small"
              iconLeft={<IconPen aria-hidden />}
              onClick={() => modifyCallback(fieldName, TranslationStatus.Edited)}
              disabled={taskStatus === TaskStatus.Closed}
            >
              {i18n.t(`${prefix}.button.modify`)}
            </Button>
          )}
        </>
      )}
    </div>
  );
};

ModifyButton.defaultProps = {
  className: "",
  hidden: false,
};

export default ModifyButton;
