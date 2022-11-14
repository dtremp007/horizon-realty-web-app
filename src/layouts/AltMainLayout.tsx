import AltNavbar, {
  AltNavMenuItem,
} from "../components/navigationAlt/AltNavbar";
import Show from "../../src/components/HOC/Show";
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";
import { createContext, Dispatch, Reducer, useReducer } from "react";
import { getToggleFunction } from "../../lib/util";

type Props = {
  children: React.ReactNode;
};

type NavState = {
  isHeaderExpanded: boolean;
  isMenuOpen: boolean;
  isSubmenuOpen: boolean;
  youHaveToGoBack: boolean;
  burgerIsBlack: boolean;
  isFilterOpen: boolean;
  previousScrollY: number;
};

type NavContext = {
  nav_state: NavState;
  dispatch_to_nav: Dispatch<NavActions>;
  links: Links[];
  toggle_menu: (className: string) => string;
  toggle_header: (className: string) => string;
};

export const NavContext = createContext({} as NavContext);

export type Links = Omit<
  AltNavMenuItem,
  "index" | "activeLink" | "toggle" | "open"
>;

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
  { href: "/categories", label: "Propiedades", isActive: (router) => router.pathname === "/categories" },
  //   {
  //     label: "Propiedades",
  //     containsChildren: true,
  //     childLinks: [
  //       {
  //         href: {
  //           pathname: "/listings",
  //           query: { listingType: "CASA" },
  //         },
  //         label: "Casas",
  //         isActive: (router) =>
  //           "/listings" && router.query.listingType === "CASA",
  //       },
  //       {
  //         href: {
  //           pathname: "/listings",
  //           query: { listingType: "BODEGA" },
  //         },
  //         label: "Casa Bodegas",
  //         isActive: (router) =>
  //           "/listings" && router.query.listingType === "BODEGA",
  //       },
  //       {
  //         href: {
  //           pathname: "/listings",
  //           query: { listingType: "APARTMENTS" },
  //         },
  //         label: "Apartments",
  //         isActive: (router) =>
  //           "/listings" && router.query.listingType === "APARTMENTS",
  //       },
  //       {
  //         href: {
  //           pathname: "/listings",
  //           query: { filter: "LOTES_RESIDENCIALES" },
  //         },
  //         label: "Lotes",
  //         isActive: (router) =>
  //           "/listings" && router.query.filter === "LOTES_RESIDENCIALES",
  //       },
  //     ],
  //     isActive: (router) => false,
  //   },
];

const AltMainLayout = ({ children }: Props) => {
  const initialState: NavState = {
    isHeaderExpanded: false,
    isMenuOpen: false,
    isSubmenuOpen: false,
    youHaveToGoBack: false,
    burgerIsBlack: true,
    isFilterOpen: false,
    previousScrollY: 0,
  };

  const [nav_state, dispatch_to_nav] = useReducer(navReducer, initialState);

  const toggle_menu = getToggleFunction("open", nav_state.isMenuOpen);
  const toggle_header = getToggleFunction("open", nav_state.isHeaderExpanded);

  return (
    <NavContext.Provider
      value={{ nav_state, dispatch_to_nav, links, toggle_menu, toggle_header }}
    >
      <AltNavbar />
      <main className="alt-layout__main">{children}</main>
      <Show blacklistRoutes={["/listings/[id]", "/test"]}>
        <Footer />
      </Show>
    </NavContext.Provider>
  );
};
export default AltMainLayout;

type NavActions = {
  type:
    | "TOGGLE_HEADER"
    | "TOGGLE_MENU"
    | "WE'RE_AT_A_DEADEND"
    | "GO_AS_YOU_PLEASE"
    | "TOGGLE_IS_BLACK"
    | "TOGGLE_FILTER"
    | "UPDATE_SCROLL_Y"
    | "TOGGLE_MENU_WATCH_FILTER";
  payload?: any;
};

const navReducer: Reducer<NavState, NavActions> = (state, action) => {
  switch (action.type) {
    case "TOGGLE_HEADER":
      return {
        ...state,
        isHeaderExpanded: action.payload ?? !state.isHeaderExpanded,
      };
    case "TOGGLE_MENU":
      return {
        ...state,
        isHeaderExpanded: action.payload ?? !state.isHeaderExpanded,
        isMenuOpen: action.payload ?? !state.isHeaderExpanded,
      };
    case "WE'RE_AT_A_DEADEND":
      return {
        ...state,
        youHaveToGoBack: true,
      };
    case "GO_AS_YOU_PLEASE":
      return {
        ...state,
        youHaveToGoBack: false,
      };
    case "TOGGLE_IS_BLACK":
      return {
        ...state,
        burgerIsBlack: action.payload ?? !state.burgerIsBlack,
      };
    case "TOGGLE_FILTER":
      return {
        ...state,
        isHeaderExpanded: action.payload ?? !state.isHeaderExpanded,
        isFilterOpen: action.payload ?? !state.isFilterOpen,
      };
    case "TOGGLE_MENU_WATCH_FILTER":
      if (state.isFilterOpen) return state;
      return {
        ...state,
        isHeaderExpanded: action.payload ?? !state.isHeaderExpanded,
        isMenuOpen: action.payload ?? !state.isHeaderExpanded,
      };
    default:
      return state;
  }
};

const Footer = () => {
  return (
    <footer className="flow-content">
      <div className="footer__header">
        <h1>Horizon Real Estate</h1>
        <div>
          <a href="https://web.facebook.com/horizonbienesraices22">
            <FaFacebook size={32} />
          </a>
          <a href="https://instagram.com/horizonbienesraices?igshid=YmMyMTA2M2Y=">
            <FaInstagram size={32} />
          </a>
        </div>
      </div>
      <div>
        <FaWhatsapp size={32} />
        <a href="https://wa.me/526251459646">625 145 9646</a>
      </div>
      <div>
        <AiOutlineMail size={32} />
        <a href="mailto: info@horizonrealty.mx">info@horizonrealty.mx</a>
      </div>
    </footer>
  );
};
