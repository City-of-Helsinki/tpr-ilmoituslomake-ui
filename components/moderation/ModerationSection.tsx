import React, { ChangeEvent, ReactElement, cloneElement } from "react";
import { ModerationStatus } from "../../types/constants";
import { OptionType } from "../../types/general";
import ActionButton from "./ActionButton";
import ModifyButton from "./ModifyButton";

interface ModerationSectionProps {
  id: string;
  fieldName: string;
  selectedValue: string | OptionType[];
  modifiedValue: string | OptionType[];
  status: ModerationStatus;
  modifyButtonLabel: string;
  modifyButtonHidden?: boolean;
  actionButtonHidden?: boolean;
  forceModifiedDisabled?: boolean;
  changeCallback:
    | ((evt: ChangeEvent<HTMLInputElement>) => void)
    | ((evt: ChangeEvent<HTMLTextAreaElement>) => void)
    | ((selected: OptionType[]) => void);
  statusCallback: (fieldName: string, status: ModerationStatus) => void;
  ModerationComponent: ReactElement;
}

const ModerationSection = ({
  id,
  fieldName,
  selectedValue,
  modifiedValue,
  status,
  modifyButtonLabel,
  modifyButtonHidden,
  actionButtonHidden,
  forceModifiedDisabled,
  changeCallback,
  statusCallback,
  ModerationComponent,
}: ModerationSectionProps): ReactElement => {
  return (
    <>
      {cloneElement(ModerationComponent, {
        id: `${id}_Selected`,
        className: "gridColumn1 disabledTextColor",
        value: selectedValue,
        disabled: true,
      })}
      <ModifyButton
        className="gridColumn2"
        label={modifyButtonLabel}
        fieldName={fieldName}
        status={status}
        modifyCallback={statusCallback}
        hidden={modifyButtonHidden}
      >
        {cloneElement(ModerationComponent, {
          id: `${id}_Modified`,
          className: "gridColumn2 disabledTextColor",
          value: modifiedValue,
          onChange: changeCallback,
          disabled: status === ModerationStatus.Approved || status === ModerationStatus.Rejected || forceModifiedDisabled,
        })}
      </ModifyButton>
      {!actionButtonHidden && <ActionButton className="gridColumn3" fieldName={fieldName} status={status} actionCallback={statusCallback} />}
    </>
  );
};

ModerationSection.defaultProps = {
  modifyButtonHidden: false,
  actionButtonHidden: false,
  forceModifiedDisabled: false,
};

export default ModerationSection;
