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

export const inputTypeConstructor = new InputTypeConstructor();

inputTypeConstructor.build<"PRIMITIVE", TextInputProps>({
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

inputTypeConstructor.build<"PRIMITIVE", CheckboxProps>({
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
      });
    }
  },
});

inputTypeConstructor.build<"PRIMITIVE", NumberInputProps>({
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

inputTypeConstructor.build<"PRIMITIVE", SelectProps>({
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

inputTypeConstructor.build<"ABSTRACT", FlexProps>({
  name: "Group",
  priority: "LAST",
  parser: (key, value) => {
    if (typeof value === "object" && !Array.isArray(value)) {
      return new FormParentNode({
        key,
        element: Flex,
      });
    }
  },
});
