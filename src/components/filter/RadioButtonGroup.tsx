import { ChangeEvent, useState } from "react";
import type { FilterParameter } from "../../../lib/interfaces/FilterTypes";
import { randomId } from "../../../lib/random-id/random-id.js";
import type { RadioButtonGroupProps } from "../../../lib/interfaces/FilterTypes";


const RadioButtonGroup = (
  filterParam: FilterParameter<RadioButtonGroupProps>
) => {
  const [selected, setSelected] = useState<string | null>("homes");

  const handleChange = (e: any) => {
    setSelected(e.target.value);
  };

  return (
    <fieldset className="radio-button-group">
      <legend>{filterParam.legendValue}</legend>
      {filterParam.filterProps.data.map((props) => (
        <RadioButton
          key={props.id}
          filterName={filterParam.filterName}
          handleChange={handleChange}
          selected={selected}
          {...props}
        />
      ))}
    </fieldset>
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
        name={getKebabCase(filterName)}
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
