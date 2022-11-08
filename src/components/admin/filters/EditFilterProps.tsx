import {
  ActionIcon,
  Button,
  Center,
  Checkbox,
 Flex,
  NumberInput,
  Select,
  TextInput,
  Text,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { curry, filter, mergeAll, mergeRight, omit } from "rambda";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  FilterConfigInputProps,
  FilterConfigOptions,
  FilterElement,
  FilterElement_V2_Props,
} from "../../../../lib/interfaces/FilterTypes";
import { IconGripVertical } from "@tabler/icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { LocalMetadata } from "../../../../pages/admin/filters";
import {
  createFilterPropListItem,
  createPathSnowball,
  curryStringInput,
  getObjectPath,
} from "../../../../lib/util";
import { useFormContext } from "./FilterBuilder";
import { IconSquarePlus, IconX } from "@tabler/icons";

type MapsOverEntriesProps = {
  inputs: FilterConfigOptions;
  pathToInput: any;
};

export const MapsOverEntries = ({
  inputs,
  pathToInput,
}: MapsOverEntriesProps) => {
  return (
    <>
      {Object.entries(inputs)
        .filter(([key, inputOptions]) => !inputOptions.hide)
        .map(([key, inputOptions]) => (
          <InputWrapper
            key={key}
            options={inputOptions}
            pathToInput={pathToInput(key)}
          />
        ))}
    </>
  );
};

type InputWrapperProps = {
  options: FilterConfigInputProps;
  pathToInput: any;
};

function InputWrapper({ options, pathToInput }: InputWrapperProps) {
  const form = useFormContext();
  const mergeProps = mergeRight(omit(["type"], options));
  const standardProps = mergeProps(
    form.getInputProps(pathToInput(), {
      type: options.type === "checkbox" ? "checkbox" : "input",
    })
  ) as any; // same as form.getInputProps("filterProps.prop")

  switch (options.type) {
    case "checkbox":
      return <Checkbox {...standardProps} />;
    case "number":
      return <NumberInput {...standardProps} />;
    case "select":
      return <Select {...standardProps} />;
    case "text":
      return <TextInput {...standardProps} />;
    case "list":
      return (
        <DataList
          pathToInput={pathToInput}
          listInputs={mergeProps({}) as any}
        />
      );
    case "group":
      return (
        <FormGroup inputs={mergeProps({}) as any} pathToInput={pathToInput} />
      );
    default:
      return <p>Fix bug...</p>;
  }
}

type DataListProps = {
  pathToInput: any;
  listInputs: FilterConfigOptions;
};

const DataList = ({ pathToInput, listInputs }: DataListProps) => {
  const form = useFormContext();

  return (
    <Flex justify="center" direction="column">
      <div style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-around", width: "calc(100% - 40px)" }}>
          <p style={{fontSize: "16px"}}>Label</p>
          <p style={{fontSize: "16px"}}>Value</p>
        </div>
      </div>
      {(getObjectPath(pathToInput(), form.values) as {}[]).map((_, index) => (
        <Flex key={index} justify="center" direction="row">
          <MapsOverEntries
            inputs={listInputs}
            pathToInput={pathToInput(index.toString())}
          />
          <ActionIcon onClick={() => form.removeListItem(pathToInput(), index)}>
            <IconX />
          </ActionIcon>
        </Flex>
      ))}
      <Button
        leftIcon={<IconSquarePlus />}
        variant="subtle"
        color="gray"
        onClick={() =>
          form.insertListItem(
            pathToInput(),
            createFilterPropListItem(form, listInputs)
          )
        }
      >
        Add Field
      </Button>
    </Flex>
  );
};

type FormGroupProps = {
  inputs: FilterConfigOptions;
  pathToInput: any;
};

export const FormGroup = ({ inputs, pathToInput }: FormGroupProps) => {
  return (
    <Flex align="center" direction="column">
      <MapsOverEntries inputs={inputs} pathToInput={pathToInput} />
    </Flex>
  );
};
