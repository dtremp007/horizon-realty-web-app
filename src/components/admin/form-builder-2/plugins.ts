import {
  Accordion,
  AccordionProps,
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
import { InputTypeFactory } from "./types";
import { isSpecialKey, parseSpecialKey } from "./utils/parse-special-keys";

export const PricePlugin: InputTypeFactory = (
  constructor: InputTypeConstructor
) => {
  constructor.build<"PRIMITIVE", NumberInputProps>({
    name: "PriceInput",
    priority: "MED",
    parser: (key, value) => {
      if (typeof value === "string" && value.startsWith("$")) {
        return new InputFieldNode({
          key,
          initialValue: +value.slice(1),
          element: NumberInput,
          props: {
            label: keyToLabel(key),
            step: 100,
            parser: (value) => value?.replace(/\$\s?|(,*)/g, ""),
            formatter: (value) =>
              !Number.isNaN(parseFloat(value || "0"))
                ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : "$ ",
          },
        });
      }
    },
  });
  return constructor;
};

export const AccordionPlugin: InputTypeFactory = (
  constructor: InputTypeConstructor
) => {
  constructor.build<"ABSTRACT", AccordionProps>({
    name: "Accordion",
    priority: "FIRST",
    parser: (key, value) => {
      if (isSpecialKey(key)) {
        const {functionName, parameters} = parseSpecialKey(key);

        return new FormParentNode({
          key,
          element: Accordion,
        });
      }
    },
  });

  return constructor;
};
