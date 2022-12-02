import { FormParentNode } from "./FormParentNode";
import { InputFieldNode } from "./InputFieldNode";
import { InputTypeConstructor } from "./InputTypeConstructor";

export type ValuesOf<T> = T[keyof T];

export type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

export type Price = `${"$"}${number}`;

export type Schema = {
  [key: string]: string | number | any[] | boolean | Schema;
};

export type InputTypeFactory = (constructor: InputTypeConstructor) => InputTypeConstructor;

export interface ParserContext {
    [key: string]: any;
}

export type ITBaseClass = "PRIMITIVE" | "ABSTRACT";

export type BasicPropsType = {
  value?: unknown;
  [key: string]: any;
};

export type DefaultInputTypes =
  | "Select"
  | "TextInput"
  | "HeadingInput"
  | "Group"
  | "Checkbox"
  | "NumberInput"
  | string;

export type SchemaParsingFunction<
  T extends ITBaseClass = "PRIMITIVE",
  P extends BasicPropsType = { value: unknown }
> = (
  this: ParserContext,
  key: string,
  value: ValuesOf<Schema>,
) =>
  | (T extends "PRIMITIVE" ? InputFieldNode<P> : FormParentNode<P>)
  | undefined;

export type InputTypeSettings<
  T extends ITBaseClass = any,
  P extends BasicPropsType = any
> = {
  name: DefaultInputTypes;
  priority: number | "FIRST" | "MED" | "LAST";
  parser: SchemaParsingFunction<T, P>;
};
