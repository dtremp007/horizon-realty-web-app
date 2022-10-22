import { Button, Card, Group, ScrollArea, Space } from "@mantine/core";
import { lensProp, mergeRight, set } from "rambda";
import { useContext } from "react";
import { FilterElement_V2_Props } from "../../../../lib/interfaces/FilterTypes";
import { EditFilterContext } from "../../../../pages/admin/filters";
import { FilterWrapper } from "./FilterPreview";
import { v4 as uuidv4 } from "uuid";
import { makeRoomForNewFilter } from "../../../../lib/util";

const FilterBuffet = () => {
  const { metadata, dispatch } = useContext(EditFilterContext);
  const filterTypes = metadata.filters.ofType;
  const defaultParameters = metadata.filters.defaultParameters;
  const mergeParameters = mergeRight(defaultParameters);

  return (
    <ScrollArea type="auto" style={{height: "calc(100vh - 78px)"}}>
      <div style={{ maxWidth: "500px", margin: "auto" }}>
        <Group direction="column" position="center" grow mt={18} mb={18}>
          {Array.from(filterTypes).map(([name, filterCreationOptions]) => (
            <FilterSelection
              key={name}
              props={
                mergeParameters(
                  filterCreationOptions.defaultParameters
                ) as FilterElement_V2_Props
              }
            />
          ))}
        </Group>
      </div>
    </ScrollArea>
  );
};
export default FilterBuffet;

const FilterSelection = ({ props }: { props: FilterElement_V2_Props }) => {
  const { state, metadata, dispatch } = useContext(EditFilterContext);

  const handleFilterCreation = () => {
    const newId = uuidv4();
    const newFilter = {...props};
    newFilter.id = newId;
    newFilter.position = state.positionOfNextFilter;
    makeRoomForNewFilter(state.savedFilters, state.positionOfNextFilter)

    dispatch({
      type: "ADD_FILTER",
      payload: {id: newId, filter: newFilter}
    });
  };

  return (
    <Card>
      <FilterWrapper {...props} />
      <Button mt={18} onClick={handleFilterCreation}>
        {props.type}
      </Button>
    </Card>
  );
};
