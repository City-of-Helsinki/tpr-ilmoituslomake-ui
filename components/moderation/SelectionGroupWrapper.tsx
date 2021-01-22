import React, { ChangeEvent, ReactElement } from "react";
import { RadioButton, SelectionGroup } from "hds-react";

interface SelectionGroupWrapperProps {
  id: string;
  className?: string;
  label: string;
  radioButtonName?: string;
  radioButtonLabels: string[];
  radioButtonValues: string[];
  value?: string;
  onChange?: (evt: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const SelectionGroupWrapper = ({
  id,
  className,
  label,
  radioButtonName,
  radioButtonLabels,
  radioButtonValues,
  value,
  onChange,
  disabled,
}: SelectionGroupWrapperProps): ReactElement => {
  return (
    <SelectionGroup id={id} className={className} direction="horizontal" label={label} disabled={disabled}>
      {radioButtonValues.map((rbValue, index) => (
        <RadioButton
          id={`${id}_${rbValue}`}
          key={`${id}_${rbValue}`}
          label={radioButtonLabels[index]}
          name={radioButtonName}
          value={rbValue}
          checked={value === rbValue}
          onChange={onChange}
        />
      ))}
    </SelectionGroup>
  );
};

SelectionGroupWrapper.defaultProps = {
  className: "",
  radioButtonName: "",
  value: undefined,
  onChange: undefined,
  disabled: false,
};

export default SelectionGroupWrapper;
