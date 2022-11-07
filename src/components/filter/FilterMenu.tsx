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
  Indicator,
  Group,
} from "@mantine/core";
import RadioButtonGroup from "./RadioButtonGroup";
import { useRouter } from "next/router";
import { useContext, useState, useMemo, useRef, useEffect } from "react";
import ListingsContext, {
  ListingsState,
} from "../../context/listingsContext/listingsContext";
import FilterElementWrapper from "../filter_v2/FilterElementWrapper";
import { IconAdjustmentsHorizontal } from "@tabler/icons";
import { NavContext } from "../../layouts/AltMainLayout";
import { getToggleFunction } from "../../../lib/util";
import { FilterElement_V2_Props } from "../../../lib/interfaces/FilterTypes";
import AuthUserContext from "../../context/authUserContext";

export default function FilterMenu() {
  const router = useRouter();
  const { listingsState, dispatch } = useContext(ListingsContext);
  const { nav_state, dispatch_to_nav } = useContext(NavContext);
  const { user } = useContext(AuthUserContext);

  const toggle_filter = getToggleFunction("open", nav_state.isFilterOpen);

  const resetFilters = () => {
    const payload = {} as { [key: string]: any };
    for (const [id, filter] of listingsState.filters) {
      if (filter.type === "CheckboxList") {
        // make sure there's children
        if (filter.children && filter.children.length > 0) {
          for (const checkbox of filter.children) {
            payload[checkbox.id] = checkbox.fallback;
          }
          continue;
        } else continue;
      }
      payload[filter.id] = filter.fallback;
    }
    const currentQuery = router.query;
    router.push({ query: Object.assign(currentQuery, payload) });
  };

  return (
    <>
      <div className="filter-menu__toggle-btn">
        <Indicator
          color="green"
          size={22}
          disabled={listingsState.activeFiltersCount === 0}
          label={listingsState.activeFiltersCount}
          inline
          position="bottom-start"
        >
          <ActionIcon
            size="lg"
            onClick={() => dispatch_to_nav({ type: "TOGGLE_FILTER" })}
          >
            <IconAdjustmentsHorizontal size={30} />
          </ActionIcon>
        </Indicator>
      </div>
      {user ? <FilterDebugConsole listingsState={listingsState} /> : null}
      <div className={toggle_filter("filter-menu__container")}>
        <form className={toggle_filter("filter-menu__form flow-content")}>
          <Space />
          {Array.from(listingsState.filters).map(([id, filter], index) => (
            <WrapsTheWrapper
              key={id}
              toggle_filter={toggle_filter}
              offset={index}
            >
              <FilterElementWrapper props={filter} />
            </WrapsTheWrapper>
          ))}
          <WrapsTheWrapper
            key="reset_btn"
            toggle_filter={toggle_filter}
            offset={listingsState.filters.size}
          >
            <Group position="right">
              <Button onClick={() => resetFilters()}>Reset</Button>
            </Group>
          </WrapsTheWrapper>
          <Space />
        </form>
      </div>
    </>
  );
}

type WrapsTheWrapperProps = {
  children: React.ReactNode;
  toggle_filter: (s: string) => string;
  offset: number;
};

const WrapsTheWrapper = ({
  children,
  toggle_filter,
  offset,
}: WrapsTheWrapperProps) => {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    divRef.current?.style?.setProperty("--offset", `-${(offset + 1) * 100}px`);
  }, []);

  return (
    <div className={toggle_filter("filter-menu__filter-wrapper")} ref={divRef}>
      {children}
    </div>
  );
};

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
              <div key={log.filterTitle}>
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
