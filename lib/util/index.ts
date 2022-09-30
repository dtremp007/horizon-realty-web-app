import { DocumentData } from "firebase/firestore";
import {
  ComparisonFunction,
  ComparisonFunctionItem,
  ComparisonOpType,
} from "../../src/context/listingsContext/listingsContext";
import { ListingsState } from "../../src/context/listingsContext/listingsContext";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.config";
import { EditFilterState, LocalMetadata, WebsiteMetadata } from "../../pages/admin/filters";
import { FilterElement, FilterElement_V2_Props } from "../interfaces/FilterTypes";
import { ListingFieldKey, ListingFieldOptions } from "../interfaces/Listings";
import { isEmpty, isNil, mergeDeepRight } from "rambda";
import { JSON_FilterProps } from "../interfaces/FilterTypes";

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

export async function createDummyUser() {
  try {
    await createUserWithEmailAndPassword(
      auth,
      process.env.DUMMY_USER as string,
      process.env.DUMMY_PASSWORD as string
    );
  } catch (error: any) {
    console.log(error.message);
  }
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
    while(true) {
        yield ++count;
    }
}

const count = countGenerator();

function generateFilterName(filterType: FilterElement) {
    return `${filterType}_${count.next().value}`
}

/**
 * Build a PublicFilterParameters object with the data passed in and filling in the rest.
 */
export function buildFilterParameters(
  metadata: LocalMetadata,
  userPreferences: any,
  sender: FilterElement
): FilterElement_V2_Props {
    const defaultParameters = {...metadata.filters.ofType.get(sender)?.defaultParameters};
    console.dir(defaultParameters)
    if (defaultParameters) {
        defaultParameters.name = generateFilterName(sender);
        defaultParameters.key = getCompatibleFieldKeys(metadata, sender)[0];
    } else {
        throw "Could not find specified filter type."
    }


    return mergeDeepRight(defaultParameters, userPreferences)
}


export function* increaseByGenerator(inc: number) {
    let count = 10;
    while(true) {
        yield count += inc;
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
