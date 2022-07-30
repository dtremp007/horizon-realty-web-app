import {
  NativeSelect,
  MultiSelect,
  RangeSlider,
  Space,
  SegmentedControl,
  Checkbox,
  CheckboxGroup,
  Button,
  ActionIcon
} from "@mantine/core";
import RadioButtonGroup from "./RadioButtonGroup";
import type {
  FilterParameter,
  RadioButtonGroupProps,
} from "../../../lib/interfaces/FilterTypes";
import { useRouter } from "next/router";

export default function FilterMenu() {
    const router = useRouter();

  const props = {
    label: (value: number) =>
      `\$${value.toLocaleString("en", { minimumFractionDigits: 2 })}`,
    min: 1000,
    max: 500000,
    step: 1000,
    labelAlwaysOn: true,
  };

  const radioButtonGroup: FilterParameter<RadioButtonGroupProps> = {
    filterName: "Listing Type",
    position: 2,
    hasLegend: true,
    filterType: "RadioButtonGroup",
    legendValue: "Choose Type of Listing",
    filterProps: {
      data: [
        { id: 1, label: "Any", value: "any" },
        { id: 2, label: "Homes", value: "homes" },
        { id: 3, label: "Farm Land", value: "farm-land" },
      ],
    },
  };
  return (
    <div className="filter-menu__container ">
        {router.pathname === "/filter" && <ActionIcon onClick={()=>router.back()} style={{alignSelf: "flex-start", margin: ".5rem 0 0 .5rem"}}>
        <svg
            style={{justifySelf: "flex-start"}}
            width={24}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 20"
          >
            <path
              className="back-icon--inverse"
              d="M1.5,10,10,18.5M1.5,10h21m-21,0L10,1.5"
            />
          </svg>
        </ActionIcon>}
      <form className="filter-menu__form flow-content">
        <Space />
        <fieldset>
            <legend>Choose a Location</legend>
          <NativeSelect
            placeholder="Choose a location"
            data={["Cuauhtemoc", "Oasis", "Casas Grandes"]}
            variant="filled"
            icon={
              <svg
                height={20}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 17.89 23"
              >
                <g>
                  <path
                    className="listing-card__location-icon"
                    d="M8.94,23a38.85,38.85,0,0,1-4.47-4.51C2.43,16.05,0,12.41,0,9A8.95,8.95,0,0,1,10.69.17,8.94,8.94,0,0,1,17.89,9c0,3.46-2.43,7.1-4.48,9.54A38.07,38.07,0,0,1,8.94,23Zm0-17.89a3.86,3.86,0,1,0,2.71,1.13A3.85,3.85,0,0,0,8.94,5.11Z"
                  />
                </g>
              </svg>
            }
          />
        </fieldset>

        <RadioButtonGroup {...radioButtonGroup} />

        <fieldset style={{display: "block", paddingTop: "2rem"}}>
            <legend>Price Range</legend>
            <RangeSlider {...props} />
        </fieldset>

        <fieldset style={{ gap: "1rem" }}>
          <svg
            width={28}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 22 23"
          >
            <g style={{ fill: "#fff" }}>
              <path d="M.09,19.12S-.79,23,2.88,23H19.72s2.49-.23,2.27-3.2-1-10-1-10a2.29,2.29,0,0,0-2.41-2.21H3.14A2.14,2.14,0,0,0,1,9.83C.83,12.11.09,19.12.09,19.12Z" />
              <path d="M2.05,1.29l-.2,2.82A1.18,1.18,0,0,0,3.1,5.64h5s2,0,2-1.6V1.14S10.13,0,8.44,0H3.64S2.11-.09,2.05,1.29Z" />
              <path d="M19.88,1.29l.2,2.82a1.18,1.18,0,0,1-1.25,1.53H13.88s-2,0-2-1.6V1.14S11.81,0,13.49,0h4.8S19.82-.09,19.88,1.29Z" />
            </g>
          </svg>

          <SegmentedControl
            data={[
              { label: "1", value: "1" },
              { label: "2", value: "2" },
              { label: "3", value: "3" },
              { label: "4+", value: "4" },
              { label: "any", value: "any" },
            ]}
            fullWidth
            radius="md"
            size="md"
            color="blue"
          />
        </fieldset>

        <fieldset style={{ gap: "1rem" }}>
          <svg
            width={28}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100.07 99"
          >
            <g style={{ fill: "#fff" }}>
              <path d="M100.07,51.37v6.24H95c-.7,17.58-9.52,25.12-17.67,28.32l6.28,9.28L78.49,98.7,71,87.7a32.57,32.57,0,0,1-7.66.5s0,.59-30.12,0a37.84,37.84,0,0,1-4.69-.39L21,99l-5.16-3.5,6.34-9.37C7.69,80.42,5.26,64.41,4.9,57.61H0V51.37H4.75V12.47A12.47,12.47,0,0,1,29.16,8.86a14.06,14.06,0,0,1,1.72-.1A14.4,14.4,0,0,1,44.94,20L19.43,31.9a14.38,14.38,0,0,1-2.84-7,14.76,14.76,0,0,1-.11-1.77A14.34,14.34,0,0,1,17.09,19a14.49,14.49,0,0,1,6.44-8.23,6.53,6.53,0,0,0-12.84,1.7v38.9Z" />
            </g>
          </svg>

          <SegmentedControl
            data={[
              { label: "1", value: "1" },
              { label: "2", value: "2" },
              { label: "3", value: "3" },
              { label: "4+", value: "4" },
              { label: "any", value: "any" },
            ]}
            fullWidth
            radius="md"
            size="md"
            color="blue"
          />
        </fieldset>

        <h3>Features</h3>
        <CheckboxGroup orientation="vertical" size="md">
          <Checkbox value="trees" label="Trees" />
          <Checkbox value="svelte" label="Lawn" />
          <Checkbox value="ng" label="Fence" />
          <Checkbox value="vue" label="Garage" />
        </CheckboxGroup>
        <Button onClick={() => router.push("/listings")}>Apply Filters</Button>
        <Space/>
      </form>
    </div>
  );
}
