import { useReducer, createContext, Reducer, Dispatch } from "react";

const NavigationContext = createContext<NavigationContextType>(
  {} as NavigationContextType
);

interface NavigationContextType {
  state: NavigationState;
  dispatch: Dispatch<NavigationAction>;
}

type Props = {
  children: React.ReactElement;
};

type NavigationState = {
  menuOpen: boolean;
  mountMenu: boolean;
  searchMode: boolean;
  navbarClass: "top-nav__container" | "top-nav__container open";
  youHaveToGoBack: boolean;
  listingPageScrollY: number;
};

type NavigationAction = {
    payload?: any;
  type:
    | "OPEN_MENU"
    | "CLOSE_MENU"
    | "MOUNT_MENU"
    | "UNMOUNT_MENU"
    | "TOGGLE_SEARCH_MODE"
    | "TOGGLE_BACK_BUTTON"
    | "BACK_BTN_ON"
    | "BACK_BTN_OFF"
    | "UPDATE_SCROLL_POSITION";
};

export const NavigationProvider = ({ children }: Props) => {
  const initialState: NavigationState = {
    menuOpen: false,
    mountMenu: false,
    searchMode: false,
    navbarClass: "top-nav__container",
    youHaveToGoBack: false,
    listingPageScrollY: 0,
  };

  const [state, dispatch] = useReducer(navigationReducer, initialState);

  return (
    <NavigationContext.Provider value={{ state, dispatch }}>
      {children}
    </NavigationContext.Provider>
  );
};

const navigationReducer: Reducer<NavigationState, NavigationAction> = (
  state: NavigationState,
  action: NavigationAction
): NavigationState => {
  switch (action.type) {
    case "OPEN_MENU":
      return {
        ...state,
        menuOpen: true,
        mountMenu: true,
        navbarClass: "top-nav__container open",
      };
    case "CLOSE_MENU":
      return {
        ...state,
        menuOpen: false,
        navbarClass: "top-nav__container",
      };
    case "MOUNT_MENU":
      return {
        ...state,
        mountMenu: true,
      };
    case "UNMOUNT_MENU":
      return {
        ...state,
        mountMenu: false,
      };
    case "TOGGLE_SEARCH_MODE":
      return {
        ...state,
        searchMode: !state.searchMode,
      };
    case "TOGGLE_BACK_BUTTON":
        return {
            ...state,
            youHaveToGoBack: !state.youHaveToGoBack
        }
    case "BACK_BTN_ON":
        return {
            ...state,
            youHaveToGoBack: true
        }
    case "BACK_BTN_OFF":
        return {
            ...state,
            youHaveToGoBack: false
        }
    case "UPDATE_SCROLL_POSITION":
        return {
            ...state,
            listingPageScrollY: action.payload
        }
    default:
      return state;
  }
};

export default NavigationContext;
