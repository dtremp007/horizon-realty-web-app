import { ChangeEvent, useState } from "react";

export type RadioButtonGroupProps = {
    data: {label: string, value: string}[],
    filterName: string,
    onChange?: RadioButtonProps["handleChange"],
    selected?: string
}

const RadioButtonGroup = ({
    data,
    filterName,
    onChange,
    selected,
}: RadioButtonGroupProps) => {

  return (
    <>
      {data.map((props) => (
        <RadioButton
          key={props.label}
          filterName={filterName}
          handleChange={onChange as RadioButtonProps["handleChange"]}
          selected={selected as string}
          {...props}
        />
      ))}
    </>
  );
};
export default RadioButtonGroup;

export type RadioButtonProps = {
  filterName: string;
  value: string;
  label: string;
  selected: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
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
