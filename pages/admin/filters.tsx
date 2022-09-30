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
  buildFilterParameters,
  increaseByGenerator,
} from "../../lib/util";
import {
  FilterElement,
  FilterCreateOptions,
  JSON_FilterProps,
  FilterConfigurationOptions,
  FilterElement_V2_Props,
} from "../../lib/interfaces/FilterTypes";
import {
  createContext,
  Dispatch,
  Reducer,
  useContext,
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
import { DocumentData } from "firebase/firestore";
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
} from "rambda";
import FilterBuilder from "../../src/components/admin/filters/FilterBuilder";

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
    | "FILTER_TO_EDIT_MODE";
  payload?: any;
};

export type WebsiteMetadata = {
  listings: {
    fields: {
      [Property in ListingFieldKey]: ListingFieldOptions;
    };
  };
  filters: {
    defaultOptions: FilterConfigurationOptions;
    ofType: {
      [Property in FilterElement]: FilterCreateOptions;
    };
  };
};

export type EditFilterState = {
  savedFilters: Map<string, FilterElement_V2_Props>;
  isModalOpen: boolean;
  filterBeingEdited: string | null;
};

type EditFilterContextType = {
  state: EditFilterState;
  dispatch: Dispatch<EditFilterActions>;
  metadata: LocalMetadata;
};

export const EditFilterContext = createContext<EditFilterContextType>(
  {} as EditFilterContextType
);

const AdminFilters: NextPage<AdminFilterProps> = ({
  filters,
  metadata: metadata_from_json,
}) => {
  const initialState: EditFilterState = {
    savedFilters: parseFilters(filters),
    isModalOpen: false,
    filterBeingEdited: null,
  };

  const metadata = useMemo(parseMetadata.bind(null, metadata_from_json), []);

  const [state, dispatch] = useReducer(editFiltersReducer, initialState);

  return (
    <EditFilterContext.Provider value={{ state, dispatch, metadata }}>
      <SimpleGrid cols={2}>
        <FilterPreview />
        {!isNil(state.filterBeingEdited) && <FilterBuilder />}
      </SimpleGrid>
    </EditFilterContext.Provider>
  );
};
export default AdminFilters;

export const getServerSideProps: GetServerSideProps = async () => {
  const filtersFile = path.join(process.cwd(), "lib", "filters.json");
  const metadataFile = path.join(process.cwd(), "lib", "metadata.json");
  const filters = JSON.parse(
    readFileSync(filtersFile, { encoding: "utf8" }) // I removed .toString(), I'm not sure why it was here. I don't think it's necessary.
  ).filters;
  const metadata = JSON.parse(readFileSync(metadataFile, { encoding: "utf8" }));

  return {
    props: {
      filters,
      metadata,
    },
  };
};

export type LocalMetadata = {
  listings: {
    fields: Map<ListingFieldKey, ListingFieldOptions>;
  };
  filters: {
    defaultOptions: Map<string, FilterConfigurationOptions>;
    ofType: Map<FilterElement, FilterCreateOptions>;
  };
};

function parseMetadata(metadata: WebsiteMetadata): LocalMetadata {
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
        // @ts-ignore
      defaultOptions: new Map(Object.entries(metadata.filters.defaultOptions)),
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
      const filterId = action.payload.id;
      return {
        ...state,
        filters: state.savedFilters.set(
          filterId,
          mergeAll([state.savedFilters.get(filterId), action.payload])
        ),
      };
    case "FILTER_TO_EDIT_MODE":
      return {
        ...state,
        filterBeingEdited: action.payload,
      };
    default:
      return state;
  }
};
