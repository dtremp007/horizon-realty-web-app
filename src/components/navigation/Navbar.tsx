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
        <Show breakpoint="(min-width: 695px)" initialValue={false}>
          <div className="top-nav__logo-wrapper">
            {logoSvg}
            <div className="top-nav__logo-container">
            <p className="top-nav__horizon">HORIZON</p>
            <p className="top-nav__rlst">Real&nbsp;Estate</p>
            </div>
          </div>
          <MainMenu />
        </Show>
        <Show breakpoint="(max-width: 694px)">
          <div className="top-nav__icon-container">
            {/*
            Renders Burger or Backbutton based on route and searchMode
        */}
            <Show
              when={!state.searchMode}
              breakpoint="(max-width: 694px)"
              alt={<BackButton />}
              altOptions="force"
              forceAlt={state.youHaveToGoBack}
            >
              <Burger
                opened={state.menuOpen}
                size="md"
                onClick={handleDropdown}
              />
            </Show>
            {/* <Show
              when={!state.menuOpen}
              blacklistRoutes={["/listings/[id]"]}
            >
              <SearchBar mobileBrowsingMode={mobileBrowsingMode} />
            </Show>
            <Show
              when={!state.searchMode && !state.menuOpen}
              blacklistRoutes={[
                "/",
                "/listings/[id]",
                "/admin",
                "/admin/add-listing",
              ]}
              breakpoint="(max-width: 694px)"
            >
              <ActionIcon size="lg" onClick={() => router.push("/filter")}>
                <TbAdjustmentsHorizontal size={30} strokeWidth="1.5" />
              </ActionIcon>
            </Show> */}
          </div>
        </Show>
        <Show when={state.mountMenu}>
          <MainMenu />
        </Show>
        <Show breakpoint="(min-width: 695px)" initialValue={false}>
          <Button
            rightIcon={<FaWhatsapp size={30} />}
            onClick={() => window.open("https://wa.me/526251459646", "_blank")}
            uppercase
          >
            Contáctanos
          </Button>
        </Show>
      </div>
    </>
  );
}

const logoSvg = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 181.8 100.7" height={34}>
    <g style={{ fill: "white" }}>
      <path d="M71,51.1A99.44,99.44,0,0,1,58.1,40.2c-12.2,9.5-9.2,14.2-18.3,15.3-5,.5-4.1-.7-10.8,6.5a113.27,113.27,0,0,0-8.4,10.3L34,61.1c7.8-7.7,6.4,2.8,16.2-7.8,2.7-2.9,4.1-6.4,7.3-8.4l5.6,5.2c-1.3,6.2-2.5,8.1-3,16.1,3.2-1.8,5.7-5.2,8.5-7.5L95,35a6.68,6.68,0,0,1,1.6,1.4c7.1,7.6.4,8.5-2.9,14.4-1.5,2.7-3,6.5-4.2,8.7,9.6-1.4,2.6-8.3,18.6.3,29.6,16,18.5,0,30.4,5.5,8.6,3.9,23,12.5,30.8,14.9L136,53l-4.8,4.4c-3.4-2.5-5.1-5.6-8.2-8.4L100,24.2c-3.1,2.7-3.8,3.9-6.5,7.3-5.8,7.5-2.2,1.9-8.3,5.7C80.8,40,76,48.3,71,51.1Z" />
      <path d="M88.1,82c-3.8,1-17.1,5.4-19.5,7.5a143.91,143.91,0,0,1,23.5-3,202.85,202.85,0,0,1,40.5.6c6.1.7,12.2,1.7,18.2,3a175.33,175.33,0,0,1,24,7.3,74.55,74.55,0,0,1,7,3.2v.1l-.5-.1a25.78,25.78,0,0,0-3.3-1c-6.7-1.6-11.9-2.8-18.6-3.8-5.5-.8-11.2-1.5-16.7-1.9-26.4-3.2-75-.6-94.3,6.7h-.3c2.3-5.1,14-15,18.6-18.1.4-.3,3.8-2.4,3.9-2.6C49,80.1,22.8,88.3,0,96.8c2.1-2.1,7.4-4.7,10.1-6.2a153.45,153.45,0,0,1,22.3-10,147,147,0,0,1,17.2-5c19.1-4.3,54-6.2,82.3,1.4C119,75.9,100.3,78.7,88.1,82Z" />
      <ellipse cx="61.6" cy="14.9" rx="15.3" ry="14.9" />
    </g>
  </svg>
);
