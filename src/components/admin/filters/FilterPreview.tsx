import { EditFilterContext } from "../../../../pages/admin/filters";
import { ActionIcon, Group, Space } from "@mantine/core";
import { extractor } from "../../../../lib/util";
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
  has,
} from "rambda";
import React, { useCallback, useContext, useEffect } from "react";
import CheckboxListFilter from "../../filter_v2/CheckboxListFilter";
import NativeSelectFilter, {
  updateNativeSelectFilter,
} from "../../filter_v2/NativeSelectFilter";
import RadioButtonGroupFilter, {
  updateRadioButtonGroupFilter,
} from "../../filter_v2/RadioButtonGroupFilter";
import RangeSliderFilter, {
  updateRangeSliderFilter,
} from "../../filter_v2/RangeSliderFilter";
import SegmentedControlFilter from "../../filter_v2/SegmentedControlFilter";
import { FilterElement_V2_Props } from "../../../../lib/interfaces/FilterTypes";
import { IconTrash, IconEdit, IconCirclePlus } from "@tabler/icons";

const FilterPreview = () => {
  const { state, dispatch } = useContext(EditFilterContext);
  return (
    <form className="filter-menu__form flow-content">
      <Space />
      {Array.from(state.savedFilters).map(([key, filter]) => (
        <FilterUIOverlay key={key} filterProps={filter}/>
      ))}
      <Space />
    </form>
  );
};
export default FilterPreview;

const FilterWrapper = (props: FilterElement_V2_Props) => {
  const { state, dispatch } = useContext(EditFilterContext);

  const updateFilterWithPayload = (value: any) => {
    const payload =
      typeof value === "object"
        ? value
        : {
            id: props.id,
            filterValue: value,
          };
    dispatch({
      type: "UPDATE_FILTER",
      payload,
    });
  };

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
        // @ts-ignore
        <RangeSliderFilter
          {...props}
          handleOnChange={updateFilterWithPayload}
        />
      );
    // value
    case "SegmentedControl":
      return (
        // @ts-ignore
        <SegmentedControlFilter
          {...props}
          handleOnChange={updateFilterWithPayload}
        />
      );
    //currentTarget.checked
    case "CheckboxList":
      return (
        <CheckboxListFilter
          {...props}
          // @ts-ignore
          handleOnChange={updateFilterWithPayload}
        />
      );
    default:
      return (
        <div style={{height: "200px"}}/>
      );
  }
};

const FilterUIOverlay = ({filterProps }: { filterProps: FilterElement_V2_Props }) => {
  const { state, dispatch } = useContext(EditFilterContext);

  return (
    <div className="filter-ui-overlay__container">
      <Group position="right" className="filter-ui-overlay filter-ui-overlay--padding">
        <ActionIcon onClick={() => dispatch({type: "FILTER_TO_EDIT_MODE", payload: filterProps.id})}>
          <IconEdit />
        </ActionIcon>
        <ActionIcon>
          <IconTrash />
        </ActionIcon>
      </Group>
      <FilterWrapper {...filterProps} />
      <Group position="center" className="filter-ui-overlay">
        <ActionIcon>
          <IconCirclePlus />
        </ActionIcon>
      </Group>
    </div>
  );
};

const getCurrentTarget = curry(extractor)("currentTarget");
const getTargetValue = curry(extractor)("target", "value");
