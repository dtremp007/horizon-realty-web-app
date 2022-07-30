import { FaSearch, FaWhatsapp, FaAdjust } from "react-icons/fa";
import { useState, useRef, useEffect, useContext } from "react";
import { Burger, Button, ActionIcon } from "@mantine/core";
import DefaultButton from "../buttons/DefaultButton";
import SearchBar from "./SearchBar";
import { atom, useAtom } from "jotai";
import MainMenu from "./MainMenu";
import { useMediaQuery } from "@mantine/hooks";
import NavigationContext from "../../context/navigationContext";
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import { useRouter } from "next/router";

export default function Navbar() {
  const { state, dispatch } = useContext(NavigationContext);
  const isDesktop = useMediaQuery("(min-width: 695px)", false);
  const router = useRouter();
  const mobileBrowsingMode = router.pathname !== "/" && !isDesktop;

  useEffect(() => {
    if (!state.menuOpen) {
      setTimeout(() => {
        dispatch({ type: "UNMOUNT_MENU" });
      }, 300);
    }
  }, [state.menuOpen]);

  const handleDropdown = () => {
    if (state.menuOpen) {
      dispatch({ type: "CLOSE_MENU" });
    } else {
      dispatch({ type: "OPEN_MENU" });
    }
  };

  return (
    <>
      <div className={state.navbarClass}>
        {isDesktop && <MainMenu />}
        <div
          className="top-nav__icon-container"
          style={{
            justifyContent:
              state.searchMode || isDesktop ? "flex-end" : "space-between",
          }}
        >
          {!state.searchMode && (
            <Burger
              opened={state.menuOpen}
              size="md"
              onClick={handleDropdown}
            />
          )}
          {!state.menuOpen && <SearchBar mobileBrowsingMode={mobileBrowsingMode} />}
          {((mobileBrowsingMode && !state.searchMode) && !state.menuOpen) && (
            <ActionIcon size="lg" onClick={() => router.push("/filter")}>
              <TbAdjustmentsHorizontal size={30} strokeWidth="1.5" />
            </ActionIcon>
          )}
        </div>
        {state.mountMenu && <MainMenu />}
        <DefaultButton className="btn-contact">
          Contact Us
          <FaWhatsapp size={32} />
        </DefaultButton>
      </div>
    </>
  );
}
