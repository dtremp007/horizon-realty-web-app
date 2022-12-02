import { InputFieldNode } from "./InputFieldNode";
import { FormParentNode } from "./FormParentNode";

export function getInitalValues(
  parent: FormParentNode<any>,
  initialValues: Record<string, unknown> = {}
) {
  for (const node of parent.childNodes) {
    if (node.baseClass === "ABSTRACT") {
        initialValues[node.key as string] = getInitalValues(node as FormParentNode<any>)
    } else {
        initialValues[node.key as string] = (node as InputFieldNode<any>).initialValue
    }
  }
  return initialValues
}
