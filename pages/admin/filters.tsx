import { NextPage, GetServerSideProps } from "next";
import path from "path";
import { readFileSync } from "fs";
import {
  Space,
  Button,
  SimpleGrid,
  TextInput,
  Select,
  ActionIcon,
  Menu,
  Modal,
  Group,
} from "@mantine/core";
import {
  FilterElement,
  FilterCreateOptions,
  JSON_FilterProps,
  FilterConfigInputProps,
  FilterElement_V2_Props,
  FilterConfigOptions,
} from "../../lib/interfaces/FilterTypes";
import {
  createContext,
  Dispatch,
  Reducer,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import {
  ListingSchema,
  ListingFieldKey,
  FirestoreDataTypes,
  ListingFieldOptions,
} from "../../lib/interfaces/Listings";
import { DocumentData, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { IconCirclePlus } from "@tabler/icons";
import { parseFilters } from "../../src/context/listingsContext/listingsContext";
import FilterPreview from "../../src/components/admin/filters/FilterPreview";
import R, {
  any,
  curry,
  equals,
  isNil,
  lensProp,
  mergeLeft,
  pipe,
  view,
  map,
  when,
  has,
  mergeAll,
  isEmpty,
  concat,
  reduce,
  tail,
} from "rambda";
import FilterBuilder from "../../src/components/admin/filters/FilterBuilder";
import FilterBuffet from "../../src/components/admin/filters/FilterBuffet";
import { updateFallbackValues } from "../../lib/util";
import {
  doc,
  collection,
  addDoc,
  updateDoc,
  Timestamp,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase.config";
import { nextTick } from "process";

type AdminFilterProps = {
  filters: FilterElement_V2_Props[];
  metadata: WebsiteMetadata;
};

export type EditFilterActions = {
  type:
    | "CREATE_FILTER"
    | "UPDATE_FILTER"
    | "DELETE_FILTER"
    | "OPEN_MODAL"
    | "CLOSE_MODAL"
    | "FILTER_TO_EDIT_MODE"
    | "ADD_FILTER"
    | "TO_FILTER_CREATION_MODE"
    | "UPDATE_FILTER_SAVED_STATUS"
    | "DELETE_FILTER"
    | "SET_ALL_FILTERS";
  payload?: any;
};

export type WebsiteMetadata = {
  listings: {
    fields: {
      [Property in ListingFieldKey]: ListingFieldOptions;
    };
  };
  filters: {
    defaultOptions: { [key: string]: FilterConfigInputProps };
    defaultParameters: FilterElement_V2_Props;
    ofType: {
      [Property in FilterElement]: FilterCreateOptions;
    };
  };
};

export type EditFilterState = {
  savedFilters: Map<string, FilterElement_V2_Props>;
  isModalOpen: boolean;
  filterBeingEdited: string | null;
  filterCreationMode: boolean;
  filterSaved: boolean;
  positionOfNextFilter: number;
};

type EditFilterContextType = {
  state: EditFilterState;
  dispatch: Dispatch<EditFilterActions>;
  metadata: LocalMetadata;
  saveFilters: () => void;
  deleteFilter: (id: string) => void;
};

export const EditFilterContext = createContext<EditFilterContextType>(
  {} as EditFilterContextType
);

const AdminFilters: NextPage<AdminFilterProps> = ({
  filters,
  metadata: metadata_from_json,
}) => {
  const initialState: EditFilterState = {
    savedFilters: filters.length > 0 ? parseFilters(filters) : new Map(),
    isModalOpen: false,
    filterBeingEdited: null,
    filterCreationMode: false,
    filterSaved: true,
    positionOfNextFilter: filters.length + 1,
  };

  const metadata = useMemo(parseMetadata.bind(null, metadata_from_json), []);

  const [state, dispatch] = useReducer(editFiltersReducer, initialState);

  const resetFilters = () => {
    const getFilterBackup = async () => {
      return await fetch("/api/filter-backup");
    };

    getFilterBackup()
      .then((res) => res.json())
      .then((filters) => {
        dispatch({ type: "SET_ALL_FILTERS", payload: filters });
      });
  };

  const saveFilters = async () => {
    const filters = transformFilters(state.savedFilters, [
      updateFallbackValues,
    ]);

    for (const filter of filters) {
      setDoc(doc(db, "filters", filter.id), filter);
    }

    dispatch({ type: "UPDATE_FILTER_SAVED_STATUS", payload: true });
  };

  const deleteFilter = async (id: string) => {
    await deleteDoc(doc(db, "filters", id));

    dispatch({ type: "DELETE_FILTER", payload: id });
  };

  return (
    <EditFilterContext.Provider
      value={{ state, dispatch, metadata, saveFilters, deleteFilter }}
    >
      <SimpleGrid cols={2}>
        <FilterPreview />
        {!isNil(state.filterBeingEdited) && (
          <FilterBuilder key={state.filterBeingEdited} />
        )}
        {state.filterCreationMode && <FilterBuffet />}
      </SimpleGrid>
    </EditFilterContext.Provider>
  );
};
export default AdminFilters;

export type LocalMetadata = {
  listings: {
    fields: Map<ListingFieldKey, ListingFieldOptions>;
  };
  filters: {
    defaultOptions: FilterConfigOptions;
    defaultParameters: FilterElement_V2_Props;
    ofType: Map<FilterElement, FilterCreateOptions>;
  };
};

export function parseMetadata(metadata: WebsiteMetadata): LocalMetadata {
  return {
    listings: {
      fields: new Map(
        Object.entries(metadata.listings.fields) as [
          ListingFieldKey,
          ListingFieldOptions
        ][]
      ),
    },
    filters: {
      defaultOptions: metadata.filters.defaultOptions,
      defaultParameters: metadata.filters.defaultParameters,
      ofType: new Map(
        Object.entries(metadata.filters.ofType) as [
          FilterElement,
          FilterCreateOptions
        ][]
      ),
    },
  };
}

const editFiltersReducer: Reducer<EditFilterState, EditFilterActions> = (
  state,
  action
) => {
  switch (action.type) {
    case "OPEN_MODAL":
      return {
        ...state,
        isModalOpen: true,
        modalOpenedAt: action.payload.modalOpenedAt,
      };
    case "CLOSE_MODAL":
      return {
        ...state,
        isModalOpen: false,
        modalOpenedAt: null,
      };
    case "UPDATE_FILTER":
      return {
        ...state,
        filters: state.savedFilters.set(
          state.filterBeingEdited!,
          mergeAll([
            state.savedFilters.get(state.filterBeingEdited!),
            action.payload,
          ])
        ),
      };
    case "FILTER_TO_EDIT_MODE":
      return {
        ...state,
        filterCreationMode: false,
        filterBeingEdited: action.payload,
      };
    case "ADD_FILTER":
      return {
        ...state,
        filterCreationMode: false,
        filterSaved: false,
        filterBeingEdited: action.payload.id,
        savedFilters: state.savedFilters.set(
          action.payload.id,
          action.payload.filter
        ),
      };
    case "TO_FILTER_CREATION_MODE":
      return {
        ...state,
        filterCreationMode: true,
        filterBeingEdited: null,
        positionOfNextFilter: action.payload,
      };
    case "UPDATE_FILTER_SAVED_STATUS":
      return {
        ...state,
        filterSaved: action.payload,
      };
    case "DELETE_FILTER":
      state.savedFilters.delete(action.payload);
      return {
        ...state,
        filterBeingEdited:
          state.filterBeingEdited === action.payload
            ? null
            : state.filterBeingEdited,
        filterSaved: true,
      };
    case "SET_ALL_FILTERS":
      return {
        ...state,
        savedFilters: parseFilters(action.payload),
      };
    default:
      return state;
  }
};

type FilterTransformer = (
  f: FilterElement_V2_Props[]
) => FilterElement_V2_Props[];

function transformFilters(
  filters: Map<string, FilterElement_V2_Props>,
  transformers: FilterTransformer[]
) {
  transformers.push((f: FilterElement_V2_Props[]) =>
    f.sort((a, b) => a.position - b.position)
  );
  const transform = pipe.apply(null, transformers as any) as (
    f: any
  ) => FilterElement_V2_Props[];


  return transform(Array.from(filters).map(([key, filter]) => filter));
}

export const getServerSideProps: GetServerSideProps = async () => {
  const metadataFile = path.join(process.cwd(), "lib", "metadata.json");
  const metadata = JSON.parse(readFileSync(metadataFile, { encoding: "utf8" }));
    const filtersFile = path.join(process.cwd(), "lib", "filters.json");
    const filters = JSON.parse(
      readFileSync(filtersFile, { encoding: "utf8" }) // I removed .toString(), I'm not sure why it was here. I don't think it's necessary.
    ).filters;
    // const querySnapshot = await getDocs(collection(db, "filters"));
    // const filters = querySnapshot.docs.map((filter) => {
    //   return filter.data();
    // });

  return {
    props: {
      filters,
      metadata,
    },
  };
};
