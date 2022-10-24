import { EditFilterContext } from "../../../../pages/admin/filters";
import dynamic from "next/dynamic";
import {
  ActionIcon,
  Button,
  Divider,
  Group,
  ScrollArea,
  Select,
  Space,
  TextInput,
} from "@mantine/core";
import {
  createPathSnowball,
  extractor,
  getCompatibleFieldKeys,
  getFallbackValue,
} from "../../../../lib/util";
import {
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
  mergeAll,
} from "rambda";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { FilterElement_V2_Props } from "../../../../lib/interfaces/FilterTypes";
import { IconTrash, IconEdit, IconCirclePlus } from "@tabler/icons";
import { createFormContext } from "@mantine/form";
import useFilterConfigOptions from "./useFilterConfigOptions";
import { FormGroup, MapsOverEntries } from "./EditFilterProps";
import EditJsonModal from "./EditJsonModal";

const [FormProvider, useFormContext, useForm] =
  createFormContext<FilterElement_V2_Props>();

export { useFormContext };

const FilterBuilder = () => {
  const { state, dispatch, metadata, saveFilters } =
    useContext(EditFilterContext);

  const filterBeingEdited = state.savedFilters.get(
    state.filterBeingEdited as string
  )!;

  const form = useForm({
    initialValues: filterBeingEdited,
  });

  const { configOptions } = useFilterConfigOptions({
    metadata,
    filter: form.values,
  });

  /**
   * TODO: Make fallback value auto-update when min or max changes.
   * useEffect wasn't the right idea.
   */

  useEffect(() => {
    if (form.isDirty()) {
      dispatch({ type: "UPDATE_FILTER_SAVED_STATUS", payload: false });
    }
  }, [form.isDirty()]);

  useEffect(() => {
    dispatch({ type: "UPDATE_FILTER", payload: form.values });
  }, [form.values]);

  return (
    <FormProvider form={form}>
      <ScrollArea style={{ height: "calc(100vh - 78px)" }}>
        <form>
        <Group position="right" m={18}>
          <Button type="submit" disabled={state.filterSaved} onClick={() => saveFilters()}>
            Save
          </Button>
        </Group>
          <FormGroup
            inputs={configOptions}
            pathToInput={createPathSnowball({})}
          />
        </form>
        <EditJsonModal
          onClose={(values: FilterElement_V2_Props) => {
            dispatch({ type: "UPDATE_FILTER_SAVED_STATUS", payload: false });
            form.setValues(values);
          }}
        />
        <div className="space r2" />
      </ScrollArea>
    </FormProvider>
  );
};
export default FilterBuilder;
