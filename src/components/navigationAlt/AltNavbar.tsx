import Link from "next/link";
import { ActionIcon, Burger, Button, Tooltip } from "@mantine/core";
import Show from "../HOC/Show";
import { FaWhatsapp } from "react-icons/fa";
import { useState, useRef, useEffect, useContext, useCallback } from "react";
import { NextRouter, useRouter } from "next/router";
import BackButton from "../navigation/BackButton";
import { IconChevronDown } from "@tabler/icons";
import React from "react";
import AuthUserContext from "../../context/authUserContext";
import { NavContext } from "../../layouts/AltMainLayout";
import { useWindowScroll } from "@mantine/hooks";

const links: Links[] = [
  { href: "/", label: "Home", isActive: (router) => router.pathname === "/" },
  {
    href: {
      pathname: "/listings",
      query: { view: "map" },
    },
    label: "Mapa",
    isActive: (router) =>
      router.pathname === "/listings" && router.query.view === "map",
  },
  {
    label: "Propiedades",
    containsChildren: true,
    childLinks: [
      {
        href: {
          pathname: "/listings",
          query: { filter: "CASA" },
        },
        label: "Casas",
        isActive: (router) => "/listings" && router.query.filter === "CASA",
      },
      {
        href: {
          pathname: "/listings",
          query: { filter: "LOTE" },
        },
        label: "Lotes",
        isActive: (router) => "/listings" && router.query.filter === "LOTE",
      },
      {
        href: {
          pathname: "/listings",
          query: { filter: "BODEGA" },
        },
        label: "Casa Bodegas",
        isActive: (router) => "/listings" && router.query.filter === "BODEGA",
      },
    ],
    isActive: (router) => false,
  },
];

const AltNavbar = () => {
  const { nav_state, dispatch_to_nav, toggle_menu, toggle_header } =
    useContext(NavContext);
  const router = useRouter();
  const navRef = useRef<HTMLDivElement>(null);
  const { user } = useContext(AuthUserContext);
  const [scroll] = useWindowScroll();
  const pathRef = useRef(router.pathname);

  const logoClickhandler = (e: React.MouseEvent) => {
    if (user) {
      router.push("/admin/listings");
    } else {
      if (e.metaKey) {
        router.push("/signin");
      } else {
        if (router.pathname === "/") return;
        router.push("/");
      }
    }
  };

  const adjustNavbarStyle = useCallback(
    (isTextBlack: boolean) => {
      if (isTextBlack) {
        navRef.current?.style.setProperty("color", "var(--text-inverted)");
        dispatch_to_nav({ type: "TOGGLE_IS_BLACK", payload: true });
        navRef.current?.style.setProperty("background", "none");
      } else {
        navRef.current?.style.setProperty("color", "var(--text-primary)");
        dispatch_to_nav({ type: "TOGGLE_IS_BLACK", payload: false });
        navRef.current?.style.setProperty(
          "background",
          "var(--background-secondary)"
        );
      }
    },
    [router.pathname]
  );

  useEffect(() => {
    function handleRouterChange(e: string) {
      dispatch_to_nav({ type: "TOGGLE_MENU_WATCH_FILTER", payload: false });
    }

    router.events.on("routeChangeComplete", handleRouterChange);

    return () => {
      router.events.on("routeChangeComplete", handleRouterChange);
    };
  }, [nav_state.isHeaderExpanded]);

  useEffect(() => {
    if (router.pathname !== "/") return;

    adjustNavbarStyle(scroll.y === 0);
  }, [scroll]);

  useEffect(() => {
    if (router.pathname === "/listings/[id]") {
      dispatch_to_nav({ type: "WE'RE_AT_A_DEADEND" });
    } else {
      dispatch_to_nav({ type: "GO_AS_YOU_PLEASE" });
    }

    adjustNavbarStyle(router.pathname === "/");
  }, [router.pathname, router.query]);

  return (
    <nav className={toggle_header("alt-navbar")} ref={navRef}>
      <div className="alt-navbar__icon-container">
        <Show
          when={!nav_state.youHaveToGoBack}
          breakpoint="(max-width: 694px)"
          initialValue
          alt={<BackButton />}
        >
          <Burger
            opened={nav_state.isMenuOpen || nav_state.isFilterOpen}
            size="md"
            onClick={() => {
              if (nav_state.isFilterOpen) {
                dispatch_to_nav({ type: "TOGGLE_FILTER" });
                return;
              }
              dispatch_to_nav({ type: "TOGGLE_MENU" });
              if (router.pathname === "/")
                dispatch_to_nav({ type: "TOGGLE_IS_BLACK" });
            }}
            color={nav_state.burgerIsBlack ? "black" : "white"}
          />
        </Show>
      </div>
      <div className={toggle_menu("alt-navbar__content")}>
        <Tooltip label={user ? "Go to admin site" : "Home"}>
          <div
            className={toggle_menu("alt-navbar__logo-wrapper")}
            onClick={logoClickhandler}
          >
            {logoSvg}
            <div className="alt-navbar__logo-text">
              <p className="horizon">HORIZON</p>
              <p className="rlst">Real&nbsp;Estate</p>
            </div>
          </div>
        </Tooltip>
        <AltNavMenu />

        <Show
          blacklistRoutes={["/listings/[id]"]}
          altOptions="isBlacklisted"
          alt={
            <div
              style={{ width: "180.98px", height: "36px", marginRight: "10px" }}
            />
          }
        >
          <Button
            className={toggle_menu("alt-navbar__contact-btn")}
            variant="default"
            leftIcon={<FaWhatsapp size={30} />}
            onClick={() => window.open("https://wa.me/526251459646", "_blank")}
            uppercase
          >
            (625)145 9646
          </Button>
        </Show>
      </div>
    </nav>
  );
};
export default AltNavbar;

type Links = Omit<AltNavMenuItem, "index" | "activeLink" | "toggle" | "open">;

const AltNavMenu = () => {
  const { nav_state, dispatch_to_nav, links, toggle_menu } =
    useContext(NavContext);

  return (
    <div className={toggle_menu("alt-navbar__menu")}>
      {links.map((link, index) => (
        <AltNavMenuItem key={index} {...link} index={index} />
      ))}
    </div>
  );
};

export type AltNavMenuItem = {
  index: number;
  href?:
    | string
    | {
        pathname: string;
        query: any;
      };
  label: string;
  isActive: (router: NextRouter) => boolean;
  containsChildren?: boolean;
  childLinks?: Links[];
};

const AltNavMenuItem = ({
  index,
  href,
  label,
  isActive,
  containsChildren,
  childLinks,
}: AltNavMenuItem) => {
  const { nav_state, dispatch_to_nav, links, toggle_menu } =
    useContext(NavContext);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    ref.current?.style?.setProperty("--offset", `-${(index + 1) * 54}px`);
  }, []);

  if (containsChildren) {
    return (
      <AltNavSubMenu
        ref={ref}
        childLinks={childLinks as Links[]}
        label={label}
      />
    );
  }

  return (
    <div className={toggle_menu("alt-navbar__menu-item")} ref={ref}>
      <Link href={href as string}>
        <a className={isActive(router) ? "nav-link active-link" : "nav-link"}>
          {label}
        </a>
      </Link>
    </div>
  );
};

type AltNavSubMenuProps = {
  childLinks: Links[];
  label: string;
};

const AltNavSubMenu = React.forwardRef<HTMLDivElement, AltNavSubMenuProps>(
  ({ childLinks, label }, ref) => {
    const { nav_state, dispatch_to_nav, links, toggle_menu } =
      useContext(NavContext);
    const [subOpen, setSubOpen] = useState(false);
    const toggleSub = getToggleFunction("open", subOpen);
    const subRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
      const closeSubMenu = () => {
        setSubOpen(false);
      };

      router.events.on("routeChangeComplete", closeSubMenu);

      return () => {
        router.events.off("routeChangeComplete", closeSubMenu);
      };
    }, []);

    return (
      <div className={toggle_menu("alt-navbar__menu-parent")} ref={ref}>
        <span onClick={() => setSubOpen((prev) => !prev)}>
          {label}
          <IconChevronDown
            style={{
              transform: subOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "all 200ms ease-in-out",
            }}
            size={20}
          />
        </span>
        <div className={toggleSub("alt-navbar__child-menu")} ref={subRef}>
          {childLinks.map((link, index) => (
            <AltNavSubMenuItem
              key={index}
              index={index}
              toggleSub={toggleSub}
              {...link}
            />
          ))}
        </div>
      </div>
    );
  }
);

AltNavSubMenu.displayName = "AltNavSubMenu";

const AltNavSubMenuItem = ({
  href,
  label,
  index,
  toggleSub,
  isActive,
}: Links & { index: number; toggleSub: Function }) => {
  const childRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    childRef.current?.style?.setProperty(
      "--child-offset",
      `-${(index + 1) * 40}px`
    );
  }, []);

  return (
    <div className={toggleSub("alt-navbar__child-item")} ref={childRef}>
      <Link href={href as string}>
        <a className={isActive(router) ? "nav-link active-link" : "nav-link"}>
          {label}
        </a>
      </Link>
    </div>
  );
};

export const logoSvg = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 181.8 100.7" height={34}>
    <g style={{ fill: "currentColor" }}>
      <path
        style={{ fill: "var(--logo-yellow)" }}
        d="M71,51.1A99.44,99.44,0,0,1,58.1,40.2c-12.2,9.5-9.2,14.2-18.3,15.3-5,.5-4.1-.7-10.8,6.5a113.27,113.27,0,0,0-8.4,10.3L34,61.1c7.8-7.7,6.4,2.8,16.2-7.8,2.7-2.9,4.1-6.4,7.3-8.4l5.6,5.2c-1.3,6.2-2.5,8.1-3,16.1,3.2-1.8,5.7-5.2,8.5-7.5L95,35a6.68,6.68,0,0,1,1.6,1.4c7.1,7.6.4,8.5-2.9,14.4-1.5,2.7-3,6.5-4.2,8.7,9.6-1.4,2.6-8.3,18.6.3,29.6,16,18.5,0,30.4,5.5,8.6,3.9,23,12.5,30.8,14.9L136,53l-4.8,4.4c-3.4-2.5-5.1-5.6-8.2-8.4L100,24.2c-3.1,2.7-3.8,3.9-6.5,7.3-5.8,7.5-2.2,1.9-8.3,5.7C80.8,40,76,48.3,71,51.1Z"
      />
      <path
        style={{ fill: "var(--logo-red)" }}
        d="M88.1,82c-3.8,1-17.1,5.4-19.5,7.5a143.91,143.91,0,0,1,23.5-3,202.85,202.85,0,0,1,40.5.6c6.1.7,12.2,1.7,18.2,3a175.33,175.33,0,0,1,24,7.3,74.55,74.55,0,0,1,7,3.2v.1l-.5-.1a25.78,25.78,0,0,0-3.3-1c-6.7-1.6-11.9-2.8-18.6-3.8-5.5-.8-11.2-1.5-16.7-1.9-26.4-3.2-75-.6-94.3,6.7h-.3c2.3-5.1,14-15,18.6-18.1.4-.3,3.8-2.4,3.9-2.6C49,80.1,22.8,88.3,0,96.8c2.1-2.1,7.4-4.7,10.1-6.2a153.45,153.45,0,0,1,22.3-10,147,147,0,0,1,17.2-5c19.1-4.3,54-6.2,82.3,1.4C119,75.9,100.3,78.7,88.1,82Z"
      />
      <ellipse
        style={{ fill: "var(--logo-orange)" }}
        cx="61.6"
        cy="14.9"
        rx="15.3"
        ry="14.9"
      />
    </g>
  </svg>
);

/**
 * Maybe poorly named, but it takes a class that needs to be toggled,
 * and a condition, and returns a function that will toggle the passed in class.
 */
function getToggleFunction(className: string, condition: boolean) {
  /**
   * This is a closure that takes class name to toggle, and it takes
   * the default class list that shouldn't be toggled.
   *
   * The condition is passed into the parent function.
   */
  return (defaultClass: string) => {
    if (condition) {
      return defaultClass + " " + className;
    }

    return defaultClass;
  };
}
