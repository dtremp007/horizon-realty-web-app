import { UseFormReturnType } from "@mantine/form";
import { GetInputPropsType } from "@mantine/form/lib/types";
import { BasicPropsType, ITBaseClass } from "./types";

export class InputFieldNode<Props extends BasicPropsType> {
  key: string;
  initialValue: Props["value"];
  element: any;
  props: Props;
  baseClass: ITBaseClass = "PRIMITIVE";
  path: string;
  getInputOptions?: {
    type?: GetInputPropsType;
    withError?: boolean;
    withFocus?: boolean;
  };

  constructor(values: Partial<InputFieldNode<Props>>) {
    return Object.assign(this, values);
  }

  setPath(path: string) {
    this.path = path;
  }

  getInputProps(form: UseFormReturnType<any>) {
    return Object.assign(this.props, form.getInputProps(this.path, this.getInputOptions));
  }
}
