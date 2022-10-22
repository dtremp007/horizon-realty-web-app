import { describe, expect, test, it } from "@jest/globals";
import { readFileSync } from "fs";
import path from "path";
import { curry } from "rambda";
import { getCompatibleFieldKeys } from "../../../../lib/util";
import { parseMetadata } from "../../../../pages/admin/filters";
import { parseFilters } from "../../../context/listingsContext/listingsContext";
import { applyFunction, createConfigOptions } from "./useFilterConfigOptions";

const localMetadata = parseMetadata(
  JSON.parse(
    readFileSync(path.join(process.cwd(), "lib", "metadata.json"), {
      encoding: "utf-8",
    })
  )
);

const filters = parseFilters(
  JSON.parse(
    readFileSync(path.join(process.cwd(), "lib", "filters.json"), {
      encoding: "utf8",
    })
  ).filters
);

const radioBtnConfigObj = {
  id: {
    type: "text",
    label: "Name",
  },
  legend: {
    type: "text",
    label: "Legend",
  },
  fieldKey: {
    data: ["listingType"],
    type: "select",
    label: "Compare Against...",
  },
  fallback: {
    type: "text",
    label: "Fallback",
  },
  filterProps: {
    type: "group",
    data: {
      type: "list",
      label: {
        type: "text",
      },
      value: {
        type: "text",
      },
    },
  },
};

const checklistConfigObj = {
  id: {
    type: "text",
    label: "Name",
  },
  legend: {
    type: "text",
    label: "Legend",
  },
  fieldKey: {
    type: "select",
    label: "Compare Against...",
    data: ["electricity", "water"],
  },
  fallback: {
    type: "text",
    label: "Fallback",
  },
  children: {
    type: "list",
    "filterProps.label": {
      type: "text",
    },
    fieldKey: {
      type: "text",
    },
  },
};

describe("@horizon-web-app/filter/useFilterConfigOptions", () => {
  it("can can create a filter config object", () => {
    const defaultOptions = localMetadata.filters.defaultOptions;
    const filterOptions =
      localMetadata.filters.ofType.get("RadioButtonGroup")!.options;

    const filterConfigOptions = createConfigOptions(
      defaultOptions,
      filterOptions,
      curry(applyFunction)(localMetadata, filters.get("listingType"))
    );

    expect(filterConfigOptions).toStrictEqual(radioBtnConfigObj);
  });

  it("can get compatible field keys", () => {

    expect(getCompatibleFieldKeys(localMetadata, "RadioButtonGroup")).toEqual(["listingType"])
    expect(getCompatibleFieldKeys(localMetadata, "RangeSlider")).toEqual(["bathrooms", "bedrooms", "houseSize", "landArea", "price"])
    expect(getCompatibleFieldKeys(localMetadata, "CheckboxList")).toEqual(["electricity", "water"])
    expect(getCompatibleFieldKeys(localMetadata, "SegmentedControl")).toEqual(["bathrooms", "bedrooms"])
  });
});
