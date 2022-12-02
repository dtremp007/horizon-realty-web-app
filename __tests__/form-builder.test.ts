import {
  Group,
  GroupProps,
  Select,
  SelectProps,
  TextInput,
  TextInputProps,
} from "@mantine/core";
import { formConstructor } from "../src/components/admin/form-builder-2/FormConstructor";
import { mountToParent } from "../src/components/admin/form-builder-2/InputFieldNode";
import inputTypeConstructor from "../src/components/admin/form-builder-2/InputTypeConstructor";

const { createInputType, done } = inputTypeConstructor();

createInputType<"PRIMITIVE", TextInputProps>("TextInput", {
  element: TextInput,
  baseClass: "PRIMITIVE",
  parser: ({ key, initialValue, ...props }) => ({
    key,
    initialValue,
    props,
  }),
});

createInputType<"PRIMITIVE", SelectProps>("Select", {
  element: Select,
  baseClass: "PRIMITIVE",
  parser: ({ key, initialValue, ...props }) => ({
    key,
    initialValue,
    props,
  }),
});

createInputType<"ABSTRACT", TextInputProps>("Group", {
  element: TextInput,
  baseClass: "ABSTRACT",
  parser: ({ key, ...props }) => ({
    key,
    initialValue: null,
    props,
  }),
});

const { getTypeSettings } = done();

const { addField, addGroup, returnForm } = formConstructor(
  getTypeSettings,
  mountToParent
);

addField("TextInput").define({
  key: "title",
  initialValue: "Un Casa Bonita",
  style: { marginLeft: ".75rem" },
});

addGroup()
  .define<GroupProps>({
    key: "price",
    position: "center",
  })
  .addField("Select")
    .define<SelectProps>({
        key: "currency",
        initialValue: "USD",
        data: ["USD", "MXN"],
    });

const root = returnForm();

describe("form-builder", () => {
  it("Can add a basic TextInput node", () => {
    expect(root.childNodes[0]).toStrictEqual({
      element: TextInput,
      key: "title",
      initialValue: "Un Casa Bonita",
      props: { style: { marginLeft: ".75rem" } },
      baseClass: "PRIMITIVE"
    });
  });

  it("Can add a new Group", () => {
    const root = returnForm();

    console.dir(root.childNodes[1]);
    expect(JSON.stringify(root.childNodes[1])).toBe(
      JSON.stringify({
        key: "price",
        element: Group,
        props: { position: "center" },
        baseClass: "ABSTRACT",
        childNodes: [
          {
            element: Select,
            baseClass: "PRIMITIVE",
            key: "currency",
            initialValue: "USD",
            props: { data: ["USD", "MXN"] },
          },
        ],
      })
    );
  });
});
