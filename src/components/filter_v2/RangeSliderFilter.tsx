import { RangeSlider, RangeSliderProps } from "@mantine/core";
import { FilterElement_V2_Props } from "../../../lib/interfaces/FilterTypes";
import { ListingsContextType } from "../../context/listingsContext/listingsContext";
import { useMemo, useState } from "react";
import { equals, isNil } from "rambda";

const RangeSliderFilter = ({
  id,
  fieldsetStyle,
  legend,
  filterValue,
  filterProps,
  handleOnChange,
}: FilterElement_V2_Props<RangeSliderProps, RangeSliderProps["onChange"]>) => {
  const [state, setState] = useState(filterValue);
  const parsedLabel = useMemo(() => {
    const label = filterProps.label;

    if (isNil(label)) return null;

    if (typeof label === "string") {
      return parseLabelFunction(label);
    }
  }, [filterProps.label]);

  return (
    <fieldset
      key={id}
      style={{
        display: "block",
        paddingTop: "2rem",
      }}
    >
      {legend && <legend>{legend}</legend>}
      <RangeSlider
        {...filterProps}
        value={state}
        onChange={setState}
        onChangeEnd={handleOnChange}
        label={parsedLabel}
      />
    </fieldset>
  );
};
export default RangeSliderFilter;

export function updateRangeSliderFilter(
  dispatch: ListingsContextType["dispatch"],
  { id, fallback, filterValue }: FilterElement_V2_Props<RangeSliderProps>
): RangeSliderProps["onChange"] {
  return (e) =>
    dispatch({
      type: "UPDATE_FILTER",
      payload: { id, filterValue: e, active: !equals(e, fallback) },
    });
}

function parseLabelFunction(code: string) {
  const formatterFunction = eval(code) as (value: number) => string;
  if (typeof formatterFunction(1000) === "string") {
    return formatterFunction;
  } else {
    console.log(
      `You're formatter function printed out ${formatterFunction(
        1000
      )}, what the hell.`
    );
  }
}
