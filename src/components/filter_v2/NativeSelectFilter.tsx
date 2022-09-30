import { NativeSelect, NativeSelectProps } from "@mantine/core";
import { equals } from "rambda";
import { ChangeEvent } from "react";
import { FilterElement_V2_Props } from "../../../lib/interfaces/FilterTypes";
import { ListingsContextType } from "../../context/listingsContext/listingsContext";

const NativeSelectFilter = ({
  id,
  fieldsetStyle,
  legend,
  filterValue,
  filterProps,
  handleOnChange,
}: FilterElement_V2_Props<
  NativeSelectProps,
  NativeSelectProps["onChange"]
>) => {
  return (
    <fieldset key={id} style={fieldsetStyle}>
      {legend && <legend>{legend}</legend>}
      <NativeSelect
        value={filterValue}
        onChange={handleOnChange}
        {...filterProps}
      />
    </fieldset>
  );
};
export default NativeSelectFilter;

export function updateNativeSelectFilter(
  dispatch: ListingsContextType["dispatch"],
  { id, fallback }: FilterElement_V2_Props<NativeSelectProps>
): NativeSelectProps["onChange"] {
  return (e) => {
    const currentValue = e.currentTarget.value;
    dispatch({
      type: "UPDATE_FILTER",
      payload: {
        id,
        filterValue: currentValue,
        active: !equals(currentValue, fallback),
      },
    });
  };
}
