import { useReducer, createContext, useEffect, Reducer, Dispatch } from "react";
import {
  QuerySnapshot,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { doc, getDoc, getDocs, collection, query } from "firebase/firestore";
import { db } from "../../../lib/firebase.config";
import { GetServerSideProps } from "next";

const MAP_INITIAL_ZOOM = 14;

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
};

type ListingsActions = {
  /**
   * INIT_LISTINGS -> Assumes it will get all the Firebase Documents as a payload. It pushes the document to listing state, sets loading to false, and gets the initial map view.
   *
   * GET_SINGLE_LISTING -> Assumes the payload contains an id. Sets active listing if it has changed.
   */
  type: "UPDATE_MAP";
  payload: any;
};

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
    default:
      return state;
  }
};

export default ListingsContext;
