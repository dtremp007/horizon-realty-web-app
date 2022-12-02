import { InputFieldNode } from "./InputFieldNode";
import { ITBaseClass } from "./types";


export class FormParentNode<Props> {
  key: string | symbol;
  props?: Props;
  element: any;
  childNodes: (InputFieldNode<any> | FormParentNode<any>)[] = [];
  baseClass: ITBaseClass = "ABSTRACT";

  constructor(values: Partial<FormParentNode<Props>>) {
    return Object.assign(this, values);
  }
}

export function mountToParent(
  parent: FormParentNode<any>,
  node: InputFieldNode<any> | FormParentNode<any>
) {
  parent.childNodes.push(node);
}
