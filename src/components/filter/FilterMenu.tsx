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
  Modal,
} from "@mantine/core";
import RadioButtonGroup from "./RadioButtonGroup";
import { useRouter } from "next/router";
import { useContext, useState, useMemo } from "react";
import ListingsContext, {
  ListingsState,
} from "../../context/listingsContext/listingsContext";
import { ListingSchema } from "../../../lib/interfaces/Listings";
import FilterElementWrapper from "../filter_v2/FilterElementWrapper";
import {IconAdjustments} from "@tabler/icons"
import { NavContext } from "../../layouts/AltMainLayout";
import { getToggleFunction } from "../../../lib/util";

export default function FilterMenu() {
  const router = useRouter();
  const { listingsState, dispatch } = useContext(ListingsContext);
  const {nav_state, dispatch_to_nav} = useContext(NavContext)

  const toggle_filter = getToggleFunction("open", nav_state.isFilterOpen)

  return (
    <>
    <div className="filter-menu__toggle-btn">
        <ActionIcon size="lg" onClick={() => dispatch_to_nav({type: "TOGGLE_FILTER"})}>
            <IconAdjustments size={30} />
        </ActionIcon>
    </div>
      <FilterDebugConsole listingsState={listingsState} />
      <div className={toggle_filter("filter-menu__container")}>
        <form className="filter-menu__form flow-content">
          <Space />
          {Array.from(listingsState.filters).map(([id, filter]) => (
            <FilterElementWrapper key={id} {...filter}/>
          ))}
          <Button onClick={() => dispatch({ type: "APPLY_FILTERS" })}>
            Apply Filters
          </Button>
          <Space />
        </form>
      </div>
    </>
  );
}

type FilterDebugConsoleProps = {
  listingsState: ListingsState;
};

const FilterDebugConsole = ({ listingsState }: FilterDebugConsoleProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Modal opened={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="debug-console">
          {listingsState.filterLog.length === 0 ? (
            <pre>
              <span className="comment">&#47;&#47; No filters</span>
            </pre>
          ) : (
            listingsState.filterLog.map((log) => (
              <div key={log.filterTitle} >
                <div
                  dangerouslySetInnerHTML={{ __html: log.stringifiedFunction }}
                />
                {log.entries.map((entry) => (
                  <div
                    key={entry.listingTitle}
                    dangerouslySetInnerHTML={{ __html: entry.stringify() }}
                  />
                ))}
              </div>
            ))
          )}
        </div>
      </Modal>
      <div className="modal-btn">
        <Button onClick={() => setModalOpen((prev) => !prev)}>
          Debug Modal
        </Button>
      </div>
    </>
  );
};
