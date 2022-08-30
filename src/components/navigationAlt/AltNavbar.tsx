import Link from "next/link";
import { Burger, Button } from "@mantine/core";
import Show from "../HOC/Show";
import { FaWhatsapp } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { NextRouter, useRouter } from "next/router";
import BackButton from "../navigation/BackButton";

const links: Links[] = [
  { href: "/", label: "Home", isActive: (router) => router.pathname === "/" },
  {
    href: "/listings",
    label: "Propiedades",
    isActive: (router) => router.pathname === "/listings" && !router.query.view,
  },
  {
    href: {
      pathname: "/listings",
      query: { view: "map" },
    },
    label: "Mapa",
    isActive: (router) =>
      router.pathname === "/listings" && router.query.view === "map",
  },
];

const AltNavbar = () => {
  const [open, setOpen] = useState(false);
  const [goBack, setGoBack] = useState(false);
  const [isBlack, setIsBlack] = useState(true);
  const toggle = getToggleFunction("open", open);
  const router = useRouter();
  const navRef = useRef<HTMLDivElement>(null);

  //   const navbarStyle = {
  //     background: "var(--background-secondary)",
  //     background: "none",
  //     color: "var(--text-inverted)"
  //   };

  useEffect(() => {
    function handleRouterChange() {
      setOpen(false);
    }

    router.events.on("routeChangeComplete", handleRouterChange);

    return () => {
      router.events.on("routeChangeComplete", handleRouterChange);
    };
  }, []);

  useEffect(() => {
    if (router.pathname === "/listings/[id]") {
      setGoBack(true);
    } else {
      setGoBack(false);
    }

    if (router.pathname === "/") {
      navRef.current?.style.setProperty("color", "var(--text-inverted)");
      setIsBlack(true);
    } else {
      navRef.current?.style.setProperty("color", "var(--text-primary)");
      setIsBlack(false);
    }

    if (router.pathname === "/listings" && router.query.view === "map") {
      navRef.current?.style.setProperty(
        "background",
        "var(--background-secondary)"
      );
    } else {
      navRef.current?.style.setProperty("background", "none");
    }
  }, [router.pathname, router.query]);

  return (
    <nav className={toggle("alt-navbar")} ref={navRef}>
      <div className="alt-navbar__icon-container">
        <Show
          when={!goBack}
          breakpoint="(max-width: 694px)"
          initialValue
          alt={<BackButton />}
        >
          <Burger
            opened={open}
            size="md"
            onClick={() => {
              setOpen((prev) => !prev);
              if (router.pathname === "/") setIsBlack(prev => !prev)
            }}
            color={isBlack ? "black" : "white"}
          />
        </Show>
      </div>
      <div className={toggle("alt-navbar__content")}>
        <div className={toggle("alt-navbar__logo-wrapper")}>
          {logoSvg}
          <div className="alt-navbar__logo-text">
            <p className="horizon">HORIZON</p>
            <p className="rlst">Real&nbsp;Estate</p>
          </div>
        </div>
        <AltNavMenu open={open} toggle={toggle} />
        <Button
          className={toggle("alt-navbar__contact-btn")}
          rightIcon={<FaWhatsapp size={30} />}
          onClick={() => window.open("https://wa.me/526251459646", "_blank")}
          uppercase
          //   style={{backgroundColor: "#1971c2"}}
        >
          Contáctanos
        </Button>
      </div>
    </nav>
  );
};
export default AltNavbar;

type Links = Omit<AltNavMenuItem, "index" | "activeLink" | "toggle" | "open">;

type AltNavMenuProps = {
  open: boolean;
  toggle: Function;
};

const AltNavMenu = ({ toggle, open }: AltNavMenuProps) => {
  return (
    <div className={toggle("alt-navbar__menu")}>
      {links.map((link, index) => (
        <AltNavMenuItem
          key={index}
          {...link}
          index={index}
          open={open}
          toggle={toggle}
        />
      ))}
    </div>
  );
};

type AltNavMenuItem = {
  index: number;
  href:
    | string
    | {
        pathname: string;
        query: any;
      };
  label: string;
  open: boolean;
  toggle: Function;
  isActive: (router: NextRouter) => boolean;
};

const AltNavMenuItem = ({
  index,
  href,
  label,
  open,
  toggle,
  isActive,
}: AltNavMenuItem) => {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    ref.current?.style?.setProperty("--offset", `-${(index + 1) * 54}px`);
  }, []);

  return (
    <div className={toggle("alt-navbar__menu-item")} ref={ref}>
      <Link href={href}>
        <a className={isActive(router) ? "active-link" : ""}>{label}</a>
      </Link>
    </div>
  );
};

const logoSvg = (
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
