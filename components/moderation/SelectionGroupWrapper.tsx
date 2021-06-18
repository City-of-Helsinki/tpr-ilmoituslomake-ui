import React, { ChangeEvent, ReactElement } from "react";
import { RadioButton, SelectionGroup } from "hds-react";

// Note: radiobuttonname is lowercase to prevent a warning from React when calling cloneElement in ModerationSection.tsx
interface SelectionGroupWrapperProps {
  id: string;
  className?: string;
  horizontal: boolean;
  label: string;
  radiobuttonname?: string;
  radioButtonLabels: string[];
  radioButtonValues: string[];
  value?: string;
  onChange?: (evt: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const SelectionGroupWrapper = ({
  id,
  className,
  horizontal,
  label,
  radiobuttonname,
  radioButtonLabels,
  radioButtonValues,
  value,
  onChange,
  disabled,
}: SelectionGroupWrapperProps): ReactElement => {
  return (
    <SelectionGroup id={id} className={className} direction={horizontal ? "horizontal" : "vertical"} label={label} disabled={disabled}>
      {radioButtonValues.map((rbValue, index) => (
        <RadioButton
          id={`${id}_${rbValue}`}
          key={`${id}_${rbValue}`}
          label={radioButtonLabels[index]}
          name={radiobuttonname}
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
  radiobuttonname: "",
  value: undefined,
  onChange: undefined,
  disabled: false,
};

export default SelectionGroupWrapper;
