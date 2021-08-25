import React, { ChangeEvent, FocusEvent, ReactElement, cloneElement } from "react";
import { TaskStatus, TaskType, TranslationStatus } from "../../types/constants";
import { OptionType } from "../../types/general";

interface TranslationSectionProps {
  id: string;
  fieldName: string;
  translateFrom: string;
  translateTo: string;
  selectedValue?: string | OptionType[];
  translatedValue?: string | OptionType[];
  translationStatus: TranslationStatus;
  taskType: TaskType;
  taskStatus: TaskStatus;
  selectedHeaderText?: string;
  translatedHeaderText?: string;
  helperText?: string;
  tooltipButtonLabel?: string;
  tooltipLabel?: string;
  tooltipText?: string;
  forceDisabled?: boolean;
  invalid?: boolean;
  errorText?: string;
  required?: boolean;
  changeCallback:
    | ((evt: ChangeEvent<HTMLInputElement>) => void)
    | ((evt: ChangeEvent<HTMLTextAreaElement>) => void)
    | ((selected: OptionType[]) => void);
  blurCallback?: ((evt: FocusEvent<HTMLInputElement>) => void) | ((evt: FocusEvent<HTMLTextAreaElement>) => void);
  statusCallback: (fieldName: string, status: TranslationStatus) => void;
  TranslationComponent: ReactElement;
  isSelectionGroupWrapper?: boolean;
}

const TranslationSection = ({
  id,
  fieldName,
  translateFrom,
  translateTo,
  selectedValue,
  translatedValue,
  translationStatus,
  taskType,
  taskStatus,
  selectedHeaderText,
  translatedHeaderText,
  helperText,
  tooltipButtonLabel,
  tooltipLabel,
  tooltipText,
  forceDisabled,
  invalid,
  errorText,
  required,
  changeCallback,
  blurCallback,
  statusCallback,
  TranslationComponent,
  isSelectionGroupWrapper,
}: TranslationSectionProps): ReactElement => {
  if (taskType === TaskType.Translation) {
    // Enable translated fields to be edited by default
    if (translationStatus === TranslationStatus.Unknown) {
      statusCallback(fieldName, TranslationStatus.Edited);
    }

    const { label } = TranslationComponent.props;

    return (
      <>
        {selectedHeaderText && <h4 className="gridColumn1 translation">{selectedHeaderText}</h4>}
        {translatedHeaderText && <h4 className="gridColumn2 translation">{translatedHeaderText}</h4>}

        {cloneElement(TranslationComponent, {
          id: `${id}_Selected`,
          className: "gridColumn1 disabledTextColor",
          label: `${translateFrom.toUpperCase()}: ${label}`,
          value: selectedValue,
          disabled: true,
          radiobuttonname: isSelectionGroupWrapper ? `${id}_Selected` : undefined,
        })}

        {cloneElement(TranslationComponent, {
          id: `${id}_Translated`,
          className: "gridColumn2 disabledTextColor",
          label: `${translateTo.toUpperCase()}: ${label}`,
          value: translatedValue,
          onChange: changeCallback,
          onBlur: blurCallback,
          helperText: translationStatus === TranslationStatus.Edited ? helperText : undefined,
          tooltipButtonLabel: translationStatus === TranslationStatus.Edited ? tooltipButtonLabel : undefined,
          tooltipLabel: translationStatus === TranslationStatus.Edited ? tooltipLabel : undefined,
          tooltipText: translationStatus === TranslationStatus.Edited ? tooltipText : undefined,
          disabled: translationStatus === TranslationStatus.Done || taskStatus === TaskStatus.Closed || forceDisabled,
          radiobuttonname: isSelectionGroupWrapper ? `${id}_Translated` : undefined,
          invalid,
          errorText,
          required,
          "aria-required": required,
        })}
      </>
    );
  }

  return <></>;
};

TranslationSection.defaultProps = {
  selectedValue: undefined,
  translatedValue: undefined,
  selectedHeaderText: undefined,
  translatedHeaderText: undefined,
  helperText: undefined,
  tooltipButtonLabel: undefined,
  tooltipLabel: undefined,
  tooltipText: undefined,
  forceDisabled: false,
  invalid: false,
  errorText: undefined,
  required: false,
  blurCallback: undefined,
  isSelectionGroupWrapper: false,
};

export default TranslationSection;
