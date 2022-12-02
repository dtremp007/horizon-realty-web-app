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
import R from "rambda";
import { ObjectIterator } from "./object-iterator";
import { Schema, SchemaParsingFunction, ParserContext } from "./types";
import { InputTypeConstructor } from "./InputTypeConstructor";
import { FormParentNode, mountToParent } from "./FormParentNode";
import { createPathSnowball } from "../../../../lib/util";

function _parseSchema(
  this: ParserContext,
  objectIterator: ObjectIterator,
  parent: FormParentNode<any>,
  parsingPipeline: SchemaParsingFunction[],
  pathSnowball: any
) {
  for (const [key, value] of objectIterator) {
    for (const parser of parsingPipeline) {
      const node = parser.call(this, key, value);

      // If node is undefined, then parser didn't mount anything
      if (node) {
        // If node is a FormParentNode, then call this function recursively with node as parent
        if (node instanceof FormParentNode) {
          _parseSchema.call(
            this,
            new ObjectIterator(value as Schema),
            node,
            parsingPipeline,
            pathSnowball(key)
          );
        } else {
          node.setPath(pathSnowball(key)());
        }
        mountToParent(parent, node);
        break;
      }
    }
  }
}

export function parseSchema(
  schema: Schema,
  inputTypeConstructor: InputTypeConstructor,
  parserContext: ParserContext,
  rootElement: any = Flex
) {
  const parsingPipeline = inputTypeConstructor.getParsingPipeline();
  const rootNode = new FormParentNode({
    key: "root",
    element: rootElement,
  });

  _parseSchema.call(
    parserContext,
    new ObjectIterator(schema),
    rootNode,
    parsingPipeline,
    createPathSnowball({})
  );

  return rootNode;
}
