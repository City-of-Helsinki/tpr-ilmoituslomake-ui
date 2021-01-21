import React, { ChangeEvent, ReactElement, cloneElement } from "react";
import { ModerationStatus, TaskType } from "../../types/constants";
import { OptionType } from "../../types/general";
import ActionButton from "./ActionButton";
import ModifyButton from "./ModifyButton";

interface ModerationSectionProps {
  id: string;
  fieldName: string;
  selectedValue: string | OptionType[];
  modifiedValue: string | OptionType[];
  status: ModerationStatus;
  taskType: TaskType;
  selectedHeaderText?: string;
  modifiedHeaderText?: string;
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
  taskType,
  selectedHeaderText,
  modifiedHeaderText,
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
      {selectedHeaderText && <h4 className="gridColumn1 moderation">{selectedHeaderText}</h4>}
      {modifiedHeaderText && (taskType === TaskType.NewPlace || taskType === TaskType.PlaceChange) && (
        <h4 className="gridColumn2 moderation">{modifiedHeaderText}</h4>
      )}

      {cloneElement(ModerationComponent, {
        id: `${id}_Selected`,
        className: "gridColumn1 disabledTextColor",
        value: selectedValue,
        disabled: true,
      })}

      {(taskType === TaskType.NewPlace || taskType === TaskType.PlaceChange) && (
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
      )}

      {!actionButtonHidden && (taskType === TaskType.NewPlace || taskType === TaskType.PlaceChange) && (
        <ActionButton className="gridColumn3" fieldName={fieldName} status={status} actionCallback={statusCallback} />
      )}
    </>
  );
};

ModerationSection.defaultProps = {
  selectedHeaderText: undefined,
  modifiedHeaderText: undefined,
  modifyButtonHidden: false,
  actionButtonHidden: false,
  forceModifiedDisabled: false,
};

export default ModerationSection;
