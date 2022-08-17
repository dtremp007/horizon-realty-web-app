import { FaSearch, FaWhatsapp, FaAdjust } from "react-icons/fa";
import { useState, useRef, useEffect, useContext } from "react";
import { Burger, Button, ActionIcon } from "@mantine/core";
import DefaultButton from "../buttons/DefaultButton";
import SearchBar from "./SearchBar";
import MainMenu from "./MainMenu";
import { useMediaQuery } from "@mantine/hooks";
import NavigationContext from "../../context/navigationContext";
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import { useRouter } from "next/router";
import Show from "../HOC/Show";
import BackButton from "./BackButton";

/*
    TODO:
    - I completely disabled search button.
*/

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

        {/*
            Renders desktop menu
        */}
        <Show breakpoint="(min-width: 695px)">
          <MainMenu />
        </Show>
        <div
          className="top-nav__icon-container"
          style={{
            justifyContent:
              state.searchMode || isDesktop ? "flex-end" : "space-between",
          }}
        >


        {/*
            Renders Burger or Backbutton based on route and searchMode
        */}
          <Show when={!state.searchMode} breakpoint="(max-width: 694px)" alt={<BackButton/>} altOptions="force" forceAlt={state.youHaveToGoBack}>
            <Burger
              opened={state.menuOpen}
              size="md"
              onClick={handleDropdown}
            />
          </Show>
          <Show when={/*!state.menuOpen*/false} blacklistRoutes={["/listings/[id]"]}>
            <SearchBar mobileBrowsingMode={mobileBrowsingMode} />
          </Show>
          <Show when={/*!state.searchMode && !state.menuOpen*/false} blacklistRoutes={["/", "/listings/[id]", "/admin", "/admin/add-listing"]} breakpoint="(max-width: 694px)" >
            <ActionIcon size="lg" onClick={() => router.push("/filter")}>
              <TbAdjustmentsHorizontal size={30} strokeWidth="1.5" />
            </ActionIcon>
          </Show>
        </div>
        <Show when={state.mountMenu}>
          <MainMenu />
        </Show>
        <Show breakpoint="(min-width: 695px)" initialValue={false}>
        <Button rightIcon={<FaWhatsapp size={30} />} onClick={() => window.open("https://wa.me/526251459646", "_blank")} uppercase >
        Contáctanos
        </Button>
        </Show>
      </div>
    </>
  );
}
