import type { NativeSelectProps, RangeSliderProps, SegmentedControlProps, CheckboxGroupProps, CheckboxProps } from "@mantine/core";

export interface FilterParameter<T> {
    filterName: string;
    filterDescription?: string;
    filterType: "NativeSelect" | "RangleSlider" | "SegmentControl" | "CheckboxGroup" | "Checkbox" | "RadioButtonGroup";
    layout?: string;
    hasLegend: boolean;
    legendValue: string;
    filterProps: T;
    position: number;
    children?: FilterParameter<T>[]
}

export interface RadioButtonGroupProps {
    data: {id: number; value: string; label: string }[];
  }
