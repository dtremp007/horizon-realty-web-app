import { Checkbox, CheckboxProps, Group } from "@mantine/core";
import { FilterElement_V2_Props } from "../../../lib/interfaces/FilterTypes";
import { ChangeEvent, useCallback } from "react";
import {
  any,
  isEmpty,
  lensProp,
  map,
  mergeAll,
  mergeLeft,
  pipe,
  propEq,
  view,
  when,
} from "rambda";
import { ListingsContextType } from "../../context/listingsContext/listingsContext";

const CheckboxListFilter = (props: FilterElement_V2_Props<CheckboxProps>) => {
  const {
    id,
    fieldsetStyle,
    legend,
    filterValue,
    filterProps,
    handleOnChange,
    children,
  } = props;

  const extractValue = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const label = e.currentTarget.labels![0].innerText;
    const checked = e.currentTarget.checked;

    const updateFilterValue = mergeLeft({
      filterValue: checked,
      active: checked,
    });
    // @ts-ignore
    const children = map(
      when((x: FilterElement_V2_Props) => x.filterProps.label === label, updateFilterValue),
      props.children
    );

    return {
      id: props.id,
      active: any(view(lensProp("active")), props.children!), // work with this
      children,
    };
  }, [props]);

  if (isEmpty(children)) return null;

  return (
    <fieldset>
      <legend>{legend}</legend>
      <Group direction="column" spacing={9}>
        {children!.map(({ id, filterValue, filterProps }, index) => (
          <Checkbox
            key={id}
            {...filterProps}
            checked={filterValue}
            // @ts-ignore
            onChange={pipe(extractValue, handleOnChange)}
          />
        ))}
      </Group>
    </fieldset>
  );
};

export default CheckboxListFilter;

export function updateCheckboxListFilter(
  dispatch: ListingsContextType["dispatch"],
  props: FilterElement_V2_Props
) {
  return function (e: ChangeEvent<HTMLInputElement>) {
    const label = e.currentTarget.labels![0].innerText;
    const checked = e.currentTarget.checked;

    const updateFilterValue = mergeLeft({
      filterValue: checked,
      active: checked,
    });
    // @ts-ignore
    const children = map( when((x) => x.filterProps.label === label, updateFilterValue),
      props.children
    );

    return {
      id: props.id,
      active: any(view(lensProp("active")), props.children!),
      children,
    };
  };
}
