import { useReducer, createContext, useEffect, Reducer, Dispatch } from "react";
import { ListingSchema } from "../../../lib/interfaces/Listings";
import {
  FilterElement_V2_Props,
} from "../../../lib/interfaces/FilterTypes";
import {
  createListingEntryStringifyFunction,
  queryParamsToFilterValues,
  stringifyComparisonFunction,
  updateMultipleFilters,
} from "../../../lib/util";
import { isEmpty, mergeAll } from "rambda";

const MAP_INITIAL_ZOOM = 10;

/* =================
   TYPE DECLARATIONS
   ================= */

export interface ListingsContextType {
  listingsState: ListingsState;
  dispatch: Dispatch<ListingsActions>;
}

type Props = {
  children: React.ReactElement;
  firebaseDocs: {
    id: string;
    data: ListingSchema;
  }[];
  filters: FilterElement_V2_Props[];
};

export type ListingsState = {
  loading: boolean;
  snapshot: {
    id: string;
    data: ListingSchema;
  }[];
  firebaseDocs: {
    id: string;
    data: ListingSchema;
  }[];
  mapViewState: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  filters: FiltersMap;
  /**ID of the listing */
  scrollToID: string;
  mapFocusPoint: {
    sender: "carousel" | "map" | "";
    id: string;
    index: number;
  };
  filterLog: FilterLog[];
  activeFiltersCount: number;
};

export type FiltersMap<> = Map<string, FilterElement_V2_Props<any, any>>;

export type FilterLog = {
  filterTitle: string;
  stringifiedFunction: string;
  entries: {
    listingTitle: string;
    key: keyof ListingSchema;
    value: ListingSchema[keyof ListingSchema];
    didPass: boolean;
    stringify: () => string;
  }[];
  append: (listing: ListingSchema, didPass: boolean) => void;
};

type ListingsActions = {
  /**
   * INIT_LISTINGS -> Assumes it will get all the Firebase Documents as a payload. It pushes the document to listing state, sets loading to false, and gets the initial map view.
   *
   * GET_SINGLE_LISTING -> Assumes the payload contains an id. Sets active listing if it has changed.
   */
  type:
    | "UPDATE_MAP"
    | "UPDATE_FILTER"
    | "REMOVE_FILTER"
    | "CLEAR_FILTERS"
    | "UPDATE_SCROLL_POSITION"
    | "UPDATE_MAP_FOCUS_POINT"
    | "FILTER"
    | "GET_ALL"
    | "APPLY_FILTERS"
    | "UPDATE_AND_APPLY_MULTIPLE_FILTER";
  payload?: any;
};

export type ComparisonOpType =
  | "==="
  | "!=="
  | ">="
  | "<="
  | ">"
  | "<"
  | "includes"
  | "range";
export type ComparisonFunction = (e: ListingSchema) => boolean;
export type ComparisonFunctionItem = {
  test: ComparisonFunction;
  snapshot: string; // This is for debugging purposes.
};

/* =================
   UTILITY FUNCTIONS
   ================= */

const getAverageCoordinates = (
  firebaseDocs: { id: string; data: ListingSchema }[]
): [number, number] => {
  return firebaseDocs
    .map((listing) => listing.data.coordinates)
    .reduce(
      (prev, current, index) => {
        if (index === 0) {
          return [current[0], current[1]];
        }

        return [(prev[0] + current[0]) / 2, (prev[1] + current[1]) / 2];
      },
      [0, 0]
    );
};

export function parseFilters(
  unparsedFilters: FilterElement_V2_Props[]
): FiltersMap {
  return new Map(unparsedFilters.sort((a, b) => a.position - b.position).map(filter => [filter.id, filter]));
}

/**
 * Checks whether filter exists in the array. If not, the filter gets added. If so, the filter gets replaced. You can also tell the function to remove the filter via options.
 * @param map - an array of FilterItems
 * @param filter - the filter to update
 * @param options - indicate if you want to remove the filter
 * @returns a new array of FilterItems
 */

/* =======
   CONTEXT
   ======= */

const ListingsContext = createContext<ListingsContextType>(
  {} as ListingsContextType
);

export const ListingsProvider = ({
  children,
  firebaseDocs,
  filters,
}: Props) => {
  const [latitude, longitude] = firebaseDocs[0].data.coordinates;

  const firebaseDocsImagesOnly = firebaseDocs.filter(listing => listing.data.imageUrls.length > 0)

  const initialState: ListingsState = {
    loading: false,
    snapshot: [...firebaseDocsImagesOnly],
    firebaseDocs: firebaseDocsImagesOnly,
    mapViewState: {
      latitude,
      longitude,
      zoom: MAP_INITIAL_ZOOM,
    },
    filters: parseFilters(filters),
    scrollToID: "",
    mapFocusPoint: {
      sender: "",
      id: firebaseDocs[0].id,
      index: 0,
    },
    filterLog: [],
    activeFiltersCount: 0,
  };

  const [listingsState, dispatch] = useReducer(listingReducer, initialState);

  return (
    <ListingsContext.Provider value={{ listingsState, dispatch }}>
      {children}
    </ListingsContext.Provider>
  );
};

/* =======
   REDUCER
   ======= */

const listingReducer: Reducer<ListingsState, ListingsActions> = (
  state,
  action
): ListingsState => {
  switch (action.type) {
    case "UPDATE_MAP":
      return {
        ...state,
        mapViewState: action.payload,
      };
    case "UPDATE_SCROLL_POSITION":
      return {
        ...state,
        scrollToID: action.payload,
      };
    case "UPDATE_MAP_FOCUS_POINT":
      let id;
      let index;

      if (action.payload.sender === "map" && action.payload.id) {
        id = action.payload.id;
        index = state.firebaseDocs.findIndex((e) => e.id === action.payload.id);
      }

      if (
        action.payload.sender === "carousel" &&
        typeof action.payload.index !== "undefined"
      ) {
        id = state.firebaseDocs[action.payload.index].id;
        index = action.payload.index;
      }

      return {
        ...state,
        mapFocusPoint: {
          sender: action.payload.sender,
          id: id || "",
          index: index || 0,
        },
      };
    case "FILTER":
      return {
        ...state,
        firebaseDocs: state.snapshot.filter(
          (e) => e.data.listingType === action.payload
        ),
      };
    case "GET_ALL":
      return {
        ...state,
        firebaseDocs: [...state.snapshot],
      };
    case "APPLY_FILTERS":
      return {
        ...state,
        firebaseDocs: applyFilters(
          [...state.snapshot],
          state.filters,
          state.filterLog
        ),
      };
    case "UPDATE_FILTER":
      const filterId = action.payload.id;
      return {
        ...state,
        filters: state.filters.set(
          filterId,
          mergeAll([state.filters.get(filterId), action.payload])
        ),
      };
    case "UPDATE_AND_APPLY_MULTIPLE_FILTER":
      return {
        ...state,
        activeFiltersCount: [...state.filters].reduce((acc, curr) => curr[1].active ? (acc + 1) : (acc + 0), 0),
        filters: queryParamsToFilterValues(state.filters, action.payload),
        firebaseDocs: applyFilters(
          [...state.snapshot],
          state.filters,
          state.filterLog
        ),
      }
    default:
      return state;
  }
};

export default ListingsContext;

/**
 * This function takes a key, comparison operator, and a value to compare against.
 * Is is very easy to extend this to include many more operators. Think about adding
 * Regex in the future.
 * @param t - the key of the field to compare against
 * @param o - basic Javascript operators
 * @param v - value that is being compared against
 * @returns a function that takes an object and compares one of it's fields.
 */
export function createComparisonFunction(
  t: keyof ListingSchema,
  o: ComparisonOpType,
  v: string | number | number[]
): ComparisonFunction {
  switch (o) {
    case "===":
      return (e) => e[t] === v;
    case "!==":
      return (e) => e[t] !== v;
    case ">=":
      return (e) => e[t] >= v;
    case "<=":
      return (e) => e[t] <= v;
    case ">":
      return (e) => e[t] > v;
    case "<":
      return (e) => e[t] < v;
    case "includes":
      return (e) => (e[t] as any[]).includes(v);
    case "range":
      if (Array.isArray(v)) {
        const [lo, hi] = v;
        return (e) => e[t] >= lo && e[t] <= hi;
      }
      console.log(
        "The range filter needs to pass an array. You passed in: " + v
      );
    default:
      return (e) => true;
  }
}

function applyFilters(
  firebaseDocs: ListingsState["firebaseDocs"],
  filters: FiltersMap,
  filterLog: FilterLog[]
) {
  const iterator = filters.values();

  return recursiveFilter(iterator, firebaseDocs, startLog(filterLog));
}

function recursiveFilter(
  iterator: IterableIterator<FilterElement_V2_Props>,
  firebaseDocs: ListingsState["firebaseDocs"],
  logger: Logger
): ListingsState["firebaseDocs"] {
  const result = iterator.next();
  if (result.done) {
    return firebaseDocs;
  }
  if (result.value.active) {
    const testAndLog = initiateFilter(result.value, logger); // result.value returns FilterItem
    return recursiveFilter(
      iterator,
      firebaseDocs.filter((e) => testAndLog(e.data)),
      logger
    );
  } else {
    return recursiveFilter(iterator, firebaseDocs, logger);
  }
}

function initiateFilter(filter: FilterElement_V2_Props, logger: Logger) {
  const { type, fieldKey, comparisonOperator, filterValue, children } = filter;

  if (type === "CheckboxList" && children) {
    return initiateChecklistFilter(children, logger);
  }

  if (type === "CheckboxList" && isEmpty(children)) {
    return (listing: ListingSchema) => true;
  }

  const log = logger(filter);

  return (listing: ListingSchema) => {
    const didPass = createComparisonFunction(
      fieldKey,
      comparisonOperator,
      filterValue
    )(listing);

    log.append(listing, didPass);

    return didPass;
  };
}

function initiateChecklistFilter(
  filters: FilterElement_V2_Props[],
  logger: Logger
) {
  const arrayOfFilters: ((listing: ListingSchema) => boolean)[] = [];

  for (const filter of filters) {
    if (filter.active) {
      const testAndLog = initiateFilter(filter, logger);
      arrayOfFilters.push((listing: ListingSchema) => {
        return testAndLog(listing);
      });
    }
  }

  return (listing: ListingSchema) => {
    if (arrayOfFilters.length === 0)
      console.log(
        "initiateChecklistFilter() is returning a function that trying to iterate over an empty array."
      );
    for (let i = 0; i < arrayOfFilters.length; i++) {
      const result = arrayOfFilters[i](listing);

      // Is this the last iteration or did the listing just fail a test?
      if (i === arrayOfFilters.length - 1 || !result) return result;
    }
    console.log(
      "For loop in initiateChecklistFilter didn't return anything. 🧐"
    );
    return true; // Just to keep typescript happy
  };
}

type Logger = (filter: FilterElement_V2_Props) => FilterLog;

function startLog(filterLog: FilterLog[]): Logger {
  filterLog.splice(0, filterLog.length);

  return ({
    id,
    fieldKey,
    comparisonOperator,
    filterValue,
  }: FilterElement_V2_Props) => {
    const newFilterLog: FilterLog = {
      filterTitle: id,
      stringifiedFunction: stringifyComparisonFunction(
        id,
        fieldKey,
        comparisonOperator,
        filterValue
      ),
      entries: [],
      append: function (listing, didPass) {
        this.entries.push({
          listingTitle: listing.title,
          key: fieldKey,
          value: listing[fieldKey],
          didPass,
          stringify: createListingEntryStringifyFunction(
            listing.title,
            fieldKey,
            listing[fieldKey],
            didPass
          ),
        });
      },
    };
    filterLog.push(newFilterLog);

    return newFilterLog;
  };
}
