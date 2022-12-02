import { Flex, FlexProps, Text } from "@mantine/core";
import { useForm, UseFormReturnType } from "@mantine/form";
import { useEffect, useMemo } from "react";
import { getInitalValues } from "./get-initial-values";
import { InputTypeFactory, ParserContext, Schema } from "./types";
import { parseSchema } from "./SchemaParser";
import { inputTypeConstructor } from "./define-input-types";
import { FormParentNode } from "./FormParentNode";
import { InputFieldNode } from "./InputFieldNode";
import { keyToLabel } from "./convert-to-label";
import { pipe } from "rambda";
import defaultInputTypesFactory from "./defaultInputTypesFactory";
import { InputTypeConstructor } from "./InputTypeConstructor";
import { UseFormInput } from "@mantine/form/lib/types";

type RenderFormProps<T extends Schema> = {
  schema: T;
  context?: ParserContext;
  inputTypeExtensions?: InputTypeFactory[];
  useFormInput?: UseFormInput<T>;
};

const RenderForm = <T extends Schema>({
  schema,
  context,
  inputTypeExtensions,
  useFormInput = {},
}: RenderFormProps<T>) => {
  const root = useMemo(() => {
    const factory = pipe.apply(
      null,
      [defaultInputTypesFactory].concat(inputTypeExtensions || []) as any
    ) as InputTypeFactory;

    return parseSchema(
      schema,
      factory(new InputTypeConstructor()),
      context || {}
    );
  }, []);

  const RootElement = (root as FormParentNode<FlexProps>).element;
  const form = useForm(
    Object.assign(useFormInput, { initialValues: getInitalValues(root) })
  );

  return (
    <RootElement direction="column" align="flex-start">
      {(root as FormParentNode<FlexProps>).childNodes.map((node) => (
        <RenderNode key={node.key as string} node={node} form={form} />
      ))}
    </RootElement>
  );
};
export default RenderForm;

type RenderNodeProps = {
  node: FormParentNode<any> | InputFieldNode<any>;
  form: UseFormReturnType<any>;
};

const RenderNode = ({ node, form }: RenderNodeProps) => {
  const Element = node.element;

  if (node instanceof FormParentNode) {
    return (
        <Element {...node.props}>
          {(node as FormParentNode<any>).childNodes.map((childNode) => (
            <RenderNode
              key={childNode.key as string}
              node={childNode}
              form={form}
            />
          ))}
        </Element>
    );
  }

  return <Element {...node.getInputProps(form)} />;
};
