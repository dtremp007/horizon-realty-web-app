import Link from "next/link";
import { useContext, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import NavigationContext from "../../context/navigationContext";
import { Button } from "@mantine/core";
import Show from "../HOC/Show";
import { FaWhatsapp } from "react-icons/fa";
import AuthUserContext from "../../context/authUserContext";

export default function MainMenu() {
    const {state, dispatch} = useContext(NavigationContext);
    const {user} = useContext(AuthUserContext);

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
          <a className={`main-nav__item ${activeLink === "/listings" && !router.query.view ? "active-link" : ""}`}>Propiedades</a>
        </Link>
      </li>
      <li>
        <Link href={{
            pathname: "/listings",
            query: {view: "map"}
        }}>
          <a className={`main-nav__item ${activeLink === "/listings" && router.query.view ? "active-link" : ""}`}>Mapa</a>
        </Link>
      </li>
      {user && <li>
        <Link href="/admin">
          <a className={`main-nav__item ${activeLink === "/admin" ? "active-link" : ""}`}>Admin</a>
        </Link>
      </li>}
      {/* <li>
      <Show breakpoint="(max-width: 694px)" initialValue={false}>
        <Button rightIcon={<FaWhatsapp size={30} />} onClick={() => window.open("https://wa.me/526251189323", "_blank")} uppercase >
        Contáctanos
        </Button>
        </Show>
      </li> */}
    </ul>
  );
}

const getClassList = (isDesktop: boolean) => {
  if (isDesktop) {
    return "";
  }
};
