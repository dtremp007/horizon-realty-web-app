import { Checkbox, CheckboxProps, Group } from "@mantine/core";
import { FilterElement_V2_Props } from "../../../lib/interfaces/FilterTypes";
import { ChangeEvent, useCallback, useState } from "react";
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

  const extractValue = useCallback(
    (index: number) => {
      return (checked: boolean) => {
        const checkbox = children![index];

        // @ts-ignore
        handleOnChange({[checkbox.id]: checked})
      };
    },
    [props]
  );

  if (isEmpty(children)) return null;

  return (
    <fieldset>
      <legend>{legend}</legend>
      <Group direction="column" spacing={9}>
        {children!.map((filter, index) => (
            <CheckboxWrapper key={filter.id} filter={filter} handleOnChange={extractValue(index)}/>
        ))}
      </Group>
    </fieldset>
  );
};

type CheckboxWrapperProps = {
    filter: FilterElement_V2_Props<CheckboxProps>;
    handleOnChange: (checked: boolean) => void
}

const CheckboxWrapper = ({filter, handleOnChange}: CheckboxWrapperProps) => {
    const [checked, setChecked] = useState(filter.filterValue)

    return (
          <Checkbox
            {...filter.filterProps}
            checked={checked}
            onChange={(e) => {
                const checked = e.currentTarget.checked;
                handleOnChange(checked)
                setChecked(checked)
            }}
          />
    )
}

export default CheckboxListFilter;

// export function updateCheckboxListFilter(
//   dispatch: ListingsContextType["dispatch"],
//   props: FilterElement_V2_Props
// ) {
//   return function (e: ChangeEvent<HTMLInputElement>) {
//     const label = e.currentTarget.labels![0].innerText;
//     const checked = e.currentTarget.checked;

//     const updateFilterValue = mergeLeft({
//       filterValue: checked,
//       active: checked,
//     });
//     // @ts-ignore
//     const children = map(
//       when((x) => x.filterProps.label === label, updateFilterValue),
//       props.children
//     );

//     return {
//       id: props.id,
//       active: any(view(lensProp("active")), props.children!),
//       children,
//     };
//   };
// }
