import {
  NativeSelect,
  MultiSelect,
  RangeSlider,
  Space,
  SegmentedControl,
  Checkbox,
  CheckboxGroup,
  Button,
  ActionIcon,
} from "@mantine/core";
import RadioButtonGroup from "./RadioButtonGroup";
import type {
  FilterParameter,
  RadioButtonGroupProps,
} from "../../../lib/interfaces/FilterTypes";
import { useRouter } from "next/router";
import { FilterItem } from "./FilterItem";

const filters: FilterParameter[] = [
    {
      filterName: "location",
      filterDescription: "",
      filterType: "NativeSelect",
      layout: "",
      hasLegend: true,
      legendValue: "Choose a location:",
      filterProps: {
        data: ["All","Cuauhtemoc", "Chihuahua"],
      },
      position: 1,
      target: "location",
      fallback: "All",
    },
    {
      filterName: "listingType",
      filterDescription: "",
      filterType: "RadioButtonGroup",
      layout: "",
      hasLegend: true,
      legendValue: "Listing Type",
      filterProps: {
        data: [
          { id: 1, label: "Any", value: "any" },
          { id: 2, label: "Homes", value: "homes" },
          { id: 3, label: "Farm Land", value: "farm-land" },
        ],
      },
      position: 2,
      style: {
        flexFlow: "row wrap",
        justifyContent: "center",
        columnGap: ".75rem",
        rowGap: ".25rem",
        paddingLeft: "0",
        paddingRight: "0"
      },
      target: "listingType",
      fallback: "any",
    },
    {
      filterName: "priceRange",
      filterDescription: "",
      filterType: "RangeSlider",
      layout: "",
      hasLegend: true,
      legendValue: "Price Range",
      filterProps: {
          label: (value: number) => {
            return `\$${value.toLocaleString("en")}`;
          },
        // label: [
        //   "value",
        //   "return '$' + value.toLocaleString('en')}",
        // ],
        min: 0,
        max: 500000,
        step: 1000,
        labelAlwaysOn: true,
      },
      position: 3,
      style: {
        display: "block",
        paddingTop: "2rem"
      },
      target: "price",
      fallback: [0, 500000]
    },
    {
      filterName: "bedrooms",
      filterDescription: "",
      filterType: "SegmentControl",
      layout: "",
      hasLegend: false,
      legendValue: "",
      filterProps: {
        data: [
          { label: "1", value: 1 },
          { label: "2", value: 2 },
          { label: "3", value: 3 },
          { label: "4+", value: 4 },
          { label: "any", value: "any" },
        ],
        variant: "bedrooms",
      },
      position: 4,
      target: "bedrooms",
      fallback: "any"
    },
    {
      filterName: "utilities",
      filterDescription: "",
      filterType: "CheckboxGroup",
      layout: "",
      hasLegend: true,
      legendValue: "Utilities",
      filterProps: {
        data: [
          { label: "Gas", value: "gas" },
          { label: "Water", value: "water" },
          { label: "Electricity", value: "electricity" },
        ],
      },
      position: 5,
      target: "utilities",
      fallback: [],
    },
  ];

export default function FilterMenu() {
  const router = useRouter();

  return (
    <div className="filter-menu__container ">
      {router.pathname === "/filter" && (
        <ActionIcon
          onClick={() => router.back()}
          style={{ alignSelf: "flex-start", margin: ".5rem 0 0 .5rem" }}
        >
          <svg
            style={{ justifySelf: "flex-start" }}
            width={24}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 20"
          >
            <path
              className="back-icon--inverse"
              d="M1.5,10,10,18.5M1.5,10h21m-21,0L10,1.5"
            />
          </svg>
        </ActionIcon>
      )}
      <form className="filter-menu__form flow-content">
        <Space />
        {filters.map(filter => (
            <FilterItem key={filter.position} {...filter} />
        ))}
        <Button onClick={() => router.push("/listings")}>Apply Filters</Button>
        <Space />
      </form>
    </div>
  );
}
