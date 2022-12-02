import {
  ITBaseClass,
  BasicPropsType,
  InputTypeSettings,
} from "./types";

/**
 * This class is used to create input types.
 *
 * ```
 * const constructor = new InputTypeConstructor
 *
 * constructor.newInputType<"PRIMITIVE", TextInputProps>("TextInput", {
 *    priority: "LAST",
 *    parser: ({key, value}) => new InputFieldNode({
 *      key,
 *      initialValue: value,
 *      props: {label: keyToLabel(key)}
 *    })
 * })
 * ```
 */
export class InputTypeConstructor {
  private inputTypes: InputTypeSettings[];

  constructor() {
    this.inputTypes = [];
  }

  build<Class extends ITBaseClass, Props extends BasicPropsType>(
    settings: InputTypeSettings<Class, Props>
  ) {
    switch (settings.priority) {
      case "FIRST":
        settings.priority = -1;
        break;
      case "MED":
        settings.priority = 0;
        break;
      case "LAST":
        settings.priority = 1;
        break;
      default:
        break;
    }

    this.inputTypes.push(settings);
  }

  private buildPipeline() {
    return this.inputTypes
      .sort((a, b) => (a.priority as number) - (b.priority as number))
      .map((settings) => settings.parser)
  }

  getParsingPipeline() {
    return this.buildPipeline();
  }
}
