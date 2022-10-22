import { curry, mergeAll, mergeDeepRight } from "rambda";
import { useMemo } from "react";
import {
  FilterConfigOptions,
  FilterElement,
  FilterElement_V2_Props,
} from "../../../../lib/interfaces/FilterTypes";
import {
  getCompatibleFieldKeys,
  getFallbackValue,
  getFallbackValueSelection,
  getOptionsForFieldKey,
} from "../../../../lib/util";
import { LocalMetadata } from "../../../../pages/admin/filters";

type UseFilterConfigOptionsProps = {
  metadata: LocalMetadata;
  filter: FilterElement_V2_Props;
};

const useFilterConfigOptions = ({
  metadata,
  filter,
}: UseFilterConfigOptionsProps) => {
  const configOptions = useMemo(() => {
    const defaultOptions = metadata.filters.defaultOptions;
    const filterOptions = metadata.filters.ofType.get(filter.type)!.options;

    // Curry applyFunction with metadata and filter set already.
    const functionParser = curry(applyFunction)(metadata, filter);
    return createConfigOptions(defaultOptions, filterOptions, functionParser);
  }, [filter.id, filter.fieldKey]) as FilterConfigOptions;

  return { configOptions };
};
export default useFilterConfigOptions;

export function createConfigOptions(
  defaultOptions: FilterConfigOptions,
  filterOptions: FilterConfigOptions,
  functionParser: (obj: {}) => any
) {
  const configOptions = structuredClone(mergeDeepRight(
    defaultOptions,
    filterOptions
  ) as FilterConfigOptions)

  lookForFunctionCalls(configOptions, functionParser);

  return configOptions;
}

export function lookForFunctionCalls(
  obj: { [key: string]: any },
  functionParser: (obj: {}) => any
) {
  for (let key in obj) {
    if (obj[key].hasOwnProperty("functionCall")) {
      obj[key] = functionParser(obj[key]);
      continue;
    }

    if (typeof obj[key] === "object") {
      lookForFunctionCalls(obj[key], functionParser);
    }
  }
}

type FunctionCallProps = {
  functionCall: "getCompatibleFieldKeys" | string;
  argumentList: any[];
};

export function applyFunction(
  metadata: LocalMetadata,
  filter: FilterElement_V2_Props,
  { functionCall, argumentList }: FunctionCallProps
) {
  switch (functionCall) {
    case "getCompatibleFieldKeys":
      return getCompatibleFieldKeys(metadata, filter.type);
    case "getFallbackValueSelection":
      return getFallbackValueSelection(filter);
    case "getOptionsForFieldKey":
      return getOptionsForFieldKey(metadata, filter);
    default:
      break;
  }
}
