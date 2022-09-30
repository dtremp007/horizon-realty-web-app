import RadioButtonGroup, {
  RadioButtonGroupProps,
  RadioButtonProps,
} from "../filter/RadioButtonGroup";
import { FilterElement_V2_Props } from "../../../lib/interfaces/FilterTypes";
import { ListingsContextType } from "../../context/listingsContext/listingsContext";
import { useMemo } from "react";
import { equals } from "rambda";

const RadioButtonGroupFilter = ({
  id,
  legend,
  filterValue,
  filterProps,
  handleOnChange,
}: FilterElement_V2_Props<RadioButtonGroupProps, RadioButtonGroupProps["onChange"]>) => {

  return (
    <fieldset
      key={id}
      style={{
        flexFlow: "row wrap",
        justifyContent: "center",
        columnGap: ".75rem",
        rowGap: ".25rem",
        paddingLeft: "0",
        paddingRight: "0",
      }}
    >
      {legend && <legend>{legend}</legend>}
      <RadioButtonGroup
        selected={filterValue}
        onChange={handleOnChange}
        {...filterProps}
      />
    </fieldset>
  );
};
export default RadioButtonGroupFilter;

export function updateRadioButtonGroupFilter(
  dispatch: ListingsContextType["dispatch"],
  {id, fallback}: FilterElement_V2_Props<RadioButtonGroupProps>
): RadioButtonGroupProps["onChange"] {
  return (e) => {
    const currentValue = e.target.value
      dispatch({ type: "UPDATE_FILTER", payload: { id, filterValue: currentValue, active: !equals(currentValue, fallback)} });
    }
}
