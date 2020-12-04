import React, { ReactElement, ReactNode } from "react";
import { useI18n } from "next-localization";
import { Button, IconPen } from "hds-react";
import { Status } from "../../types/constants";

interface ModifyButtonProps {
  className?: string;
  label: string;
  fieldName: string;
  status: Status;
  modifyCallback: (fieldName: string, status: Status) => void;
  hidden?: boolean;
  children: ReactNode;
}

const ModifyButton = ({ className, label, fieldName, status, modifyCallback, hidden, children }: ModifyButtonProps): ReactElement => {
  const i18n = useI18n();

  return (
    <div className={className}>
      {status === Status.Unknown && !hidden && (
        <Button className="gridButton" variant="secondary" onClick={() => modifyCallback(fieldName, Status.Edited)}>{`${i18n.t(
          "moderation.button.modify"
        )} ${label.toLowerCase()}`}</Button>
      )}
      {status === Status.Edited && children}
      {(status === Status.Approved || status === Status.Rejected) && (
        <>
          {children}
          <Button variant="supplementary" size="small" iconLeft={<IconPen />} onClick={() => modifyCallback(fieldName, Status.Edited)}>
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
