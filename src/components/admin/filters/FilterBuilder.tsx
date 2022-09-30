import { EditFilterContext } from "../../../../pages/admin/filters";
import { ActionIcon, Group, Select, Space, TextInput } from "@mantine/core";
import { extractor, getCompatibleFieldKeys } from "../../../../lib/util";
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
  toPairs,
} from "rambda";
import React, { useCallback, useContext, useEffect } from "react";
import { FilterElement_V2_Props } from "../../../../lib/interfaces/FilterTypes";
import { IconTrash, IconEdit, IconCirclePlus } from "@tabler/icons";

const FilterBuilder = () => {
  const { state, dispatch, metadata } = useContext(EditFilterContext);
  const filterBeingEdited = state.savedFilters.get(
    state.filterBeingEdited as string
  )!;

  return (
    <Group direction="column" position="center">
      {Array.from(metadata.filters.defaultOptions).map(([key, options]) => (
        <>
          {options.type === "text" ? (
            <TextInput key={key} label={options.label} value={filterBeingEdited[key as keyof FilterElement_V2_Props]}/>
          ) : (
            <Select key={key} label={options.label} data={getCompatibleFieldKeys(metadata, filterBeingEdited.type)} />
          )}
        </>
      ))}
    </Group>
  );
};
export default FilterBuilder;
