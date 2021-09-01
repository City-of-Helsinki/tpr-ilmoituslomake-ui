import React, { ChangeEvent, FocusEvent, ReactElement, cloneElement } from "react";
import { ModerationStatus, TaskStatus, TaskType } from "../../types/constants";
import { OptionType } from "../../types/general";
import ActionButton from "./ActionButton";
import ModifyButton from "./ModifyButton";
import styles from "./ModerationSection.module.scss";

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
  helperText?: string;
  tooltipButtonLabel?: string;
  tooltipLabel?: string;
  tooltipText?: string;
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
  helperText,
  tooltipButtonLabel,
  tooltipLabel,
  tooltipText,
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
  if (taskType === TaskType.RemoveTip || taskType === TaskType.ModeratorRemove || taskType === TaskType.PlaceInfo) {
    return (
      <>
        {selectedHeaderText && moderationStatus !== ModerationStatus.Edited && (
          <h4 className={`${styles.gridSelected} moderation`}>{selectedHeaderText}</h4>
        )}
        {modifiedHeaderText && moderationStatus === ModerationStatus.Edited && (
          <h4 className={`${styles.gridSelected} moderation`}>{modifiedHeaderText}</h4>
        )}

        {cloneElement(ModerationComponent, {
          id: moderationStatus !== ModerationStatus.Edited ? `${id}_Selected` : `${id}_Modified`,
          className: `${styles.gridSelected} disabledTextColor`,
          value: moderationStatus !== ModerationStatus.Edited ? selectedValue : modifiedValue,
          onChange: moderationStatus === ModerationStatus.Edited ? changeCallback : undefined,
          onBlur: moderationStatus === ModerationStatus.Edited ? blurCallback : undefined,
          disabled: moderationStatus !== ModerationStatus.Edited || taskStatus === TaskStatus.Closed || forceDisabled,
          radiobuttonname: isSelectionGroupWrapper ? id : undefined,
        })}
      </>
    );
  }

  if (
    taskType === TaskType.NewPlace ||
    taskType === TaskType.PlaceChange ||
    taskType === TaskType.ChangeTip ||
    taskType === TaskType.AddTip ||
    taskType === TaskType.ModeratorChange ||
    taskType === TaskType.ModeratorAdd
  ) {
    // Enable modified fields to be edited by default if they have a value different from the selected field
    // For tip change requests about new places, enable all fields to be edited by default
    if (moderationStatus === ModerationStatus.Unknown && !bypassModifiedFieldCheck) {
      if (taskType === TaskType.AddTip || taskType === TaskType.ModeratorAdd) {
        // Tip change request for new place
        statusCallback(fieldName, ModerationStatus.Edited);
      } else if (
        Array.isArray(selectedValue) &&
        Array.isArray(modifiedValue) &&
        selectedValue.map((s) => s.id).join() !== modifiedValue.map((m) => m.id).join()
      ) {
        // Combobox selected and modified values are different, and there is a value
        statusCallback(fieldName, ModerationStatus.Edited);
      } else if (!Array.isArray(selectedValue) && !Array.isArray(modifiedValue) && selectedValue !== modifiedValue) {
        // Text string selected and modified values are different, and there is a value
        statusCallback(fieldName, ModerationStatus.Edited);
      } else if ((selectedValue !== undefined && selectedValue.length > 0) || (modifiedValue !== undefined && modifiedValue.length > 0)) {
        // Selected and modified values are the same, and there is a value
        statusCallback(fieldName, ModerationStatus.Approved);
      }
    }

    return (
      <>
        {selectedHeaderText && <h4 className={`${styles.gridSelected} moderation`}>{selectedHeaderText}</h4>}
        {modifiedHeaderText && <h4 className={`${styles.gridModified} moderation`}>{modifiedHeaderText}</h4>}

        {cloneElement(ModerationComponent, {
          id: `${id}_Selected`,
          className: `${styles.gridSelected} disabledTextColor`,
          value: selectedValue,
          disabled: true,
          radiobuttonname: isSelectionGroupWrapper ? `${id}_Selected` : undefined,
        })}

        <ModifyButton
          className={styles.gridModified}
          label={modifyButtonLabel}
          fieldName={fieldName}
          moderationStatus={moderationStatus}
          taskStatus={taskStatus}
          modifyCallback={statusCallback}
          hidden={modifyButtonHidden}
        >
          {cloneElement(ModerationComponent, {
            id: `${id}_Modified`,
            className: `${styles.gridModified} disabledTextColor`,
            value: modifiedValue,
            onChange: changeCallback,
            onBlur: blurCallback,
            helperText: moderationStatus === ModerationStatus.Edited ? helperText : undefined,
            tooltipButtonLabel: moderationStatus === ModerationStatus.Edited ? tooltipButtonLabel : undefined,
            tooltipLabel: moderationStatus === ModerationStatus.Edited ? tooltipLabel : undefined,
            tooltipText: moderationStatus === ModerationStatus.Edited ? tooltipText : undefined,
            disabled:
              moderationStatus === ModerationStatus.Approved ||
              moderationStatus === ModerationStatus.Rejected ||
              taskStatus === TaskStatus.Closed ||
              forceDisabled,
            radiobuttonname: isSelectionGroupWrapper ? `${id}_Modified` : undefined,
          })}
        </ModifyButton>

        <ActionButton
          className={styles.gridActionButton}
          fieldName={fieldName}
          moderationStatus={moderationStatus}
          taskStatus={taskStatus}
          actionCallback={statusCallback}
          hidden={actionButtonHidden}
        />
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
  helperText: undefined,
  tooltipButtonLabel: undefined,
  tooltipLabel: undefined,
  tooltipText: undefined,
  modifyButtonHidden: false,
  actionButtonHidden: false,
  bypassModifiedFieldCheck: false,
  forceDisabled: false,
  blurCallback: undefined,
  isSelectionGroupWrapper: false,
};

export default ModerationSection;
