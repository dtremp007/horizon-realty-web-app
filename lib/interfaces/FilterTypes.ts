import type {
  NativeSelectProps,
  RangeSliderProps,
  SegmentedControlProps,
  CheckboxGroupProps,
  CheckboxProps,
} from "@mantine/core";
import { CSSProperties } from "react";

export interface FilterParameter {
  filterName: string;
  filterDescription?: string;
  filterType:
    | "NativeSelect"
    | "RangeSlider"
    | "SegmentControl"
    | "CheckboxGroup"
    | "RadioButtonGroup";
  layout?: string;
  hasLegend: boolean;
  legendValue: string;
  filterProps: {
    [key: string]: any;
  };
  position: number;
  style?: CSSProperties;
  target: string | string[];
  fallback?: any;
}

export interface RadioButtonGroupProps {
  data: { id: number; value: string; label: string }[];
}
