import React, { ReactElement, ReactNode } from "react";
import { useI18n } from "next-localization";
import { Button, IconPen } from "hds-react";
import { Status } from "../../types/constants";

interface ModifyButtonProps {
  className?: string;
  label: string;
  targetName: string;
  status: Status;
  modifyCallback: (targetName: string, status: Status) => void;
  children: ReactNode;
}

const ModifyButton = ({ className, label, targetName, status, modifyCallback, children }: ModifyButtonProps): ReactElement => {
  const i18n = useI18n();

  return (
    <div className={className}>
      {status === Status.Unknown && (
        <Button className="gridButton" variant="secondary" onClick={() => modifyCallback(targetName, Status.Edited)}>{`${i18n.t(
          "moderation.button.modify"
        )} ${label.toLowerCase()}`}</Button>
      )}
      {status === Status.Edited && children}
      {(status === Status.Approved || status === Status.Rejected) && (
        <>
          {children}
          <Button variant="supplementary" size="small" iconLeft={<IconPen />} onClick={() => modifyCallback(targetName, Status.Edited)}>
            {i18n.t("moderation.button.modify")}
          </Button>
        </>
      )}
    </div>
  );
};

ModifyButton.defaultProps = {
  className: "",
};

export default ModifyButton;
