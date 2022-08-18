import { useReducer, createContext, useEffect, Reducer, Dispatch } from "react";
import {
  QuerySnapshot,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { doc, getDoc, getDocs, collection, query } from "firebase/firestore";
import { db } from "../../../lib/firebase.config";
import { GetServerSideProps } from "next";

const MAP_INITIAL_ZOOM = 10;

/* =================
   TYPE DECLARATIONS
   ================= */

interface ListingsContextType {
  listingsState: ListingsState;
  dispatch: Dispatch<ListingsActions>;
}

type Props = {
  children: React.ReactElement;
  firebaseDocs: {
    id: string,
    data: DocumentData
  }[];
};

type ListingsState = {
  loading: boolean;
  firebaseDocs: {
    id: string,
    data: DocumentData
  }[];
  mapViewState: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  activeListing: DocumentData;
  filters: ComparisonFunctionItem[];
  /**ID of the listing */
  scrollToID: string;
};

type ListingsActions = {
  /**
   * INIT_LISTINGS -> Assumes it will get all the Firebase Documents as a payload. It pushes the document to listing state, sets loading to false, and gets the initial map view.
   *
   * GET_SINGLE_LISTING -> Assumes the payload contains an id. Sets active listing if it has changed.
   */
  type: "UPDATE_MAP" | "UPDATE_FILTER" | "REMOVE_FILTER" | "CLEAR_FILTERS" | "UPDATE_SCROLL_POSITION";
  payload: any;
};

type FilterType = "NativeSelect" | "RangleSlider" | "SegmentControl" | "CheckboxGroup" | "Checkbox" | "RadioButtonGroup";
export type ComparisonOpType = "===" | "!==" | ">=" | "<=" | ">" | "<" | "includes" | "range";
type ComparisonFunction = (e: any)=>boolean
type ComparisonFunctionItem = {
    name: string,
    test: ComparisonFunction
}

/* =================
   UTILITY FUNCTIONS
   ================= */



const fetchAllListings = async () => {
  const querySnapshot = await getDocs(collection(db, "listings"));
  return querySnapshot.docs;
};



const getAverageCoordinates = (
  firebaseDocs: {id: string, data: DocumentData}[]
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

/**
 * Checks whether filter exists in the array. If not, the filter gets added. If so, the filter gets replaced. You can also tell the function to remove the filter via options.
 * @param a - an array of FilterItems
 * @param filter - the filter to update
 * @param options - indicate if you want to remove the filter
 * @returns a new array of FilterItems
 */

const update = (a: ComparisonFunctionItem[], filter: ComparisonFunctionItem, options?: {remove: boolean}) => {
    a = [...a]
    const filterIndex = a.findIndex(e => e.name === filter.name);

    if (filterIndex === -1 && options?.remove === true) {
        return a
    }

    if (filterIndex === -1) {
        a.push(filter)
        return a
    }

    if (options?.remove === true) {
        a.splice(filterIndex, 1)
    }

    a[filterIndex] = filter;
    return a
}

/* =======
   CONTEXT
   ======= */

const ListingsContext = createContext<ListingsContextType>(
  {} as ListingsContextType
);

export const ListingsProvider = ({ children, firebaseDocs }: Props) => {
    const [latitude, longitude] = getAverageCoordinates(firebaseDocs)

  const initialState: ListingsState = {
    loading: false,
    firebaseDocs,
    mapViewState: {
      latitude,
      longitude,
      zoom: MAP_INITIAL_ZOOM,
    },
    activeListing: {} as QueryDocumentSnapshot<DocumentData>,
    filters: [],
    scrollToID: ""
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
            mapViewState: action.payload
        }
    case "UPDATE_FILTER":
        return {
            ...state,
            filters: update(state.filters, action.payload)
        }
    case "REMOVE_FILTER":
        return {
            ...state,
            filters: update(state.filters, action.payload, {remove: true})
        }
    case "UPDATE_SCROLL_POSITION":
        return {
            ...state,
            scrollToID: action.payload
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
export function createComparisonFunction (t: string, o: ComparisonOpType, v: string | number | number[]): ComparisonFunction {
    switch(o) {
        case "===":
            return (e: any) => e[t] === v;
        case "!==":
            return (e: any) => e[t] !== v;
        case ">=":
            return (e: any) => e[t] >= v;
        case "<=":
            return (e: any) => e[t] <= v;
        case ">":
            return (e: any) => e[t] > v;
        case "<":
            return (e: any) => e[t] < v;
        case "includes":
            return (e: any) => e[t].includes;
        case "range":
            if (Array.isArray(v)) {
                const [lo, hi] = v
                return (e: any) => e[t] >= lo && e[t] <= hi
            }
            console.log("The range filter needs to pass an array. You passed in: " + v)
        default:
            return (e: any) => true
    }
}
