import React, { ChangeEvent, ReactElement, cloneElement } from "react";
import { ModerationStatus, TaskType } from "../../types/constants";
import { OptionType } from "../../types/general";
import ActionButton from "./ActionButton";
import ModifyButton from "./ModifyButton";

interface ModerationSectionProps {
  id: string;
  fieldName: string;
  selectedValue?: string | OptionType[];
  modifiedValue?: string | OptionType[];
  status: ModerationStatus;
  taskType: TaskType;
  selectedHeaderText?: string;
  modifiedHeaderText?: string;
  modifyButtonLabel: string;
  modifyButtonHidden?: boolean;
  actionButtonHidden?: boolean;
  forceModifiedDisabled?: boolean;
  bypassModifiedFieldCheck?: boolean;
  changeCallback:
    | ((evt: ChangeEvent<HTMLInputElement>) => void)
    | ((evt: ChangeEvent<HTMLTextAreaElement>) => void)
    | ((selected: OptionType[]) => void);
  statusCallback: (fieldName: string, status: ModerationStatus) => void;
  ModerationComponent: ReactElement;
  isSelectionGroupWrapper?: boolean;
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
  bypassModifiedFieldCheck,
  changeCallback,
  statusCallback,
  ModerationComponent,
  isSelectionGroupWrapper,
}: ModerationSectionProps): ReactElement => {
  if (taskType === TaskType.ChangeTip || taskType === TaskType.RemoveTip) {
    return (
      <>
        {selectedHeaderText && status !== ModerationStatus.Edited && <h4 className="gridColumn1 moderation">{selectedHeaderText}</h4>}
        {modifiedHeaderText && status === ModerationStatus.Edited && <h4 className="gridColumn1 moderation">{modifiedHeaderText}</h4>}

        {cloneElement(ModerationComponent, {
          id: status !== ModerationStatus.Edited ? `${id}_Selected` : `${id}_Modified`,
          className: "gridColumn1 disabledTextColor",
          value: status !== ModerationStatus.Edited ? selectedValue : modifiedValue,
          onChange: status === ModerationStatus.Edited ? changeCallback : undefined,
          disabled: status !== ModerationStatus.Edited,
          radiobuttonname: isSelectionGroupWrapper ? id : undefined,
        })}
      </>
    );
  }

  if (taskType === TaskType.NewPlace || taskType === TaskType.PlaceChange) {
    // Enable modified fields to be edited by default if they have a value
    if (status === ModerationStatus.Unknown && modifiedValue && modifiedValue.length > 0 && !bypassModifiedFieldCheck) {
      statusCallback(fieldName, ModerationStatus.Edited);
    }

    return (
      <>
        {selectedHeaderText && <h4 className="gridColumn1 moderation">{selectedHeaderText}</h4>}
        {modifiedHeaderText && <h4 className="gridColumn2 moderation">{modifiedHeaderText}</h4>}

        {cloneElement(ModerationComponent, {
          id: `${id}_Selected`,
          className: "gridColumn1 disabledTextColor",
          value: selectedValue,
          disabled: true,
          radiobuttonname: isSelectionGroupWrapper ? `${id}_Selected` : undefined,
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
            radiobuttonname: isSelectionGroupWrapper ? `${id}_Modified` : undefined,
          })}
        </ModifyButton>

        {!actionButtonHidden && <ActionButton className="gridColumn3" fieldName={fieldName} status={status} actionCallback={statusCallback} />}
      </>
    );
  }

  return <></>;
};

ModerationSection.defaultProps = {
  selectedValue: undefined,
  modifiedValue: undefined,
  selectedHeaderText: undefined,
  modifiedHeaderText: undefined,
  modifyButtonHidden: false,
  actionButtonHidden: false,
  forceModifiedDisabled: false,
  bypassModifiedFieldCheck: false,
  isSelectionGroupWrapper: false,
};

export default ModerationSection;
