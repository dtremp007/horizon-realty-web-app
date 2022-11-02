import { Checkbox, CheckboxProps, Group } from "@mantine/core";
import { FilterElement_V2_Props } from "../../../lib/interfaces/FilterTypes";
import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
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
import ListingsContext, {
  ListingsContextType,
} from "../../context/listingsContext/listingsContext";
import { useRouter } from "next/router";

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
        handleOnChange({ [checkbox.id]: checked });
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
          <CheckboxWrapper
            key={filter.id}
            filter={filter}
            handleOnChange={extractValue(index)}
          />
        ))}
      </Group>
    </fieldset>
  );
};

type CheckboxWrapperProps = {
  filter: FilterElement_V2_Props<CheckboxProps>;
  handleOnChange: (checked: boolean) => void;
};

const CheckboxWrapper = ({ filter, handleOnChange }: CheckboxWrapperProps) => {
  const [checked, setChecked] = useState(filter.filterValue as boolean);
  const router = useRouter();

  useEffect(() => {
    if (router.query[filter.id] && checked && checked.toString() !== router.query[filter.id]) {
        setChecked(filter.fallback)
    }
  }, [router.query])

  return (
    <Checkbox
      {...filter.filterProps}
      checked={checked}
      onChange={(e) => {
        const checked = e.currentTarget.checked;
        handleOnChange(checked);
        setChecked(checked);
      }}
    />
  );
};

export default CheckboxListFilter;
