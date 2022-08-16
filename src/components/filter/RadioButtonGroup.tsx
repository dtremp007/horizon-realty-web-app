import { ChangeEvent, useState } from "react";
import type { FilterParameter } from "../../../lib/interfaces/FilterTypes";
import { randomId } from "../../../lib/random-id/random-id.js";
import type { RadioButtonGroupProps } from "../../../lib/interfaces/FilterTypes";

type Props = {
    filterProps: FilterParameter["filterProps"],
    filterName: FilterParameter["filterName"],
    handleChange: Function,
    selected: string
}

const RadioButtonGroup = ({
    filterProps,
    filterName,
    handleChange,
    selected,
}: Props) => {

  return (
    <>
      {filterProps.data.map((props: any) => (
        <RadioButton
          key={props.id}
          filterName={filterName}
          handleChange={handleChange}
          selected={selected}
          {...props}
        />
      ))}
    </>
  );
};
export default RadioButtonGroup;

//TODO: figure out the prop for the changleHandler
type RadioButtonProps = {
  filterName: string;
  value: string;
  label: string;
  selected: string | null;
  handleChange: (e: any) => void;
};

const RadioButton = ({
  filterName,
  value,
  label,
  selected,
  handleChange,
}: RadioButtonProps) => {
  return (
    <div className="radio-button-container">
      <input
        type="radio"
        name={filterName}
        id={value}
        value={value}
        checked={selected === value}
        onChange={handleChange}
      />
      <label htmlFor={value}>{label}</label>
    </div>
  );
};

const getKebabCase = (text: string): string => {
  return text.replace(/\s/g, "-").toLowerCase();
};
