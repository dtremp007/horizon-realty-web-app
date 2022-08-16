import {
  NativeSelect,
  MultiSelect,
  RangeSlider,
  Space,
  SegmentedControl,
  Checkbox,
  CheckboxGroup,
  Button,
  ActionIcon,
} from "@mantine/core";
import CheckboxGroupWrapper from "./CheckboxGroupWrapper";
import RadioButtonGroup from "./RadioButtonGroup";
import SegmentControlWrapper from "./SegmentControlWrapper";
import { FilterParameter } from "../../../lib/interfaces/FilterTypes";
import { useState, useContext } from "react";
import { createComparisonFunction } from "../../context/listingsContext/listingsContext";
import { ComparisonOpType } from "../../context/listingsContext/listingsContext";
import ListingsContext from "../../context/listingsContext/listingsContext";
import { useEffect } from "react";

const locationIcon = (
  <svg height={20} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.89 23">
    <g>
      <path
        className="listing-card__location-icon"
        d="M8.94,23a38.85,38.85,0,0,1-4.47-4.51C2.43,16.05,0,12.41,0,9A8.95,8.95,0,0,1,10.69.17,8.94,8.94,0,0,1,17.89,9c0,3.46-2.43,7.1-4.48,9.54A38.07,38.07,0,0,1,8.94,23Zm0-17.89a3.86,3.86,0,1,0,2.71,1.13A3.85,3.85,0,0,0,8.94,5.11Z"
      />
    </g>
  </svg>
);

export const FilterItem = (
  filterParameter: FilterParameter) => {
  const { filterName, filterType, hasLegend, legendValue, filterProps, style, target, fallback } = filterParameter;
  const {listingsState, dispatch} = useContext(ListingsContext)

  useEffect(() => {
    console.log(listingsState.filters)
  }, [listingsState.filters])

  const [value, setValue] = useState(fallback)

  const handleChange = (e: any) => {
    //TODO: each filter should also create a comparison filter and dispatch it.
    let newValue
    let comparisonOperator: ComparisonOpType = "===";

    if (filterType === "NativeSelect") {
        newValue = e.currentTarget.value
        comparisonOperator = "==="
    }
    if (filterType === "RadioButtonGroup") {
        newValue = e.target.value
        comparisonOperator = "==="
    }
    if (filterType === "RangeSlider") {
        newValue = e
        comparisonOperator = "range"
    }
    if (filterType === "SegmentControl") {
        newValue = e
        comparisonOperator = "==="
    }
    if (filterType === "CheckboxGroup") {
        newValue = e
        comparisonOperator = "==="
    }
    setValue(newValue)

    const filter = {
        name: filterName,
        test: createComparisonFunction(target as string,comparisonOperator,newValue)
    }

    if (newValue === fallback) {
        dispatch({type: "REMOVE_FILTER", payload: filter})
        return
    }

    dispatch({type: "UPDATE_FILTER", payload: filter})
}

return (
    <fieldset style={style}>
      {hasLegend && <legend>{legendValue}</legend>}
      {getFilterComponent(filterType, filterProps, value, handleChange, filterName)}
    </fieldset>
  );
};

const getFilterComponent = (
  filterType: FilterParameter["filterType"],
  filterProps: any,
  value: any,
  handleChange: Function,
  filterName: string,
) => {
  switch (filterType) {
    // placeholder, data=string[]
    case "NativeSelect":
      return <NativeSelect value={value} variant="filled" icon={locationIcon} onChange={handleChange} {...filterProps} />;
    // data={id, value, label}[]
    case "RadioButtonGroup":
      return <RadioButtonGroup selected={value} filterName={filterName} handleChange={handleChange} filterProps={filterProps} />;
    // label, min, max, step, labelAlwaysOn
    case "RangeSlider":
      return <RangeSlider value={value} onChange={handleChange} {...filterProps} />;
    // data={label, value}[]
    case "SegmentControl":
      return <SegmentControlWrapper value={value} handleChange={handleChange } {...filterProps} />;
    // data={label, value}[]
    case "CheckboxGroup":
      return <CheckboxGroupWrapper value={value} handleChange={handleChange} filterProps={filterProps} />;
    default:
      return null;
  }
};
