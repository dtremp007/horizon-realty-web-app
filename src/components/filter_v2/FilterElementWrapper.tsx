import R, {
  any,
  curry,
  equals,
  isNil,
  lensProp,
  mergeLeft,
  pipe,
  view,
  map,
  when,
} from "rambda";
import { useCallback, useContext, useEffect } from "react";
import { FilterElement_V2_Props } from "../../../lib/interfaces/FilterTypes";
import ListingsContext, {
  ListingsContextType,
  ListingsState,
} from "../../context/listingsContext/listingsContext";
import CheckboxListFilter from "./CheckboxListFilter";
import NativeSelectFilter, {
  updateNativeSelectFilter,
} from "./NativeSelectFilter";
import RadioButtonGroupFilter, {
  updateRadioButtonGroupFilter,
} from "./RadioButtonGroupFilter";
import RangeSliderFilter, {
  updateRangeSliderFilter,
} from "./RangeSliderFilter";
import SegmentedControlFilter from "./SegmentedControlFilter";
import { extractor } from "../../../lib/util";

const FilterElementWrapper = (props: FilterElement_V2_Props<any, any>) => {
  const { listingsState, dispatch } = useContext(ListingsContext);
  const updateFilterWith = curry(updateFilter)(dispatch); // waiting for a payload
  const returnsPayload = (filterValue: any) => ({
    id: props.id,
    filterValue,
    active: !equals(props.fallback, filterValue),
  });
  const updateFilterWithPayload = pipe(returnsPayload, updateFilterWith);

  switch (props.type) {
    // currentTarget.value
    case "NativeSelect":
      return (
        <NativeSelectFilter
          {...props}
          handleOnChange={pipe(
            getCurrentTarget("value"),
            updateFilterWithPayload
          )}
        />
      );
    // target.value
    case "RadioButtonGroup":
      return (
        <RadioButtonGroupFilter
          {...props}
          handleOnChange={pipe(getTargetValue, updateFilterWithPayload)}
        />
      );
    // value
    case "RangeSlider":
      return (
        <RangeSliderFilter
          {...props}
          handleOnChange={updateFilterWithPayload}
        />
      );
    // value
    case "SegmentedControl":
      return (
        <SegmentedControlFilter {...props} handleOnChange={updateFilterWith} />
      );
    //currentTarget.checked
    case "CheckboxList":
      return (
        <CheckboxListFilter
          {...props}
          // @ts-ignore
          handleOnChange={updateFilterWith}
        />
      );
    default:
      return null;
  }
};
export default FilterElementWrapper;

const getCurrentTarget = curry(extractor)("currentTarget");
const getTargetValue = curry(extractor)("target", "value");

function updateFilter(dispatch: ListingsContextType["dispatch"], payload: any) {
  dispatch({ type: "UPDATE_FILTER", payload });
}
