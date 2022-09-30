import type {
  NativeSelectProps,
  RangeSliderProps,
  SegmentedControlProps,
  CheckboxGroupProps,
  CheckboxProps,
} from "@mantine/core";
import { ChangeEvent, CSSProperties } from "react";
import { ComparisonOpType } from "../../src/context/listingsContext/listingsContext";
import { FirestoreDataTypes, ListingFieldKey, ListingSchema } from "./Listings";

export type FilterElement =
  | "NativeSelect"
  | "RangeSlider"
  | "SegmentedControl"
  | "Checkbox"
  | "RadioButtonGroup"
  | "CheckboxList";

export interface FilterParameter {
  filterName: string;
  filterDescription?: string;
  filterType:
    | "NativeSelect"
    | "RangeSlider"
    | "SegmentControl"
    | "CheckboxGroup"
    | "RadioButtonGroup"
    | "Checkbox";
  layout?: string;
  hasLegend: boolean;
  legendValue: string;
  filterProps: {
    [key: string]: any;
  };
  position: number;
  style?: CSSProperties;
  target: keyof ListingSchema;
  fallback?: any;
}

export type JSON_FilterProps = Omit<
  FilterElement_V2_Props<any, any>,
  "handleOnChange"
>;

export type FilterCreateOptions = {
  useWith: {
    type: FirestoreDataTypes | FirestoreDataTypes[];
    exclude?: ListingFieldKey | ListingFieldKey[];
    include?: ListingFieldKey | ListingFieldKey[];
  };
  defaultParameters: {
    key: ListingFieldKey;
    name: string;
    fallback: any;
    filterProps: Object;
    label?: any;
  };
  options: FilterConfigurationOptions
};

export type FilterConfigurationOptions = {
            type: "text" | "number" | "select" | "checkbox";
            required: boolean;
            label: string;
}

export type FilterElement_V2_Props<T = any, E = (e: ChangeEvent) => void> = {
  id: string;
  fieldKey: ListingFieldKey;
  type: FilterElement;
  comparisonOperator: ComparisonOpType;
  filterValue: any;
  filterProps: T;
  fallback: any;
  legend?: string;
  fieldsetStyle?: CSSProperties;
  active: boolean;
  position: number;
  handleOnChange?: E;
  children?: FilterElement_V2_Props<T, E>[];
};
