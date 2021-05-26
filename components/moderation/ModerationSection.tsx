import React, { ChangeEvent, FocusEvent, ReactElement, cloneElement } from "react";
import { ModerationStatus, TaskStatus, TaskType } from "../../types/constants";
import { OptionType } from "../../types/general";
import ActionButton from "./ActionButton";
import ModifyButton from "./ModifyButton";

interface ModerationSectionProps {
  id: string;
  fieldName: string;
  selectedValue?: string | OptionType[];
  modifiedValue?: string | OptionType[];
  moderationStatus: ModerationStatus;
  taskType: TaskType;
  taskStatus: TaskStatus;
  selectedHeaderText?: string;
  modifiedHeaderText?: string;
  modifyButtonLabel: string;
  modifyButtonHidden?: boolean;
  actionButtonHidden?: boolean;
  bypassModifiedFieldCheck?: boolean;
  forceDisabled?: boolean;
  changeCallback:
    | ((evt: ChangeEvent<HTMLInputElement>) => void)
    | ((evt: ChangeEvent<HTMLTextAreaElement>) => void)
    | ((selected: OptionType[]) => void);
  blurCallback?: (evt: FocusEvent<HTMLInputElement>) => void;
  statusCallback: (fieldName: string, status: ModerationStatus) => void;
  ModerationComponent: ReactElement;
  isSelectionGroupWrapper?: boolean;
}

const ModerationSection = ({
  id,
  fieldName,
  selectedValue,
  modifiedValue,
  moderationStatus,
  taskType,
  taskStatus,
  selectedHeaderText,
  modifiedHeaderText,
  modifyButtonLabel,
  modifyButtonHidden,
  actionButtonHidden,
  bypassModifiedFieldCheck,
  forceDisabled,
  changeCallback,
  blurCallback,
  statusCallback,
  ModerationComponent,
  isSelectionGroupWrapper,
}: ModerationSectionProps): ReactElement => {
  if (taskType === TaskType.ChangeTip || taskType === TaskType.AddTip || taskType === TaskType.RemoveTip || taskType === TaskType.PlaceInfo) {
    return (
      <>
        {selectedHeaderText && moderationStatus !== ModerationStatus.Edited && <h4 className="gridColumn1 moderation">{selectedHeaderText}</h4>}
        {modifiedHeaderText && moderationStatus === ModerationStatus.Edited && <h4 className="gridColumn1 moderation">{modifiedHeaderText}</h4>}

        {cloneElement(ModerationComponent, {
          id: moderationStatus !== ModerationStatus.Edited ? `${id}_Selected` : `${id}_Modified`,
          className: "gridColumn1 disabledTextColor",
          value: moderationStatus !== ModerationStatus.Edited ? selectedValue : modifiedValue,
          onChange: moderationStatus === ModerationStatus.Edited ? changeCallback : undefined,
          onBlur: moderationStatus === ModerationStatus.Edited ? blurCallback : undefined,
          disabled: moderationStatus !== ModerationStatus.Edited || taskStatus === TaskStatus.Closed || forceDisabled,
          radiobuttonname: isSelectionGroupWrapper ? id : undefined,
        })}
      </>
    );
  }

  if (taskType === TaskType.NewPlace || taskType === TaskType.PlaceChange) {
    // Enable modified fields to be edited by default if they have a value
    if (
      moderationStatus === ModerationStatus.Unknown &&
      ((selectedValue && selectedValue.length > 0) || (modifiedValue && modifiedValue.length > 0)) &&
      !bypassModifiedFieldCheck
    ) {
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
          moderationStatus={moderationStatus}
          taskStatus={taskStatus}
          modifyCallback={statusCallback}
          hidden={modifyButtonHidden}
        >
          {cloneElement(ModerationComponent, {
            id: `${id}_Modified`,
            className: "gridColumn2 disabledTextColor",
            value: modifiedValue,
            onChange: changeCallback,
            onBlur: blurCallback,
            disabled:
              moderationStatus === ModerationStatus.Approved ||
              moderationStatus === ModerationStatus.Rejected ||
              taskStatus === TaskStatus.Closed ||
              forceDisabled,
            radiobuttonname: isSelectionGroupWrapper ? `${id}_Modified` : undefined,
          })}
        </ModifyButton>

        {!actionButtonHidden && (
          <ActionButton
            className="gridColumn3"
            fieldName={fieldName}
            moderationStatus={moderationStatus}
            taskStatus={taskStatus}
            actionCallback={statusCallback}
          />
        )}
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
  bypassModifiedFieldCheck: false,
  forceDisabled: false,
  blurCallback: undefined,
  isSelectionGroupWrapper: false,
};

export default ModerationSection;
