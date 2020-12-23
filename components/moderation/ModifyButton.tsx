import React, { ReactElement, ReactNode } from "react";
import { useI18n } from "next-localization";
import { Button, IconPen } from "hds-react";
import { ModerationStatus } from "../../types/constants";

interface ModifyButtonProps {
  className?: string;
  label: string;
  fieldName: string;
  status: ModerationStatus;
  modifyCallback: (fieldName: string, status: ModerationStatus) => void;
  hidden?: boolean;
  children: ReactNode;
}

const ModifyButton = ({ className, label, fieldName, status, modifyCallback, hidden, children }: ModifyButtonProps): ReactElement => {
  const i18n = useI18n();

  return (
    <div className={className}>
      {status === ModerationStatus.Unknown && !hidden && (
        <Button className="gridButton" variant="secondary" onClick={() => modifyCallback(fieldName, ModerationStatus.Edited)}>{`${i18n.t(
          "moderation.button.modify"
        )} ${label.toLowerCase()}`}</Button>
      )}
      {status === ModerationStatus.Edited && children}
      {(status === ModerationStatus.Approved || status === ModerationStatus.Rejected) && (
        <>
          {children}
          <Button variant="supplementary" size="small" iconLeft={<IconPen />} onClick={() => modifyCallback(fieldName, ModerationStatus.Edited)}>
            {i18n.t("moderation.button.modify")}
          </Button>
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
