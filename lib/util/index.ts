import { DocumentData } from "firebase/firestore";
import {
  ComparisonFunction,
  ComparisonFunctionItem,
  ComparisonOpType,
  FiltersMap,
} from "../../src/context/listingsContext/listingsContext";
import { ListingsState } from "../../src/context/listingsContext/listingsContext";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.config";
import {
  EditFilterState,
  LocalMetadata,
  WebsiteMetadata,
} from "../../pages/admin/filters";
import {
  FilterConfigOptions,
  FilterElement,
  FilterElement_V2_Props,
} from "../interfaces/FilterTypes";
import { ListingFieldKey, ListingFieldOptions } from "../interfaces/Listings";
import {
  all,
  concat,
  equals,
  isEmpty,
  isNil,
  map,
  merge,
  mergeAll,
  mergeDeepRight,
  objOf,
} from "rambda";
import { JSON_FilterProps } from "../interfaces/FilterTypes";
import path from "path";
import fs from "fs";
import { GetInputProps, UseFormReturnType } from "@mantine/form/lib/types";
const __ = { "@@functional/placeholder": true };
import { v4 as uuidv4 } from "uuid";

/**
 * This function is almost intentical to `createComparisonFunction`, but instead of a closure, it returns the
 * stringified version of the closure. Might be useful for debugging.
 */
export function stringifyComparisonFunction(
  filterName: string,
  t: keyof DocumentData,
  o: ComparisonOpType,
  v: string | number | number[]
) {
  let funcString = `<pre><span class="comment">// ${filterName}<br></span>(<span class="variable">listing</span>) <span class="keyword">=&#62</span> `;
  switch (o) {
    case "includes":
      return funcString.concat(
        `<span class="variable">listing</span>[<span class="string">"${t}"</span>].includes(${
          typeof v === "number"
            ? `<span class="number">${v}</span>`
            : `<span class="string">"${v}"</span>`
        })</pre`
      );
    case "range":
      if (Array.isArray(v)) {
        const [lo, hi] = v;
        return funcString.concat(
          `<span class="variable">listing</span>[<span class="string">"${t}"</span>] <span class="keyword">&#62=</span> ${`<span class="number">${lo}</span>`} <span class="keyword">&&</span> <span class="variable">listing</span>[<span class="string">"${t}"</span>] <span class="keyword">&#60=</span> ${`<span class="number">${hi}</span>`}</pre>`
        );
      }
    default:
      return funcString.concat(
        `<span class="variable">listing</span>[<span class="string">"${t}"</span>] <span class="keyword">${o}</span> ${
          typeof v === "number"
            ? `<span class="number">${v}</span>`
            : `<span class="string">"${v}"</span>`
        }</pre>`
      );
  }
}

export function createListingEntryStringifyFunction(
  title: string,
  key: string,
  value: any,
  didPass: boolean
) {
  return () => {
    return `<pre style="display:flex;padding-left:3rem;"><span>${title.replace(
      / /g,
      ""
    )}</span><span class="variable">.${key} </span><span>= </span>${
      typeof value === "number"
        ? `<span class='number'>${value}</span>`
        : `<span class='string'>"${value}"</span>`
    }<span>; </span><span style="margin-left:auto" class="comment">// ${
      didPass ? "passed" : "failed"
    }</span></pre>`;
  };
}

/**
 * 1. Strip out all the fields that are automatically incompatible
 * 2. Filter for fields that match our type, it might be a single type, or an array of types.
 * 3. Filter out any excludes
 * 4. Return an array with compatible propertyfields
 */
export function getCompatibleFieldKeys(
  metadata: LocalMetadata,
  sender: FilterElement
) {
  const useWith = metadata.filters.ofType.get(sender)?.useWith;
  if (typeof useWith === "undefined")
    throw `WTF!? ${sender} is not a FilterElement`;

  function filterFieldKeys([key, listingFieldOptions]: [
    key: ListingFieldKey,
    listingFieldOptions: ListingFieldOptions
  ]) {
    if (listingFieldOptions.filterIncompatible) return false;

    if (_this(useWith?.exclude).isEqualTo(key)) return false;

    if (_this(useWith?.include).isEqualTo(key)) return true;

    if (_this(useWith?.type).isEqualTo(listingFieldOptions.dataType))
      return true;

    return false;
  }

  return Array.from(metadata.listings.fields)
    .filter(filterFieldKeys)
    .map(([key]) => key);
}

/**
 * A symantically comfortable way to compare a string to either a string or an array of strings.
 * @param value - either a string of an array of strings to compare against.
 * @returns a method that take in a comparee.
 *
 * ```
 * if (_this(value).isEqualTo(thisOtherValue)) {
 *      execute(code);
 * }
 * ```
 */
function _this(value: string | string[] | undefined) {
  if (isEmpty(value) || isNil(value)) {
    return {
      isEqualTo: (comparee: string) => false,
    };
  }

  if (Array.isArray(value)) {
    return {
      isEqualTo: (comparee: string) => value.includes(comparee),
    };
  }

  if (typeof value === "string") {
    return {
      isEqualTo: (comparee: string) => value === comparee,
    };
  }

  throw `Idiot. You passed in ${value} to _this function.`;
}

function* countGenerator() {
  let count = 0;
  while (true) {
    yield ++count;
  }
}

const count = countGenerator();

function generateFilterName(filterType: FilterElement) {
  return `${filterType}_${count.next().value}`;
}

export function* increaseByGenerator(inc: number) {
  let count = 10;
  while (true) {
    yield (count += inc);
  }
}

export function extractor(key1: string | null, key2: string | null, prop: any) {
  if (!isNil(key1) && !isNil(key2)) return prop[key1][key2];
  return prop;
}

/**
 * Maybe poorly named, but it takes a class that needs to be toggled,
 * and a condition, and returns a function that will toggle the passed in class.
 */
export function getToggleFunction(className: string, condition: boolean) {
  /**
   * This is a closure that takes class name to toggle, and it takes
   * the default class list that shouldn't be toggled.
   *
   * The condition is passed into the parent function.
   */
  return (defaultClass: string) => {
    if (condition) {
      return defaultClass + " " + className;
    }

    return defaultClass;
  };
}

/**
 * This function takes a filtersMap, and an array of key value pairs (ex. [["listingType", "CASA"], ...])
 * and merges the key value pair with the oldFilter object, checking if filterValue ("CASA") is equal to
 * the filter fallback ("ALL").
 * ```
 * dispatch({
 *      type: "UPDATE_AND_APPLY_MULTIPLE_FILTER",
 *      payload: Object.entries(router.query),
 * });
 * // context.ts
 * return {
 *    ...state,
 *    filters: updateMultipleFilters(state.filters, action.payload),
 * }
 * ```
 */
export function updateMultipleFilters(
  filtersMap: FiltersMap,
  filters: [string, any][]
) {
  for (const [id, filterValue] of filters) {
    if (filtersMap.has(id)) {
      const oldFilter = filtersMap.get(id) as FilterElement_V2_Props;
      filtersMap.set(
        id,
        mergeAll([
          oldFilter,
          { filterValue, active: !(oldFilter.fallback === filterValue) },
        ])
      );
    }
  }
  return filtersMap;
}

export function queryParamsToFilterValues(
  filtersMap: FiltersMap,
  params: { [key: string]: any }
) {
  for (const [key, filter] of filtersMap) {
    let {new_value, comp_op} = deserializeQueryParams(params[key]);
    if (new_value !== undefined) {
      // Don't change anything if the values haven't changed.
      if (equals(new_value, filter.filterValue)) continue;

      filter.active = !equals(new_value, filter.fallback);
      filter.filterValue = new_value;
      filter.comparisonOperator = comp_op;
    }
    if (filter.type === "CheckboxList" && filter.children) {
      let filterActive = false;
      for (const child of filter.children) {
        new_value = deserializeQueryParams(params[child.id]).new_value as boolean;
        if (new_value === undefined) continue;

        child.filterValue = new_value;
        child.active = new_value;

        if (new_value) filterActive = true;
      }
      filter.active = filterActive;
    }
  }

  return filtersMap;
}

export function curryStringInput(f: GetInputProps<any>, seperator?: string) {
  function concatArguments(arg1?: any, arg2?: any): any {
    if (arguments.length === 0) throw "You gave 0 arguments.";

    if (arguments[0] === 0) return concatArguments.bind(null, arguments[1]); // first call

    if (arguments.length > 1) {
      if (all((prop) => typeof prop === "string", Array.from(arguments)))
        return concatArguments.bind(
          null,
          Array.from(arguments).join(seperator ? seperator : ".")
        );

      if (typeof arguments[1] === "object") {
        const [path, options] = Array.from(arguments);
        return f(path, options);
      }
    }
    return f(arguments[0]);
  }

  return concatArguments.bind(null, 0);
}

type CreatePathSnowballOptions = {
  initialString?: string;
  separator?: string;
};

/**
 * This function returns a function that takes a string, and returns a function which can be called
 * on empty to return a path string concatenated from each call of the funciton. It's especially useful with
 * recursive prop drilling, and mantine's use-form hook.
 * ```
 * const pathSnowball = createPathSnowball({})
 *
 * const func = pathSnowball("filterProps")
 * const func_2 = func("data")
 *
 * const path = func_2() // -> "filterProps.data"
 * form.getInputProps(path)
 * ```
 */
export function createPathSnowball({
  initialString,
  separator = ".",
}: CreatePathSnowballOptions) {
  function pathSnowball_2(path: string[]) {
    return (...strings: string[]) => {
      if (strings.length === 0) {
        return path.join(separator);
      }

      if (strings[0].length > 0) {
        return pathSnowball_2(concat(path, strings));
      }

      return pathSnowball_2(path);
    };
  }

  return pathSnowball_2(initialString ? [initialString] : []);
}

/**
 * I ~~stole~~ **took inspiration for** this function from the mantine repo. It works by running `split(".")` on the path string.
 * It uses the first element in the array to index into values, returns that value, and does this again with
 * the next element in the array.
 * ```
 * let value = values[splitPath[0]]
 * // ...
 * return value[splitPath[last]]
 * ```
 * @param path - path string seperated by '.'
 * @param values - object to index into
 * @returns value at specified path.
 */
export function getObjectPath(path: string, values: { [key: string]: any }) {
  const splitPath = typeof path === "string" ? path.split(".") : [];

  if (splitPath.length === 0 || typeof values !== "object" || values === null) {
    return undefined;
  }

  let value = values[splitPath[0]];
  for (let i = 1; i < splitPath.length; i++) {
    if (value === undefined) {
      break;
    }

    value = value[splitPath[i]];
  }

  return value;
}

/**
 * Use this function when need to add items to a list.
 * ```
 * form.insertListItem("filterProps.data", createFilterPropListItem(form, listInputs))
 * ```
 * @param form - form object from `@mantine/use-form`
 * @param listInput - the inputs for each item in a list eg. `{value: string, label: string}`
 * @returns object to append to the list.
 */
export function createFilterPropListItem(
  form: UseFormReturnType<FilterElement_V2_Props>,
  listInput: FilterConfigOptions
) {
  const type = form.values.type;
  if (type !== "CheckboxList") return map((v) => "", listInput);

  return {
    id: uuidv4(),
    fieldKey: "water",
    type: "Checkbox",
    comparisonOperator: "===",
    filterValue: false,
    filterProps: {
      label: "Water",
    },
    fallback: false,
    active: false,
  };
}

export function makeRoomForNewFilter(filterMap: FiltersMap, index: number) {
  Array.from(filterMap).forEach(([_, filter]) => {
    if (filter.position >= index) filter.position++;
  });
}

export function adjustForDeletedFilter(filterMap: FiltersMap, index: number) {
  Array.from(filterMap).forEach(([_, filter]) => {
    if (filter.position >= index) filter.position--;
  });
}

export function getFallbackValue(filter: FilterElement_V2_Props) {
  if (filter.type === "RangeSlider") {
    return [filter.filterProps.min, filter.filterProps.max];
  }
}

export function getFallbackValueSelection(filter: FilterElement_V2_Props) {
  if (filter.filterProps.data) {
    return filter.filterProps.data.map(
      ({ label, value }: { label: string; value: string }) => value
    );
  }
}

export function getOptionsForFieldKey(
  metadata: LocalMetadata,
  filter: FilterElement_V2_Props
) {
  const field = metadata.listings.fields.get(filter.fieldKey);

  if (!isNil(field) && field.options !== "None") {
    return concat(["ALL"], field.options);
  }

  return ["ALL"];
}

export function deserializeQueryParams(value: string | string[]) {
  let new_value: any = value;
  let comp_op: ComparisonOpType = "===";
  if (!isNaN(+value)) new_value = +value;
  if (value === "true") new_value = true;
  if (value === "false") new_value = false;
  if (Array.isArray(value)) {
    new_value = value.map((x) => +x);
    comp_op = "range";
  }
  if (typeof value === "string" && ["<", ">", "!", "="].includes((value as string).charAt(0))) {
    let operator = "";
    let numberString = "";
    for (const char of value) {
      if (isNaN(+char)) {
        operator += char;
      } else {
        numberString += char;
      }
    }
    (new_value = +numberString), (comp_op = operator as ComparisonOpType);
  }
  return { new_value, comp_op };
}

export function updateFallbackValues(filters: FilterElement_V2_Props[]) {
  for (const filter of filters) {
    if (filter.type === "RangeSlider") {
      filter.fallback = [filter.filterProps.min, filter.filterProps.max];
    }
  }
  return filters;
}
