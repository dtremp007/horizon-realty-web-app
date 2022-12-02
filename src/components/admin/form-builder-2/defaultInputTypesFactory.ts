import {
  Checkbox,
  CheckboxProps,
  Flex,
  FlexProps,
  NumberInput,
  NumberInputProps,
  Select,
  SelectProps,
  TextInput,
  TextInputProps,
} from "@mantine/core";
import { InputFieldNode } from "./InputFieldNode";
import { InputTypeConstructor } from "./InputTypeConstructor";
import { keyToLabel } from "./convert-to-label";
import { FormParentNode } from "./FormParentNode";
import InputGroup, { InputGroupProps } from "./components/InputGroup";

/**
 * Takes a constructor and returns a constructor. It generates all the default input types.
 */
export default function defaultInputTypesFactory(constructor: InputTypeConstructor ) {
  constructor.build<"PRIMITIVE", TextInputProps>({
    name: "TextInput",
    priority: "LAST",
    parser: (key, value) => {
      if (typeof value === "string") {
        return new InputFieldNode({
          key,
          initialValue: value,
          element: TextInput,
          props: {
            label: keyToLabel(key),
          },
        });
      }
    },
  });

  constructor.build<"PRIMITIVE", CheckboxProps>({
    name: "Checkbox",
    priority: "LAST",
    parser: (key, value) => {
      if (typeof value === "boolean") {
        return new InputFieldNode({
          key,
          initialValue: value,
          element: Checkbox,
          props: {
            label: keyToLabel(key),
          },
          getInputOptions: {type: "checkbox"},
        });
      }
    },
  });

  constructor.build<"PRIMITIVE", NumberInputProps>({
    name: "NumberInput",
    priority: "LAST",
    parser: (key, value) => {
      if (typeof value === "number") {
        return new InputFieldNode({
          key,
          initialValue: value,
          element: NumberInput,
          props: {
            label: keyToLabel(key),
          },
        });
      }
    },
  });

  constructor.build<"PRIMITIVE", SelectProps>({
    name: "Select",
    priority: "LAST",
    parser: function (key, value) {
      if (Array.isArray(value)) {
        return new InputFieldNode({
          key,
          initialValue: value,
          element: Select,
          props: {
            label: keyToLabel(key),
            data: value,
          },
        });
      }
    },
  });

  constructor.build<"ABSTRACT", InputGroupProps>({
    name: "InputGroup",
    priority: "LAST",
    parser: (key, value) => {
      if (typeof value === "object" && !Array.isArray(value)) {
        return new FormParentNode({
          key,
          element: InputGroup,
          props: {
            label: keyToLabel(key),
            },
        });
      }
    },
  });

  return constructor;
}
