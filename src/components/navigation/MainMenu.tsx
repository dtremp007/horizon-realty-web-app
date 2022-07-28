import Link from "next/link";
import { useContext, useEffect, useState, useRef } from "react";
import { atom, useAtom } from "jotai";
import { useRouter } from "next/router";
import NavigationContext from "../../context/navigationContext";

export default function MainMenu() {
    const {state, dispatch} = useContext(NavigationContext);

  const [ulClass, setUlClass] = useState("main-nav__list");
  const router = useRouter();
  const activeLink = router.pathname;

  useEffect(() => {
    const handleRouterChange = () => {
        dispatch({type: "CLOSE_MENU"});

        setTimeout(() => {
            dispatch({type: "UNMOUNT_MENU"})
        }, 300);
    }

    router.events.on("routeChangeComplete", handleRouterChange)

    return () => {
        router.events.off("routeChangeComplete", handleRouterChange)
    }
  }, [])


  useEffect(() => {
    setUlClass(
      `main-nav__list ${state.menuOpen ? "animate-forward" : "animate-backward"}`
    );
  });

  return (
    <ul className={ulClass}>
      <li>
        <Link href="/">
          <a className={`main-nav__item ${activeLink === "/" ? "active-link" : ""}`}>Home</a>
        </Link>
      </li>
      <li>
        <Link href="/listings">
          <a className={`main-nav__item ${activeLink === "/listings" ? "active-link" : ""}`}>Listings</a>
        </Link>
      </li>
      <li>
        <Link href="/Settings">
          <a className={`main-nav__item ${activeLink === "/settings" ? "active-link" : ""}`}>Settings</a>
        </Link>
      </li>
    </ul>
  );
}

const getClassList = (isDesktop: boolean) => {
  if (isDesktop) {
    return "";
  }
};
